import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ApiGetArtistType,
  ArtistTopTrack,
  PlayTrack,
  SearchGenreTrackType,
} from "../types/types";
import {
  apiGetArtistList,
  apiGetTrackList,
  apiGetTrackListByArtistId,
} from "../api/api";

// 💡 1. 팔로우 관련 API 함수 임포트
import {
  apiFollowArtist,
  apiUnfollowArtist,
  apiCheckFollowStatus,
} from "../api/followApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addRecentTrackInfo,
  selectRecentTrackInfo,
} from "../store/recentTrackInfo";
import { selectUserInfo } from "../store/userInfo";
import { usePlayer } from "./player/PlayerContext";
import { hostInstance } from "../api/hostInstance";
import { TrackListDataType } from "./PlaylistTrack";
import { mapTrackToTrackListDataType } from "./SearchResult";
import { getRecentTrack, setRecentTrack } from "../helper/storage";

// 💡 2. 백엔드 ArtistVO와 일치하는 타입 정의
// 이 타입은 팔로우 요청 시 백엔드로 전송될 아티스트 정보의 구조를 정의합니다.
interface ArtistVO {
  artistExternalId: string; // 외부 API에서 넘어오는 아티스트의 고유 ID (예: Spotify Artist ID)
  artistName: string;
  profileImage: string;
  debutDate?: string; // 선택 사항: 외부 API가 제공한다면 추가
  artistBio?: string; // 선택 사항: 외부 API가 제공한다면 추가
  entId?: number; // 선택 사항: 외부 API가 제공한다면 추가
}

const ArtistDetail = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const id = searchParams.get("id");

  const [artistData, setArtistData] = useState<ApiGetArtistType | null>(null);

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const { setCurrentTrack, setIsPlaying, setTrackList, setCurrentIndex } =
    usePlayer();
  const [data, setData] = useState<SearchGenreTrackType>({
    tracks: {
      items: [],
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

    // 현재 트랙 재생
    setCurrentTrack(recentTrackModify);
    // 버튼 누르면 무조건 재생상태로 변경
    setIsPlaying(true);
    setCurrentIndex(index);

    if (userInfo.username !== "") {
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

  // 💡 3. 팔로우 상태 및 팔로우 버튼 로딩 상태 추가
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false); // 팔로우/언팔로우 버튼의 로딩 상태

  const userInfo = useSelector(selectUserInfo);
  console.log(userInfo);
  useEffect(() => {
    const fetchData = async () => {
      if (!search || !id) return;

      setLoading(true);

      try {
        const [artistRes, trackRes] = await Promise.all([
          apiGetArtistList(search),
          apiGetTrackListByArtistId(id),
        ]);
        setArtistData(artistRes);
        setTrackList(trackRes);

        // 💡 4. 아티스트 데이터 로드 후 팔로우 상태 확인 로직 추가
        const fetchedArtist = artistRes.artists.items[0]; // 현재 페이지의 메인 아티스트

        if (fetchedArtist && fetchedArtist.id) {
          // `apiCheckFollowStatus`는 `artistExternalId`를 받아서 DB에 해당 아티스트가 있는지 확인하고
          // 팔로우 상태를 반환하도록 `followApi.ts`에 정의될 예정입니다.
          const status = await apiCheckFollowStatus(fetchedArtist.id);
          setIsFollowing(status);
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        // 에러 발생 시 팔로우 상태도 기본값 (false)으로 유지되도록 함
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, id]);

  // 💡 5. 팔로우/언팔로우 핸들러 함수 정의
  const handleFollowToggle = async () => {
    // 아티스트 데이터가 없거나, 검색 결과가 비어있으면 동작하지 않음
    if (!artistData || !artistData.artists.items[0]) {
      console.warn(
        "아티스트 데이터가 없어 팔로우/언팔로우를 진행할 수 없습니다."
      );
      return;
    }

    setFollowLoading(true); // 팔로우/언팔로우 버튼 로딩 시작
    const currentArtist = artistData.artists.items[0];

    // 백엔드의 ArtistVO 타입에 맞춰 데이터 구성
    // `artistId`는 외부 ID, `artistExternalId`도 외부 ID로 넘겨 백엔드에서 처리하도록 합니다.
    const artistToFollow: ArtistVO = {
      artistExternalId: currentArtist.id,
      artistName: currentArtist.name,
      profileImage:
        currentArtist.images?.[1]?.url || currentArtist.images?.[0]?.url || "",
      debutDate: new Date().toISOString(), // 현재 시간 ISO 문자열로 전달
      artistBio: undefined,
      entId: undefined,
    };

    try {
      if (isFollowing) {
        // 이미 팔로우 중이면 언팔로우 API 호출
        // 백엔드 `DELETE /api/follow/artist/{artistId}` 엔드포인트는 `artistExternalId`를 `artistId` 경로 변수로 받도록 설계했습니다.
        await apiUnfollowArtist(currentArtist.id);
        setIsFollowing(false);
        alert(`${currentArtist.name}님을 언팔로우했습니다.`);
      } else {
        // 팔로우 중이 아니면 팔로우 API 호출
        // 백엔드 `POST /api/follow/artist` 엔드포인트는 `ArtistVO` 객체 전체를 요청 본문으로 받습니다.
        await apiFollowArtist(artistToFollow);
        setIsFollowing(true);
        alert(`${currentArtist.name}님을 팔로우했습니다!`);
      }
    } catch (error: any) {
      console.error(
        "팔로우/언팔로우 실패:",
        error.response ? error.response.data : error.message
      );
      // 서버에서 보낸 오류 메시지가 있다면 표시, 없으면 일반 오류 메시지
      alert(`작업 실패: ${error.response?.data || error.message}`);
    } finally {
      setFollowLoading(false); // 팔로우/언팔로우 버튼 로딩 종료
    }
  };

  if (loading) return <div className="text-center p-10">로딩 중...</div>;
  if (!artistData)
    return (
      <div className="text-center p-10">아티스트 정보를 찾을 수 없습니다.</div>
    );

  const artist = artistData.artists.items[0];
  const artistImage = artist.images?.[1]?.url || artist.images?.[0]?.url || "";

  return (
    <div>
      <div className="min-h-screen  text-gray-800 px-6 py-10">
        <div className="flex flex-col items-center mb-16">
          <img
            src={artistImage}
            alt={`${artist.name} 커버`}
            className="w-64 h-64 rounded-full shadow-lg object-cover mb-6 hover:scale-105 transition-transform duration-300"
          />
          <p className="text-4xl font-extrabold text-indigo-600">
            {artist.name}
          </p>

          {/* 💡 6. 팔로우 버튼 추가 및 상태 반영 */}
          <button
            onClick={handleFollowToggle}
            disabled={followLoading} // 로딩 중일 때는 버튼 비활성화
            className={`mt-4 px-6 py-3 rounded-full font-bold text-white transition-colors duration-300 ${
              isFollowing
                ? "bg-gray-500 hover:bg-gray-600" // 팔로우 중일 때 (언팔로우 버튼처럼)
                : "bg-indigo-500 hover:bg-indigo-600" // 팔로우 안 할 때 (팔로우 버튼처럼)
            }`}
          >
            {followLoading
              ? isFollowing
                ? "언팔로우 중..."
                : "팔로우 중..."
              : isFollowing
              ? "✔️ 팔로잉"
              : "✨ 팔로우"}
          </button>
        </div>

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
      </div>
    </div>
  );
};

export default ArtistDetail;
