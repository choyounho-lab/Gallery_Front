import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/image/LogoSmallWhite.png";
import { usePlayer } from "../pages/player/PlayerContext";
import { formatTime } from "../pages/player/formatTime";
import { FaPlay } from "@react-icons/all-files/fa/FaPlay";
import { FaPause } from "@react-icons/all-files/fa/FaPause";
import { FaBackward } from "@react-icons/all-files/fa/FaBackward";
import { FaForward } from "@react-icons/all-files/fa/FaForward";
import { FaRandom } from "@react-icons/all-files/fa/FaRandom";
import { FaRedo } from "@react-icons/all-files/fa/FaRedo";
import { FaRedoAlt } from "@react-icons/all-files/fa/FaRedoAlt";
import { useDispatch, useSelector } from "react-redux";
import { removeCurrentUser, removeRecentTrack } from "../helper/storage";
import { removeUserInfo, selectUserInfo } from "../store/userInfo";
import Login from "../pages/Login";
import { clearRecentTrackInfo } from "../store/recentTrackInfo";
import { updateUserInfo } from "../store/userInfo";
import { hostInstance } from "../api/hostInstance";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import VolumeControls from "../pages/player/VolumeControls";
import LightOrDarkToggleBtn from "../components/LightOrDarkToggleBtn/LightOrDarkToggleBtn";
import { selectDisplayMode, setDisplayMode } from "../store/displayMode";

const PopupWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
`;

const TopBar = () => {
  const {
    isPlaying,
    setIsPlaying,
    played,
    setPlayed,
    duration,
    toggleRepeat,
    shuffle,
    toggleShuffle,
    nextTrack,
    prevTrack,
    playerRef,
    currentTrack,
    repeatMode,
    reset,
  } = usePlayer();

  const dispatch = useDispatch();
  const darkMode = useSelector(selectDisplayMode);
  const toggleDarkMode = () => {
    dispatch(setDisplayMode(!darkMode));
  };
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = React.useState(true);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const userInfo = useSelector(selectUserInfo);
  const isLogined = userInfo.username !== "";
  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(played);
  const [showMyPageModal, setShowMyPageModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");
  const [currentPw, setCurrentPw] = useState("");

  const togglePlayStatus = () => setIsPlaying(!isPlaying);

  const handlePointerDown = () => setSeeking(true);
  const handlePointerUp = () => {
    setSeeking(false);
    setPlayed(seekValue);
    playerRef.current?.seekTo(seekValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (
      userInfo.sub ||
      String(userInfo.roleNo) === "2" ||
      String(userInfo.roleNo) === "3"
    ) {
      setSeekValue(value);
    } else {
      setSeekValue((value * 30) / duration);
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

  useEffect(() => {
    console.log(userInfo.roleNo);
  }, []);

  useEffect(() => {
    console.log(darkMode);
  }, [darkMode]);

  return (
    <>
      <div
        className="w-full max-sm:hidden h-17 bg-black text-white px-4 py-3 sticky top-0 right-0 z-50"
        style={{
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: `url(${Logo})`,
            position: "absolute",
            width: "250%",
            height: "500%",
            opacity: 0.15,
            transform: "rotate(5deg) translate(-50px, -50px)",
          }}
        />
        <div className="absolute top-0 right-0 p-2 py-4 w-full">
          <div className="flex justify-between items-center flex-nowrap ">
            <div className="flex flex-nowrap gap-x-2 max-md:justify-start">
              <div className="flex w-50  justify-between bg-gradient-to-r from-blue-500/50 to-purple-500/50 p-2 rounded-lg">
                <button
                  type="button"
                  className="text-xl cursor-pointer"
                  onClick={toggleShuffle}
                >
                  {shuffle ? (
                    <FaRandom size={20} title="셔플" />
                  ) : (
                    <FaRandom size={20} title="셔플 취소" color={"#888"} />
                  )}
                </button>
                <button
                  type="button"
                  className="text-xl cursor-pointer"
                  onClick={prevTrack}
                  disabled={repeatMode === "off" || repeatMode === "one"}
                >
                  <FaBackward size={20} title="이전곡" />
                </button>
                <button
                  className="text-xl cursor-pointer"
                  onClick={togglePlayStatus}
                >
                  {isPlaying ? (
                    <FaPause size={20} title="일시정지" />
                  ) : (
                    <FaPlay size={20} title="재생" />
                  )}
                </button>
                <button
                  type="button"
                  className="text-xl cursor-pointer"
                  onClick={nextTrack}
                  disabled={repeatMode === "off" || repeatMode === "one"}
                >
                  <FaForward size={20} title="다음곡" />
                </button>
                <button
                  type="button"
                  className="text-xl cursor-pointer"
                  onClick={toggleRepeat}
                >
                  {repeatMode === "one" ? (
                    <div style={{ position: "relative" }}>
                      <FaRedo title="한 곡 반복" />
                      <span
                        style={{
                          position: "absolute",
                          top: "1px",
                          left: "6px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: "#fff",
                        }}
                      >
                        1
                      </span>
                    </div>
                  ) : repeatMode === "all" ? (
                    <FaRedoAlt title="전체 반복" />
                  ) : (
                    <FaRedoAlt title="반복 꺼짐" color="#888" />
                  )}
                </button>
              </div>
            </div>

            <div
              className="hidden md:w-1/3 md:inline-block h-9 mx-3  bg-gray-600 rounded-sm overflow-hidden relative "
              style={{ opacity: 0.9 }}
            >
              {/* 진행된 영역 */}
              <div className="absolute top-1/2 left-0 h-full w-full bg-gray-500 transform -translate-y-1/2">
                {userInfo.sub ||
                String(userInfo.roleNo) ||
                String(userInfo.roleNo) ? (
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${played * 100}%` }}
                  />
                ) : (
                  <div
                    className="h-full bg-indigo-500"
                    style={{
                      width: `${(played * 100 * duration) / 30}%`,
                    }}
                  />
                )}
              </div>
              {/* 곡 제목 표시 */}
              <div className="sticky flex justify-center text-xs text-white font-medium text-ellipsis whitespace-nowrap">
                <div className="text-left">
                  {currentTrack
                    ? `${currentTrack.trackName} - ${currentTrack?.artists}`
                    : ``}
                </div>
              </div>
              {/* 곡 시간 표시 */}
              <div
                className="absolute inset-0 flex items-end justify-center text-xs text-center  text-gray-300 "
                style={{
                  transform: "translateY(-5%)",
                }}
              >
                {(userInfo.sub ||
                  String(userInfo.roleNo) === "2" ||
                  String(userInfo.roleNo) === "3") &&
                currentTrack
                  ? `${formatTime(played * duration)} / ${formatTime(duration)}`
                  : currentTrack
                  ? `${formatTime(played * duration)} / ${formatTime(30)}`
                  : ""}
              </div>
              {!currentTrack ? (
                <img
                  src={Logo}
                  className="absolute inset-0 h-9/10 mx-auto my-auto"
                />
              ) : (
                ""
              )}

              {/* 진행바 */}
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={!currentTrack ? 0 : seeking ? seekValue : played}
                onChange={handleChange}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
                disabled={!currentTrack}
              />
            </div>
            {/* 다크모드 버튼 */}
            <LightOrDarkToggleBtn
              isDarkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
            <div className="hidden sm:flex items-center">
              {/* 볼륨 버튼 */}
              <div className="hidden xl:flex justify-center items-center  relative">
                <VolumeControls />
              </div>

              {/* 로그인/로그아웃 버튼 */}
              <div className="hidden sm:flex items-center justify-end">
                {userInfo.username === "" ? (
                  // 로그인 버튼
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="mr-5 cursor-pointer"
                  >
                    로그인
                  </button>
                ) : (
                  <>
                    {/* 마이페이지 버튼 */}
                    <button
                      onClick={() => setShowMyPageModal(true)}
                      className="mx-3 border rounded-lg px-2 py-1 cursor-pointer"
                    >
                      {`MyEcho`}
                    </button>
                    {/* 로그아웃 버튼 */}
                    <button
                      onClick={logout}
                      className="mr-5 cursor-pointer w-[45px]"
                    >
                      로그아웃
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black/60 flex items-center justify-center z-50"
          style={{ zIndex: 9999 }}
        >
          <div className="p-6 rounded-lg w-[400px] ">
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

      {/* 마이페이지 모달 (힙하게) */}
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
    </>
  );
};

export default TopBar;
