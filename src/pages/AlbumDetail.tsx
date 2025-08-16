import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ApiGetAlbumItemsType,
  ApiGetArtistType,
  PlayTrack,
  SearchGenreTrackType,
  Track,
} from "../types/types";
import {
  apiGetAlbumList,
  apiGetTrackListByAlbumId,
  apiPostComment,
  apiGetComments,
  apiUpdateComment,
  apiDeleteComment,
  apiReportComment,
  apiGetAlbumLikeStatus,
  apiPostAlbumLike,
  apiDeleteAlbumLike,
  apiGetTrackList,
  apiGetArtistList,
} from "../api/api";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../store/userInfo";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import CommentReportModal from "./CommentReportModal";
import { hostInstance } from "../api/hostInstance";
import { mapTrackToTrackListDataType } from "./SearchResult";
import { TrackListDataType } from "./PlaylistTrack";
import { usePlayer } from "./player/PlayerContext";
import { addRecentTrackInfo } from "../store/recentTrackInfo";
import { getRecentTrack, setRecentTrack } from "../helper/storage";
import { mapPlayTrackToTrackListDataType } from "../components/SideBar";

interface Comment {
  commentId: number;
  userId: number;
  email: string;
  targetId: string;
  targetType: string;
  content: string;
  createDate: string;
  updateDate: string;
  hasReportedByUser: number;
  // reportedBy: number[];  // 신고한 유저의 ID를 저장
}

const AlbumDetail = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const id = searchParams.get("id");

  const user = useSelector(selectUserInfo);

  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [likeLoading, setLikeLoading] = useState(false); // 좋아요 처리중 상태

  console.log(user);
  const [albumData, setAlbumData] = useState<ApiGetAlbumItemsType | null>();
  // const [trackList, setTrackList] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const [isReportFormOpen, setIsReportFormOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>("");

  const [commentIdToReport, setCommentIdToReport] = useState<number | null>(
    null
  ); // 신고할 댓글 ID 상태 추가
  const [reportedComments, setReportedComments] = useState<number[]>([]);

  const dispatch = useDispatch();
  const { setCurrentTrack, setIsPlaying, setTrackList, setCurrentIndex } =
    usePlayer();
  const [data, setData] = useState<SearchGenreTrackType>({
    tracks: {
      items: [],
    },
  });

  const [artistData, setArtistData] = useState<ApiGetArtistType>({
    artists: {
      href: "",
      items: [],
      limit: 0,
      next: "",
      offset: 0,
      previous: "",
      total: 0,
    },
  });
  // 트랙 클릭하여 곡 재생
  const clickTrack = async (id: string, index: number) => {
    const track = data.tracks.items.find((item) => item.id === id);
    if (!track) return;

    await hostInstance.post("track/save", {
      trackId: track.id,
      trackName: track.name,
      artists: track.artists[0].name,
      trackDuration: track.duration_ms,
      releaseDate: track.album.release_date,
      trackImageUrl: track.album.images[1].url,
    });
    await hostInstance.post("track/save/date", {
      trackId: track.id,
    });

    // 전체 트랙 목록을 설정(다음곡 버튼 용도)
    const convertedList: TrackListDataType[] = data.tracks.items.map((track) =>
      mapTrackToTrackListDataType(track, 0, "")
    );
    setTrackList(convertedList);

    // 현재 트랙 설정 및 재생
    const simplifiedTrack: PlayTrack = {
      id: track.id,
      name: track.name,
      duration_ms: track.duration_ms,
      artists: track.artists.map((a) => ({ name: a.name })),
      album: {
        release_date: track.album.release_date,
        images: track.album.images,
      },
    };
    const recentTrackModify: TrackListDataType = {
      playlistId: 0,
      trackId: simplifiedTrack.id,
      trackName: simplifiedTrack.name,
      artists: simplifiedTrack.artists[0].name,
      trackDuration: simplifiedTrack.duration_ms,
      releaseDate: simplifiedTrack.album.release_date,
      trackImageUrl: simplifiedTrack.album.images[1].url,
      playlistTrackCreateDate: "",
    };

    setCurrentIndex(index);
    // 현재 트랙 재생
    setCurrentTrack(recentTrackModify);
    // 버튼 누르면 무조건 재생상태로 변경
    setIsPlaying(true);

    if (user.username !== "") {
      dispatch(addRecentTrackInfo(simplifiedTrack));
      const stored = getRecentTrack();
      const updated = [
        simplifiedTrack,
        ...stored.filter(
          (t) =>
            t.name !== simplifiedTrack.name ||
            t.artists !== simplifiedTrack.artists
        ),
      ];
      if (updated.length > 10) updated.pop();
      setRecentTrack(updated);
    }
  };
  useEffect(() => {
    if (!search) return;

    const fetchData = async () => {
      const [trackRes, artistRes] = await Promise.all([
        apiGetTrackList(search),
        apiGetArtistList(search),
      ]);
      setData(trackRes);
      setArtistData(artistRes);
    };

    fetchData();
  }, [search]);

  useEffect(() => {
    if (!albumData?.id) return;

    const fetchLikeStatus = async () => {
      try {
        const data = await apiGetAlbumLikeStatus(albumData.id);
        setLiked(data);
      } catch (error) {
        console.error("좋아요 상태 조회 실패", error);
      }
    };

    fetchLikeStatus();
  }, [albumData?.id]);

  // AlbumDetail.tsx 의 toggleLike 함수
  const toggleLike = async () => {
    if (!albumData) return;
    setLikeLoading(true);

    try {
      if (liked) {
        await apiDeleteAlbumLike(albumData.id); // albumData.id는 그대로 전달
        setLiked(false);
      } else {
        // apiPostAlbumLike에 albumData 전체를 전달 (또는 AlbumVO에 필요한 필드를 추출하여 전달)
        await apiPostAlbumLike(albumData); // 이 부분 수정
        setLiked(true);
      }
    } catch (error) {
      alert("좋아요 처리 중 오류가 발생했습니다.");
      console.error("좋아요 토글 실패", error);
    } finally {
      setLikeLoading(false);
    }
  };

  useEffect(() => {
    console.log("확인 : " + user.id);
    const fetchData = async () => {
      if (!search || !id) return;

      try {
        const albumList = await apiGetAlbumList(search, 0);
        const matchedAlbum = albumList.albums.items.find(
          (item: ApiGetAlbumItemsType) => item.id === id
        );
        setAlbumData(matchedAlbum || null);

        // ✅ 앨범 정보를 찾은 경우 좋아요 상태도 같이 조회
        if (matchedAlbum) {
          const likeStatus = await apiGetAlbumLikeStatus(matchedAlbum.id);
          console.log(likeStatus);
          setLiked(likeStatus);
        }

        const trackRes = await apiGetTrackListByAlbumId(id);
        setTrackList(trackRes.items || []);

        const commentsData = await apiGetComments("ALBUM", id, user.id);
        console.log("Fetched Comments:", commentsData); // 여기에 reportedBy 값도 확인
        setComments(commentsData);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("데이터 불러오기 실패:", error);
          if (error.response && error.response.status === 500) {
            alert("서버에서 오류가 발생했습니다. 나중에 다시 시도해주세요.");
          }
        } else {
          console.error("예상치 못한 오류:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, id]);

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await apiPostComment("ALBUM", id!, newComment, user.id);

      if (id) {
        const updatedComments = await apiGetComments("ALBUM", id, user.id);
        setComments(updatedComments);
      }

      setNewComment("");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  // 신고 버튼 클릭 시 호출되는 함수
  const handleReport = async (commentId: number) => {
    // 신고한 댓글인 경우 신고 버튼 비활성화
    const comment = comments.find((c) => c.commentId === commentId);
    if (comment?.hasReportedByUser) {
      alert("이미 신고한 댓글입니다.");
      return;
    }

    // 신고 처리 로직
    setIsReportFormOpen(true);
    setCommentIdToReport(commentId);
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      alert("신고 사유를 입력해주세요.");
      return;
    }

    if (commentIdToReport === null) {
      alert("잘못된 접근입니다.");
      return;
    }

    try {
      const userId = user.id; // 신고한 유저의 ID

      // 신고 요청 보내기
      await apiReportComment(commentIdToReport, reportReason, userId);

      // 신고된 댓글의 hasReportedByUser를 1로 업데이트
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === commentIdToReport
            ? { ...comment, hasReportedByUser: 1 } // hasReportedByUser 1로 업데이트
            : comment
        )
      );

      // 신고된 댓글을 reportedComments 배열에 추가
      setReportedComments((prev) => [...prev, commentIdToReport]);

      setReportReason("");
      setIsReportFormOpen(false);
      alert("신고가 완료되었습니다.");
    } catch (error) {
      console.error("신고 실패:", error);
      alert("신고 실패: " + error || "알 수 없는 오류 발생");
    }
  };

  const handleReportCancel = () => {
    setIsReportFormOpen(false);
    setReportReason("");
    setCommentIdToReport(null); // 신고할 댓글 ID 초기화
  };

  const handleEdit = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditedContent(content);
  };

  const handleEditSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (editedContent.trim()) {
      try {
        await apiUpdateComment(editingCommentId!, editedContent);

        if (id) {
          const updatedComments = await apiGetComments("ALBUM", id, user.id);
          setComments(updatedComments);
        }

        setEditingCommentId(null);
        setEditedContent("");
      } catch (error) {
        console.error("댓글 수정 실패:", error);
      }
    }
  };

  const handleDeleteClick = (commentId: number) => {
    setCommentToDelete(commentId);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (commentToDelete !== null) {
      try {
        await apiDeleteComment(commentToDelete);

        if (id) {
          const updatedComments = await apiGetComments("ALBUM", id, user.id);
          setComments(updatedComments);
        }

        setIsModalOpen(false);
        setCommentToDelete(null);
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        setIsModalOpen(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsModalOpen(false);
    setCommentToDelete(null);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${
      d.getMonth() + 1
    }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
  };

  if (loading) return <div className="text-center p-10">로딩 중...</div>;
  if (!albumData) {
    return (
      <div className="text-center p-10">앨범 정보를 찾을 수 없습니다.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      {/* Album info */}
      <div className="flex flex-col items-center mb-12 text-center">
        <img
          className="w-60 h-60 rounded-xl shadow-lg object-cover mb-6"
          src={albumData.images?.[1]?.url || albumData.images?.[0]?.url}
          alt={`${albumData.name} 커버`}
        />
        <p className="text-3xl font-extrabold">{albumData.name}</p>
        <p className="text-gray-500 text-sm font-medium mt-1">
          {albumData.artists?.[0]?.name}
        </p>
        <button
          onClick={toggleLike}
          disabled={likeLoading}
          className={`px-4 py-2 rounded-lg transition ${
            liked ? "bg-red-500 text-white" : "bg-gray-300 text-gray-800"
          }`}
        >
          {liked ? "❤️ 좋아요 취소" : "🤍 좋아요"}
        </button>
      </div>

      {/* Track list */}
      <ul className="space-y-4">
        {data.tracks.items.map((track, index) => (
          <li key={track.id}>
            <button
              type="button"
              onClick={() => clickTrack(track.id, index)}
              className="block p-4 rounded-xl hover:bg-indigo-50 transition w-full cursor-pointer"
            >
              <div className="flex items-center w-full">
                <div className="text-xl font-bold w-8 text-indigo-600">
                  {index + 1}
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-left line-clamp-1">
                    {track.name}
                  </p>
                  <p className="text-sm text-gray-500 text-left">
                    {track.artists?.[0]?.name}
                  </p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* 댓글 작성 폼 */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">댓글 작성</h3>

        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setNewComment(e.target.value)
            }
            placeholder="댓글을 작성하세요..."
            className="w-full p-3 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full mt-2 p-3 bg-indigo-600 text-white rounded-lg"
          >
            댓글 작성
          </button>
        </form>
      </div>

      {/* 댓글 리스트 */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">작성된 댓글</h3>

        <ul className="mt-4 space-y-4">
          {comments
            .sort(
              (a, b) =>
                new Date(b.createDate).getTime() -
                new Date(a.createDate).getTime()
            ) // 내림차순 정렬
            .map((comment) => {
              const isReported = comment.hasReportedByUser === 1; // 신고 여부 확인

              return (
                <li
                  key={comment.commentId}
                  className="p-4 border-b flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <p className="font-medium">{comment.email}</p>
                    <br />
                    {editingCommentId === comment.commentId ? (
                      <form onSubmit={handleEditSubmit} className="w-full">
                        <input
                          type="text"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full p-3 border rounded-lg"
                        />
                        <button
                          type="submit"
                          className="w-full mt-2 p-3 bg-indigo-600 text-white rounded-lg"
                        >
                          수정 완료
                        </button>
                      </form>
                    ) : (
                      <p>{comment.content}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end">
                    <p className="text-sm text-gray-500">
                      {formatDate(comment.createDate)}
                    </p>

                    {comment.userId === user.id ? (
                      <div>
                        <button
                          onClick={() =>
                            handleEdit(comment.commentId, comment.content)
                          } // 수정
                          className="text-blue-600 text-sm mt-2"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteClick(comment.commentId)} // 삭제
                          className="text-red-600 text-sm mt-2 ml-2"
                        >
                          삭제
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleReport(comment.commentId)} // 신고
                        className={`text-sm mt-2 ${
                          isReported ? "text-gray-400" : "text-red-600"
                        }`}
                        disabled={isReported} // 신고된 댓글은 버튼 비활성화
                      >
                        {isReported ? "신고됨" : "신고"}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
        </ul>
      </div>

      {/* 신고 폼 */}
      {isReportFormOpen && (
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
          <h3 className="text-xl font-semibold">신고 사유 입력</h3>
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="신고 사유를 입력하세요..."
            className="w-full p-3 border rounded-lg mt-2"
          />
          <button
            onClick={handleReportSubmit}
            className="w-full mt-2 p-3 bg-red-600 text-white rounded-lg"
          >
            신고 제출
          </button>
          <button
            onClick={handleReportCancel}
            className="w-full mt-2 p-3 bg-gray-600 text-white rounded-lg"
          >
            취소
          </button>
        </div>
      )}

      {/* 신고 모달 */}
      {isReportFormOpen && (
        <CommentReportModal
          onClose={handleReportCancel} // 모달 닫기
          onSubmit={handleReportSubmit} // 신고 제출 처리
          reportReason={reportReason}
          setReportReason={setReportReason}
        />
      )}

      {/* 모달 표시 */}
      {isModalOpen && (
        <DeleteConfirmationModal
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default AlbumDetail;
