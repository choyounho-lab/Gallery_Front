import { useEffect, useState } from "react";
import { usePlayer } from "./PlayerContext";
import {
  FaVolumeDown,
  FaVolumeMute,
  FaVolumeOff,
  FaVolumeUp,
} from "react-icons/fa";

const VolumeControls = () => {
  const { volume, setVolume } = usePlayer();

  // 아이콘
  const getVolumeIcon = (v: number) => {
    if (v === 0) return <FaVolumeMute size={20} />;
    if (v < 30) return <FaVolumeOff size={20} />;
    if (v < 70) return <FaVolumeDown size={20} />;
    return <FaVolumeUp size={20} />;
  };

  // 볼륨값
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  // 스피커 모양 클릭 시 음소거 토글 버튼 기능
  const [saveVolume, setSaveVolume] = useState(0);
  const toggleVolume = () => {
    if (volume !== 0) {
      setSaveVolume(volume);
      setVolume(0);
    } else if (volume === 0 && saveVolume !== 0) {
      setVolume(saveVolume);
    }
  };

  return (
    <div className="relative w-[90%] flex items-center space-x-4">
      {/* 아이콘 */}
      <button
        type="button"
        onClick={toggleVolume}
        className="z-30 shrink-0 my-auto cursor-pointer"
      >
        {getVolumeIcon(volume)}
      </button>

      {/* 바 + 슬라이더 영역 */}
      <div className="relative flex-1 my-auto flex items-center">
        {/* 시각적 볼륨 바 */}
        <div className="absolute inset-0 h-5 rounded-full bg-neutral-300 overflow-hidden z-10">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 "
            style={{ width: `${volume}%` }}
          />
        </div>

        {/* 투명 슬라이더 */}
        <input
          aria-label="볼륨 조절"
          type="range"
          value={volume}
          max="100"
          onChange={handleVolumeChange}
          className="w-full h-5 z-30 opacity-0 cursor-pointer relative"
          style={{
            accentColor: "#aaf",
          }}
        />
      </div>
    </div>
  );
};
export default VolumeControls;
