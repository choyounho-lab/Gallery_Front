import { FaPlay } from "@react-icons/all-files/fa/FaPlay";
import { FaPause } from "@react-icons/all-files/fa/FaPause";
import { FaBackward } from "@react-icons/all-files/fa/FaBackward";
import { FaForward } from "@react-icons/all-files/fa/FaForward";
import { FaRandom } from "@react-icons/all-files/fa/FaRandom";
import { FaRedo } from "@react-icons/all-files/fa/FaRedo";
import { FaRedoAlt } from "@react-icons/all-files/fa/FaRedoAlt";
import { usePlayer } from "./PlayerContext";

const PlayerControls: React.FC = () => {
  const {
    isPlaying,
    setIsPlaying,
    toggleRepeat,
    shuffle,
    toggleShuffle,
    nextTrack,
    prevTrack,
    repeatMode,
  } = usePlayer();

  const togglePlayStatus = () => setIsPlaying(!isPlaying);
  return (
    <div className="flex gap-x-2  max-md:w-full max-sm:justify-center ">
      <div className="flex w-50 min-w-50 max-sm:w-full justify-between bg-gradient-to-r from-blue-500/50 to-purple-500/50 p-2 rounded-lg">
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
        <button className="text-xl cursor-pointer" onClick={togglePlayStatus}>
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
  );
};
export default PlayerControls;
