import { useSelector } from "react-redux";
import { usePlayer } from "./PlayerContext";
import { useState } from "react";
import { selectUserInfo } from "../../store/userInfo";
import { formatTime } from "./formatTime";
import Logo from "../../assets/image/LogoSmallWhite.png";
const ProgressBar = () => {
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
    volume,
    setVolume,
    currentTrack,
    repeatMode,
  } = usePlayer();
  const userInfo = useSelector(selectUserInfo);
  const isLogined = userInfo.username !== "";
  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(played);
  const handlePointerDown = () => {
    setSeeking(true);
  };

  const handlePointerUp = () => {
    setSeeking(false);
    setPlayed(seekValue);
    playerRef.current?.seekTo(seekValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isLogined) {
      setSeekValue(value);
    } else {
      setSeekValue((value * 30) / duration);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };
  return (
    <div
      className="w-full md:w-1/3 h-9  bg-gray-600 rounded-sm overflow-hidden relative inline-block"
      style={{ opacity: 0.9 }}
    >
      {/* 진행된 영역 */}
      <div className="absolute top-1/2 left-0 h-full w-full bg-gray-500 transform -translate-y-1/2">
        {isLogined ? (
          <div
            className="h-full bg-indigo-500"
            style={{ width: `${played * 100}%` }}
          />
        ) : (
          <div
            className="h-full bg-indigo-500"
            style={{ width: `${(played * 100 * duration) / 30}%` }}
          />
        )}
      </div>
      {/* 곡 제목 표시 */}
      <div className="sticky flex justify-center text-xs text-white font-medium text-ellipsis whitespace-nowrap">
        <div className="text-left">
          {currentTrack
            ? `${currentTrack?.artists} - ${currentTrack.trackName}`
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
        {isLogined && currentTrack
          ? `${formatTime(played * duration)} / ${formatTime(duration)}`
          : !isLogined && currentTrack
          ? `${formatTime(played * duration)} / ${formatTime(30)}`
          : ""}
      </div>
      {!currentTrack ? (
        <img src={Logo} className="absolute inset-0 h-9/10 mx-auto my-auto" />
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
  );
};
export default ProgressBar;
