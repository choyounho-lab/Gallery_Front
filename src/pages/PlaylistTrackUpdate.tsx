import { useState } from "react";
import { hostInstance } from "../api/hostInstance";
import { UpdatePlaylistType } from "./PlaylistTrack";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string | undefined;
  playlistIsPublicInput: number;
}

const PlaylistTrackUpdate: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  playlistId,
  playlistIsPublicInput,
}) => {
  const [playlistTitle, setPlaylistTitle] = useState<string>("");
  const [playlistIsPublic, setPlaylistIsPublic] = useState<number>(
    playlistIsPublicInput
  );
  const playlistData: UpdatePlaylistType = {
    playlistId: Number(playlistId),
    playlistTitle: playlistTitle,
    playlistIsPublic: playlistIsPublic,
  };

  const updatePlaylistTitle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await hostInstance.put("playlist/create", playlistData);
    setPlaylistTitle("");
    onClose();
  };
  const updatePlaylistTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistTitle(e.target.value);
  };

  if (!isOpen) return null;
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-90"
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
    >
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        <div className="text-lg font-bold mb-2 text-center">
          플레이리스트 변경
        </div>
        <form onSubmit={updatePlaylistTitle}>
          <input
            type="text"
            placeholder="변경할 플레이리스트 이름을 입력하세요."
            className="w-full text-lg border rounded"
            value={playlistTitle}
            onChange={updatePlaylistTitleInput}
            id="playlistTitle"
          ></input>
          <div className="flex justify-center mt-1">
            <button
              type="button"
              onClick={() => setPlaylistIsPublic(1)}
              className={`w-1/2 text-lg text-center border rounded inline-block text-white py-1 cursor-pointer ${
                playlistIsPublic
                  ? "bg-purple-600 hover:bg-purple-700 active:bg-purple-900"
                  : "bg-zinc-400 hover:bg-purple-400 active:bg-purple-900"
              }`}
              disabled={playlistIsPublic === 1}
            >
              Public
            </button>
            <button
              type="button"
              onClick={() => setPlaylistIsPublic(0)}
              className={`w-1/2 text-lg text-center border rounded inline-block text-white cursor-pointer ${
                !playlistIsPublic
                  ? "bg-red-600 hover:bg-red-700 active:bg-red-900"
                  : "bg-zinc-400 hover:bg-red-400 active:bg-red-900"
              }`}
              disabled={playlistIsPublic === 0}
            >
              Private
            </button>
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className={` px-4 py-2 bg-blue-700 font-bold text-white text-md rounded border hover:bg-gray-600 cursor-pointer`}
            >
              변경
            </button>
            <button
              type="button"
              onClick={onClose}
              className={` px-4 py-2 bg-gray-700 font-bold text-white text-md rounded border hover:bg-gray-600 cursor-pointer`}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PlaylistTrackUpdate;
