import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/image/LogoSmallWhite.png";
import { useDispatch, useSelector } from "react-redux";
import {
  removeUserInfo,
  selectUserInfo,
  updateUserInfo,
} from "../store/userInfo";
import { hostInstance } from "../api/hostInstance";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

import {
  addRecentTrackInfo,
  clearRecentTrackInfo,
  removeRecentTrackByTitle,
  selectRecentTrackInfo,
} from "../store/recentTrackInfo";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Login from "../pages/Login";
import {
  getRecentTrack,
  removeCurrentUser,
  removeRecentTrack,
  setRecentTrack,
} from "../helper/storage";
import {
  AddPlaylistType,
  PlayTrack,
  SearchGenreTrackType,
  UserPlaylistItemType,
} from "../types/types";
import { usePlayer } from "../pages/player/PlayerContext";
import { TrackListDataType, UpdatePlaylistType } from "../pages/PlaylistTrack";
import PlayerControls from "../pages/player/PlayerControls";
import VolumeControls from "../pages/player/VolumeControls";
import ProgressBar from "../pages/player/ProgressBar";
import { apiGetTrackList } from "../api/api";
import { isMobile } from "react-device-detect";

export function mapPlayTrackToTrackListDataType(
  track: PlayTrack[],
  playlistId: number,
  playlistTrackCreateDate: string
): TrackListDataType[] {
  return track.map((track) => ({
    playlistId,
    trackId: track.id,
    trackName: track.name,
    artists: track.artists[0]?.name ?? "",
    trackDuration: track.duration_ms,
    releaseDate: track.album.release_date,
    trackImageUrl: track.album.images?.[1]?.url ?? "",
    playlistTrackCreateDate,
  }));
}
const Sidebar = () => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const recentTrackInfo = useSelector(selectRecentTrackInfo);
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [showMyPageModal, setShowMyPageModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const isLogined = userInfo.username !== "";
  const sideBtnCss: string =
    "py-2 px-4 hover:bg-gray-700 rounded h-10 flex items-center justify-between text-white w-9/10 mx-auto ";
  const playListCss: string =
    "py-2 px-4 border hover:bg-indigo-600/60 rounded-lg h-10 flex items-center justify-start text-white w-9/10 m-1 text-left line-clamp-1 font-bold flex-shrink-0 cursor-pointer transition-colors duration-300";
  const myPlayListCss: string =
    "py-2 px-4 border hover:bg-indigo-600/60 rounded-lg h-10 flex items-center justify-start text-white w-9/10 m-1 text-left line-clamp-1 font-bold  flex-shrink-0  transition-colors duration-300";

  const handleSubscribe = async () => {
    // setIsSubscribed((prev) => !prev);
    // 상태 즉시 업데이트
    if (userInfo.sub) {
      //해지하기
      if (window.confirm("해지하시겠습니까?")) {
        hostInstance.post(`auth/SUB`).then((res) => {
          alert("해지되었습니다 ,감사합니다.");
          dispatch(updateUserInfo({ ...userInfo, sub: false }));
          reset();
        });
      }
    } else {
      try {
        const res = await hostInstance.post("/pay/ready", {
          itemName: "Echo 프리미엄 구독권",
          quantity: 1,
          totalAmount: 4900,
          userId: userInfo.id,
        });

        const { data } = res;
        const payUrl = isMobile
          ? data.next_redirect_mobile_url
          : data.next_redirect_pc_url;

        const popup = window.open(
          payUrl,
          "_blank",
          "toolbar=no,scrollbars=no,resizable=no,width=500,height=600"
        );

        // 창 닫힘 감지 (옵셔널)
        const pollTimer = setInterval(() => {
          if (popup?.closed) {
            clearInterval(pollTimer);
            // 이후 실제 서버에 결제 완료 여부 확인하고 실패했으면 다시 롤백
            // 예: /pay/status?userId=... 같은 API 호출
          }
        }, 500);
        dispatch(updateUserInfo({ ...userInfo, sub: true }));
      } catch (err) {
        alert("결제 요청 중 오류가 발생했습니다.");
        // 롤백
        dispatch(updateUserInfo({ ...userInfo, sub: false }));
      }
      hostInstance.post(`auth/SUB`);
    }
  };

  const logout = () => {
    removeCurrentUser();
    dispatch(removeUserInfo());
    removeRecentTrack();
    dispatch(clearRecentTrackInfo());
    navigate("/");
    reset();
  };

  const [openPlayList, setOpenPlayList] = useState<boolean>(true);
  const playList = () => {
    setOpenPlayList(!openPlayList);
  };
  const [openMyPlayList, setOpenMyPlayList] = useState<boolean>(true);
  const myPlayList = () => {
    setOpenMyPlayList(!openMyPlayList);
  };
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const createPlaylistName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setplaylistTitle(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate(`/search/${search}`);
    setSearch("");
  };

  const [playlistIsPublic, setPlaylistIsPublic] = useState<number>(1);
  const [playlistTitle, setplaylistTitle] = useState<string>("");
  const playlistData: AddPlaylistType = { playlistTitle, playlistIsPublic };

  const createPlaylist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (playlistTitle.trim() === "") return;
    if (
      userPlayList.find(
        (playListTitleIsUsed) =>
          playListTitleIsUsed.playlistTitle === playlistTitle
      )
    ) {
      alert("이미 존재하는 플레이리스트 제목입니다.");
      return;
    }

    try {
      const response = await hostInstance.post("playlist/create", playlistData);
      console.log("생성 성공:", response.data);
      setplaylistTitle("");
      setIsSubmit(false);
      setRefresh((prev) => prev + 1);
    } catch (error: any) {
      console.error("생성 실패:", error);
      alert(
        error.response?.data?.message ||
          "플레이리스트 생성 중 오류가 발생했습니다."
      );
    }
  };

  const [userPlayList, setUserPlayList] = useState<UserPlaylistItemType[]>([]);

  const {
    setCurrentTrack,
    setIsPlaying,
    setTrackList,
    setCurrentIndex,
    currentIndex,
    setRefresh,
    refresh,
    reset,
  } = usePlayer();
  const recentTrackClick = async (
    artists: { name: string }[],
    title: string,
    trackId: string,
    duration_ms: number,
    album: {
      release_date: string;
      images: {
        url: string;
        width?: number;
        height?: number;
      }[];
    }
  ) => {
    const recentTrack: PlayTrack = {
      id: trackId,
      name: title,
      duration_ms,
      artists,
      album: {
        release_date: album.release_date,
        images: album.images,
      },
    };
    await hostInstance.post("track/save", {
      trackId: recentTrack.id,
      trackName: recentTrack.name,
      artists: recentTrack.artists[0].name,
      trackDuration: recentTrack.duration_ms,
      releaseDate: recentTrack.album.release_date,
      trackImageUrl:
        recentTrack.album.images.length > 1
          ? recentTrack.album.images[1].url
          : recentTrack.album.images[0]?.url ?? "",
    });
    await hostInstance.post("track/save/date", {
      trackId: recentTrack.id,
    });

    const recentTrackModify: TrackListDataType = {
      playlistId: 0,
      trackId: recentTrack.id,
      trackName: recentTrack.name,
      artists: recentTrack.artists[0].name,
      trackDuration: recentTrack.duration_ms,
      releaseDate: recentTrack.album.release_date,
      trackImageUrl: recentTrack.album.images[1]?.url,
      playlistTrackCreateDate: "",
    };

    // 재생할 트랙
    setCurrentTrack(recentTrackModify);
    // 재생 상태로 변경
    setIsPlaying(true);

    // 최근 재생 트랙 목록에 곡 추가
    dispatch(addRecentTrackInfo(recentTrack));
    // 기존에 곡이 존재할 경우 목록 제일 상단으로
    const stored = getRecentTrack();
    const updated = [
      recentTrack,
      ...stored.filter(
        (t) =>
          t.name !== recentTrack.name ||
          t.name !== recentTrack.name ||
          t.artists.map((a) => a.name).join(",") !==
            recentTrack.artists.map((a) => a.name).join(",")
      ),
    ];
    // 목록이 10개일 경우 가장 오래된 곡 목록에서 제거
    if (updated.length > 10) updated.pop();
    // 최근 재생 목록 갱신
    setRecentTrack(updated);

    // 이전곡, 다음곡 버튼 기능을 위한 트랙 배열 저장
    setTrackList(mapPlayTrackToTrackListDataType(updated, 0, ""));
    // 현재 트랙 순서
    setCurrentIndex(0);
  };

  const deleteRecentPlaylist = (trackId: string) => {
    console.log(trackId);
    console.log(recentTrackInfo.map((item) => item));

    dispatch(removeRecentTrackByTitle(trackId));
    setRefresh((prev) => prev + 1);
  };
  const [data, setData] = useState<SearchGenreTrackType>({
    tracks: {
      items: [],
    },
  });

  // 입력이 멈춘 후 300ms 뒤에 debouncedSearch 업데이트
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setData({
        tracks: {
          items: [],
        },
      });
      return;
    }

    apiGetTrackList(debouncedSearch).then((res) => setData(res));
  }, [debouncedSearch]);

  const [playlistTrackList, setPlaylistTrackList] =
    useState<TrackListDataType[]>();

  let playlistId = null;
  if (location.pathname.substring(0, 10) === "/playlist/") {
    playlistId = location.pathname.substring(10);
  } else {
    playlistId = null;
  }

  const fetchPlaylist = async () => {
    console.log(playlistId);
    if (!playlistId) return;
    try {
      const res = await hostInstance.get("playlist/list", {
        params: { playlistId: Number(playlistId) },
      });

      console.log(res.data);

      const trackListRes = await hostInstance.get("playlistTrack/list", {
        params: { playlistId: Number(playlistId) },
      });
      setPlaylistTrackList(trackListRes.data);
      setTrackList(trackListRes.data);
      console.log(trackListRes.data);
    } catch (error: any) {
      console.error("플레이리스트 로딩 실패:", error);
      alert(error.response.data.message || "오류 발생");
    } finally {
    }
  };
  const playTrack = async (
    artists: { name: string }[],
    title: string,
    trackId: string,
    duration_ms: number,
    trackImageUrl: string,
    releaseDate: string,
    index: number,
    btnId: string
  ) => {
    const recentTrack: PlayTrack = {
      id: trackId,
      name: title,
      duration_ms,
      artists,
      album: {
        release_date: releaseDate,
        images: [
          {
            url: trackImageUrl,
          },
        ],
      },
    };

    await hostInstance.post("track/save", {
      trackId: recentTrack.id,
      trackName: recentTrack.name,
      artists: recentTrack.artists.map((a) => a.name).join(", "),
      trackDuration: recentTrack.duration_ms,
      releaseDate: recentTrack.album.release_date,
      trackImageUrl:
        recentTrack.album.images.length > 1
          ? recentTrack.album.images[1].url
          : recentTrack.album.images[0]?.url ?? "",
    });
    await hostInstance.post("track/save/date", {
      trackId: recentTrack.id,
    });
    const recentTrackModify: TrackListDataType = {
      playlistId: 0,
      trackId: recentTrack.id,
      trackName: recentTrack.name,
      artists: recentTrack.artists[0].name,
      trackDuration: recentTrack.duration_ms,
      releaseDate: recentTrack.album.release_date,
      trackImageUrl: recentTrack.album.images[1]?.url,
      playlistTrackCreateDate: "",
    };
    if (recentTrackModify) {
      setCurrentIndex(index);
      setCurrentTrack(recentTrackModify);
    }
    setIsPlaying(true);
    fetchPlaylist();

    if (btnId !== "playlistTrackBtn")
      if (userInfo.username !== "") {
        // 최근 재생 목록 갱신
        dispatch(addRecentTrackInfo(recentTrack));
        const stored = getRecentTrack();
        const updated = [
          recentTrack,
          ...stored.filter(
            (t) =>
              t.name !== recentTrack.name || t.artists !== recentTrack.artists
          ),
        ];
        if (updated.length > 10) updated.pop();
        setRecentTrack(updated);
      }
  };

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  // 플레이리스트에 트랙 추가 기능
  const addPlaylistTrack = async (track: PlayTrack) => {
    setBtnDisabled(true);
    console.log(playlistId);
    if (!playlistId) return;
    console.log(track);
    try {
      await hostInstance.post("track/save", {
        trackId: track.id,
        trackName: track.name,
        artists: Array.isArray(track.artists)
          ? track.artists.map((a) => a.name).join(", ")
          : track.artists ?? "",
        trackDuration: track.duration_ms,
        releaseDate: track.album.release_date,
        trackImageUrl: track.album.images[1].url,
      });
      await hostInstance.post("playlistTrack/save", {
        playlistId: parseInt(playlistId),
        trackId: track.id,
        trackOrder: 0,
      });
    } catch (error: any) {
      console.error("생성 실패:", error);
      alert(
        error.response?.data?.message ||
          "플레이리스트 생성 중 오류가 발생했습니다."
      );
    } finally {
      setBtnDisabled(false);
    }
    fetchPlaylist();
  };

  // 플레이리스트에 트랙 삭제 기능
  const deletePlaylistTrack = async (trackId: string) => {
    if (!playlistId) return;
    await hostInstance.delete(
      `playlistTrack/delete/playlist/${playlistId}/track/${trackId}`
    );
    fetchPlaylist();
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId, refresh]);

  // 플레이리스트 호출
  const fetchUserPlaylists = async () => {
    try {
      const res = await hostInstance.get("playlist/list");
      setUserPlayList(res.data);
      console.log(res.data);
    } catch (error: any) {
      console.error("플레이리스트 불러오기 실패:", error);
      alert(
        error.response?.data?.message ||
          "플레이리스트 불러오는 중 오류가 발생했습니다."
      );
    }
  };

  // 플레이리스트 삭제 기능
  const deleteMyPlaylist = async (playlistId: number) => {
    try {
      await hostInstance.delete(`playlist/delete/track/${playlistId}`);
      await hostInstance.delete(`playlist/delete/${playlistId}`);
      await fetchUserPlaylists(); // 삭제 후 최신 리스트 불러오기
      navigate("/"); // 리스트 갱신 후 페이지 이동
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("플레이리스트 삭제 중 오류가 발생했습니다.");
    }
  };

  // 플레이리스트 공개여부 수정 기능
  const updatePlaylistIsPublic = async (
    playlistId: number,
    playlistTitle: string,
    playlistIsPublic: number
  ) => {
    if (playlistIsPublic === 0) {
      playlistIsPublic = 1;
    } else if (playlistIsPublic === 1) {
      playlistIsPublic = 0;
    }
    const playlistData: UpdatePlaylistType = {
      playlistId,
      playlistTitle,
      playlistIsPublic,
    };
    await hostInstance.put("playlist/create", playlistData);
    setRefresh((prev) => prev + 1);
  };

  useEffect(() => {
    if (!userInfo?.username && !userInfo?.email) return;
    fetchUserPlaylists();
  }, [userInfo.username, refresh]);
  return (
    <div className="fixed z-50 transition-all">
      <div
        className="w-70 max-sm:w-screen h-screen bg-black text-white flex flex-col relative "
        style={{
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: `url(${Logo})`,
            position: "absolute",
            width: "2000%",
            height: "2000%",
            opacity: 0.15,
            transform: "rotate(-10deg) ",
            top: "-1000px",
            left: "-500px",
          }}
        />
        <div
          className="w-70 max-sm:w-full overflow-y-auto scrollbar-custom max-h-screen"
          style={{ position: "absolute" }}
        >
          <Link
            to="/"
            className="py-2  hover:bg-gray-700 rounded  flex items-center justify-center text-white m-2 text-3xl w-9/10 mx-auto font-bold z-50 cursor-pointer"
          >
            Echocaine
          </Link>

          <div className="absolute right-5 top-5 sm:hidden items-center justify-end ">
            {userInfo.username === "" ? (
              // 로그인 버튼
              <button
                onClick={() => setShowLoginModal(true)}
                className="mr-5 cursor-pointer hover:text-blue-300"
              >
                로그인
              </button>
            ) : (
              <>
                {/* 마이페이지 버튼 */}
                <button
                  onClick={() => setShowMyPageModal(true)}
                  className="mx-3 border rounded-lg px-2 py-1 cursor-pointer hover:text-blue-300"
                >
                  {`MyEcho`}
                </button>
                {/* 로그아웃 버튼 */}
                <button
                  onClick={logout}
                  className="mr-5  cursor-pointer w-[45px] hover:text-blue-300"
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
          {showMyPageModal && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="relative w-[400px] p-6 rounded-xl bg-gradient-to-br from-purple-900/80 to-indigo-900/80 shadow-2xl border border-purple-400/40 text-white">
                <button
                  onClick={() => setShowMyPageModal(false)}
                  className="absolute top-2 right-3 text-white text-2xl hover:text-purple-300"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold text-center mb-6 tracking-wide drop-shadow-md">
                  MyEcho
                </h2>
                <div className="bg-black/30 p-4 rounded-lg shadow-inner border border-white/10 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">👤 이름</span>
                    <span className="font-medium">
                      {userInfo.name || "이름 없음"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">📧 이메일</span>
                    <span className="font-medium">
                      {userInfo.email || "이메일 없음"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">🎂 생년월일</span>
                    <span className="font-medium">
                      {userInfo.birthdate || "미입력"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">🌟 등급</span>
                    <span className="font-medium">
                      <span className="font-medium">
                        {String(userInfo.roleNo) === "1"
                          ? userInfo.sub
                            ? "프리미엄 구독회원"
                            : "뿌리회원" // 결제 완료 여부로 분기
                          : String(userInfo.roleNo) === "2"
                          ? "관리자"
                          : String(userInfo.roleNo) === "3"
                          ? "나무"
                          : "알 수 없음"}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setShowPasswordResetModal(true)}
                    className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-sm font-medium shadow-lg transition"
                  >
                    회원수정
                  </button>

                  {isLogined && userInfo.roleNo == "1" && (
                    <button
                      onClick={handleSubscribe}
                      className={`flex-1 px-4 py-2 rounded-full text-sm font-medium shadow-lg transition ${
                        userInfo.sub
                          ? "bg-gray-500 text-white hover:bg-yellow-400"
                          : "bg-yellow-500 hover:bg-yellow-400 text-black"
                      }`}
                    >
                      {userInfo.sub ? "❌ 구독해지" : "🟡 구독하기"}
                    </button>
                  )}

                  {showPasswordResetModal && (
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                      <div className="relative w-[400px] p-6 rounded-xl bg-white text-black shadow-2xl border border-purple-400/40">
                        <button
                          onClick={() => setShowPasswordResetModal(false)}
                          className="absolute top-2 right-3 text-black text-2xl hover:text-purple-600"
                        >
                          ×
                        </button>
                        <h2 className="text-xl font-bold text-center mb-4">
                          비밀번호 변경
                        </h2>

                        <input
                          type="password"
                          placeholder="현재 비밀번호"
                          value={currentPw}
                          onChange={(e) => setCurrentPw(e.target.value)}
                          className="form-style find-input mb-2 w-full"
                        />

                        <input
                          type="password"
                          placeholder="새 비밀번호"
                          value={newPw}
                          onChange={(e) => setNewPw(e.target.value)}
                          className="form-style find-input mb-2 w-full"
                        />

                        <input
                          type="password"
                          placeholder="새 비밀번호 확인"
                          value={newPwConfirm}
                          onChange={(e) => setNewPwConfirm(e.target.value)}
                          className="form-style find-input mb-4 w-full"
                        />

                        <button
                          className="btn w-full"
                          onClick={() => {
                            if (newPw !== newPwConfirm) {
                              alert("새 비밀번호가 일치하지 않습니다");
                              return;
                            }

                            console.log({
                              step: "changeWithCurrentPassword",
                              name: userInfo.name,
                              email: userInfo.email,
                              password: currentPw,
                              newpassword: newPw,
                              newPwConfirm: newPwConfirm,
                              id: userInfo.id,
                            });

                            hostInstance
                              .put("/auth/newpassword", {
                                step: "changeWithCurrentPassword",
                                name: userInfo.name,
                                email: userInfo.email,
                                password: currentPw,
                                newpassword: newPw,
                                newPwConfirm: newPwConfirm,
                                id: userInfo.id,
                              })

                              .then((res) => {
                                console.log(res);

                                alert("비밀번호가 변경되었습니다");
                                setShowPasswordResetModal(false);
                              })
                              .catch((err) => {
                                alert(err.response.data.data);
                              });
                          }}
                        >
                          비밀번호 변경
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 검색 */}
          <form onSubmit={onSubmit} className="relative flex justify-center ">
            <input
              type="text"
              className="py-2 px-4 rounded h-10 flex items-center justify-center border rounded-sm text-white w-9/10 mx-auto "
              placeholder="검색"
              onClick={(e) => {
                e.preventDefault();
                if (window.innerWidth >= 640) navigate("/genreList");
              }}
              onChange={onChange}
              value={search}
            />
            {/* 모바일 환경에서 검색 결과 출력 */}
            <div className="sm:hidden flex flex-col items-center absolute bg-indigo-700/90 z-70 top-10 w-9/10 rounded-lg transform translate-y-1  ">
              {data.tracks.items.slice(0, 10).map((item, index) => (
                <ul
                  key={item.id}
                  className={`py-2 px-4 border hover:bg-indigo-600/60 rounded-lg h-10 flex items-center justify-between text-white w-95/100 m-1 text-left line-clamp-1 font-bold flex-shrink-0 cursor-pointer transition-colors duration-300`}
                >
                  <button
                    type="button"
                    className="line-clamp-1 cursor-pointer text-left"
                    onClick={() => {
                      playTrack(
                        item.artists
                          ? item.artists.map((name) => ({ name: name.name }))
                          : [{ name: "Unknown" }],
                        item.name,
                        item.id,
                        item.duration_ms,
                        item.album.images?.[1].url,
                        item.album.release_date,
                        index,
                        ""
                      );
                    }}
                  >{`${item.name} - ${item.artists[0].name}`}</button>

                  {playlistTrackList?.find(
                    (track) =>
                      track.playlistId ===
                        parseInt(location.pathname.substring(10)) &&
                      track.trackId === item.id
                  ) ? (
                    <button
                      type="button"
                      onClick={() => {
                        addPlaylistTrack(item);
                        setRefresh((prev) => prev + 1);
                      }}
                      className="cursor-pointer border rounded-md bg-gray-700 px-1 w-20 shrink-0"
                      disabled={true}
                    >
                      플리에 담기
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        addPlaylistTrack(item);
                        setRefresh((prev) => prev + 1);
                      }}
                      className="cursor-pointer border rounded-md bg-blue-700 px-1 w-20 shrink-0"
                    >
                      플리에 담기
                    </button>
                  )}
                </ul>
              ))}
            </div>
          </form>

          <div className="flex w-9/10 items-center min-sm:hidden mx-auto my-2">
            <ProgressBar />
          </div>
          <div className="flex w-9/10 items-center min-sm:hidden mx-auto my-2">
            <PlayerControls />
          </div>
          <div className="flex justify-center min-sm:hidden my-5 items-center relative">
            <VolumeControls />
          </div>

          <Link to="/" className={`${sideBtnCss} max-sm:hidden`}>
            Home
          </Link>

          <Link to="/event" className={`${sideBtnCss} max-sm:hidden`}>
            이벤트
          </Link>
          <Link to="/notice" className={`${sideBtnCss} max-sm:hidden mb-5 `}>
            공지사항
          </Link>

          <div className="border border-gray-400 mb-3"></div>

          {userInfo.username !== "" ? (
            <div>
              {/* 최근 재생한 곡 */}
              <button onClick={playList} className={sideBtnCss}>
                PlayList{" "}
                {openPlayList ? (
                  <div>
                    <FaChevronUp />
                  </div>
                ) : (
                  <div>
                    <FaChevronDown />
                  </div>
                )}
              </button>

              {openPlayList && recentTrackInfo.length > 0 && (
                <div className="border p-2 flex items-center flex-col m-1 rounded-lg max-h-[280px] overflow-y-auto scrollbar-custom ">
                  {Array.isArray(recentTrackInfo) &&
                    recentTrackInfo?.map((item, index) => (
                      <div
                        key={`${index}`}
                        className="w-full flex justify-center items-center relative group"
                      >
                        {/* 최근 재생한 곡 재생 버튼 */}
                        <button
                          key={`${item.id}`}
                          className={`${playListCss} inline-block `}
                          type="button"
                          onClick={() =>
                            recentTrackClick(
                              item.artists,
                              item.name,
                              item.id,
                              item.duration_ms,
                              item.album
                            )
                          }
                        >
                          <p className="line-clamp-1">
                            {" "}
                            {Array.isArray(item.artists) &&
                            item.artists.length > 0
                              ? `${item.name} - ${item.artists[0].name}`
                              : item.name}
                          </p>
                        </button>

                        {/* 최근 재생한 곡 삭제 버튼 */}
                        <button
                          onClick={() => deleteRecentPlaylist(item.id)}
                          className="bg-black hover:text-red-500 hidden group-hover:flex transform duration-300"
                          type="button"
                          style={{
                            cursor: "pointer",
                            border: "1px solid white",
                            padding: "11px 6px",
                            borderRadius: "20%",
                            fontSize: "15px",
                            justifyContent: "center",
                            position: "absolute",
                            right: "5%",
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                </div>
              )}

              <button
                type="button"
                onClick={myPlayList}
                className="py-2 px-4 hover:bg-gray-700 rounded h-10 flex items-center justify-between text-white w-9/10 mx-auto"
              >
                나만의 플리{" "}
                {openMyPlayList ? (
                  <div>
                    <FaChevronUp />
                  </div>
                ) : (
                  <div>
                    <FaChevronDown />
                  </div>
                )}
              </button>

              {openMyPlayList && (
                <div>
                  {/* 플레이리스트 생성 버튼 */}
                  <div className="border p-2 flex justify-start items-center flex-col m-2 rounded-lg overflow-y-auto max-h-[280px] scrollbar-custom ">
                    <form
                      onSubmit={createPlaylist}
                      className="w-9/10 flex justify-center items-center"
                    >
                      {isSubmit ? (
                        <div className="bg-white w-full flex flex-col items-center gap-2 p-4 rounded-md shadow-md">
                          <input
                            type="text"
                            placeholder="예: 여름에 듣는 음악"
                            value={playlistTitle}
                            onChange={createPlaylistName}
                            className="w-full max-w-xs border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none ring-1 focus:ring-2 focus:ring-indigo-400 bg-white text-black "
                          />
                          {/* 입력한 제목으로 플리 만들기 버튼 */}
                          <button
                            type="submit"
                            className="w-full max-w-xs bg-black hover:bg-indigo-700/60 text-white py-2 rounded-md active:bg-indigo-700/70 transition text-sm font-semibold cursor-pointer"
                          >
                            만들기
                          </button>
                          {/* 취소 버튼 */}
                          <button
                            type="button"
                            onClick={() => setIsSubmit(false)}
                            className="w-full max-w-xs bg-gray-300 hover:bg-gray-400/60 text-gray-800 py-2 rounded-md active:bg-gray-400/80 transition text-sm font-semibold cursor-pointer"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        // 플레이리스트 만들기 진입 버튼
                        <button
                          type="button"
                          onClick={() => setIsSubmit(true)}
                          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-100 text-black rounded-md hover:bg-gray-300 transition font-bold cursor-pointer"
                        >
                          <FaPlus />
                          만들기
                        </button>
                      )}
                    </form>

                    {/* 개인 플레이리스트 */}
                    {userPlayList.map((myPlaylist, index) => (
                      <div
                        key={`${index}`}
                        className="w-full flex flex-col items-center"
                      >
                        <div className="relative flex justify-center w-full group">
                          {/* 플레이리스트 목록 */}
                          <Link
                            key={myPlaylist.playlistId}
                            to={`playlist/${myPlaylist.playlistId}`}
                            className={
                              location.pathname !==
                              `/playlist/${myPlaylist.playlistId}`
                                ? `${myPlayListCss}`
                                : "py-2 px-4 border bg-gradient-to-r hover:bg-indigo-700/70 rounded-lg h-10 flex items-center justify-start text-black  from-purple-500/50 to-purple-500/20 w-9/10 m-1 text-left line-clamp-1 font-bold  flex-shrink-0 transition-colors duration-300"
                            }
                          >
                            <p className="line-clamp-1 text-white">{`${myPlaylist.playlistTitle}`}</p>
                          </Link>

                          {/* 플레이리스트 공개 여부 */}
                          <button
                            onClick={() =>
                              updatePlaylistIsPublic(
                                myPlaylist.playlistId,
                                myPlaylist.playlistTitle,
                                myPlaylist.playlistIsPublic
                              )
                            }
                            className={`hidden group-hover:flex flex sm:hidden sm:group-hover:hidden transform duration-300 
                                ${
                                  myPlaylist.playlistIsPublic
                                    ? "hover:text-green-500"
                                    : "hover:text-red-500"
                                }`}
                            type="button"
                            style={{
                              cursor: "pointer",
                              border: "1px solid white",
                              padding: "5px 6px",
                              borderRadius: "20%",
                              fontSize: "15px",
                              background: "black",
                              justifyContent: "center",
                              position: "absolute",
                              right: "calc(5% + 30px)",
                              top: "5px",
                            }}
                          >
                            {myPlaylist.playlistIsPublic ? "공개" : "비공개"}
                          </button>

                          {/* 플레이리스트 삭제 버튼 */}
                          <button
                            onClick={() => {
                              setRefresh((prev) => prev + 1);
                              deleteMyPlaylist(myPlaylist.playlistId);
                            }}
                            className={
                              "bg-black hover:text-red-500 hidden group-hover:flex sm:group-hover:hidden transform duration-300"
                            }
                            type="button"
                            style={{
                              cursor: "pointer",
                              border: "1px solid white",
                              padding: "11px 6px",
                              borderRadius: "20%",
                              fontSize: "15px",
                              justifyContent: "center",
                              position: "absolute",
                              right: "5.2%",
                              top: "5px",
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                        {playlistTrackList?.map((track, index) => (
                          <div className="w-full flex justify-center relative group">
                            {/* 플레이리스트 트랙 목록 */}
                            <button
                              key={track.trackId}
                              type="button"
                              onClick={() =>
                                playTrack(
                                  track.artists
                                    ? track.artists
                                        .split(",")
                                        .map((name) => ({ name: name.trim() }))
                                    : [{ name: "Unknown" }],
                                  track.trackName,
                                  track.trackId,
                                  track.trackDuration,
                                  track.trackImageUrl,
                                  track.releaseDate,
                                  index,
                                  "playlistTrackBtn"
                                )
                              }
                              className={
                                location.pathname !==
                                `/playlist/${myPlaylist.playlistId}`
                                  ? ""
                                  : currentIndex === index
                                  ? "py-2 px-4 border bg-gradient-to-r hover:bg-indigo-700/50 rounded-lg h-10 flex items-center justify-start from-purple-500/50 to-purple-500/20 w-8/10 m-1 text-left line-clamp-1 font-bold  flex-shrink-0 transition-colors duration-300 transform translate-x-[6%] cursor-pointer relative text-white whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1 sm:hidden"
                                  : "py-2 px-4 border bg-gradient-to-r hover:bg-indigo-700/50 rounded-lg h-10 flex items-center justify-start from-indigo-500/50 to-indigo-500/20 w-8/10 m-1 text-left line-clamp-1 font-bold  flex-shrink-0 transition-colors duration-300 transform translate-x-[6%] cursor-pointer relative text-white whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1 sm:hidden"
                              }
                            >
                              {location.pathname ===
                              `/playlist/${myPlaylist.playlistId}`
                                ? `${track.trackName} - ${track.artists}`
                                : ""}
                            </button>

                            {/* 플레이리스트 트랙 삭제 버튼 */}
                            <button
                              onClick={() => {
                                setRefresh((prev) => prev + 1);
                                deletePlaylistTrack(track.trackId);
                              }}
                              className={
                                location.pathname ===
                                `/playlist/${myPlaylist.playlistId}`
                                  ? "hidden bg-black group-hover:flex hover:text-red-500 flex sm:hidden transform duration-300"
                                  : "hidden"
                              }
                              type="button"
                              style={{
                                cursor: "pointer",
                                border: "1px solid white",
                                padding: "11px 6px",
                                borderRadius: "20%",
                                fontSize: "15px",
                                justifyContent: "center",
                                position: "absolute",
                                right: "5.2%",
                                top: "5px",
                              }}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="py-2 px-4 rounded-full h-10 flex items-center justify-start text-black w-8/10 mx-auto font-bold bg-white"
            >
              플레이리스트 만들기
            </button>
          )}
        </div>
      </div>
      {showLoginModal && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black/60 flex items-center justify-center z-50"
          style={{ zIndex: 9999 }}
        >
          <div className="p-6 rounded-lg w-[400px] relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-2 right-3 text-black text-xl"
            >
              ×
            </button>
            <Login onClose={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
