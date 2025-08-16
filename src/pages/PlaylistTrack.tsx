import { PropsWithChildren, useEffect, useState } from "react";
import { hostInstance } from "../api/hostInstance";
import { useNavigate, useParams } from "react-router-dom";
import { apiGetTrackList } from "../api/api";
import {
  PlayTrack,
  SearchGenreTrackType,
  UserPlaylistItemType,
} from "../types/types";

import { usePlayer } from "./player/PlayerContext";

import SkeletonTrackList from "../components/SkeletonTrackList";
import PlaylistTrackUpdate from "./PlaylistTrackUpdate";

export interface AddPlaylistType {
  playlistTitle: string;
  playlistIsPublic: number;
}
export interface UpdatePlaylistType {
  playlistId: number;
  playlistTitle: string;
  playlistIsPublic: number;
}

export interface InsertPlaylistTrackDataType {
  playlistId: number | undefined;
  trackId: string;
  trackOrder: number;
}

export interface TrackListDataType {
  playlistId: number;
  trackId: string;
  trackName: string;
  artists: string;
  trackDuration: number;
  releaseDate: string;
  trackImageUrl: string;
  playlistTrackCreateDate: string;
}

function PlaylistTrack() {
  const {
    setCurrentTrack,
    setIsPlaying,
    setTrackList,
    trackList,
    setCurrentIndex,
    refresh,
    setRefresh,
  } = usePlayer();

  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [myPlaylistData, setMyPlaylistData] = useState<UserPlaylistItemType>({
    playlistId: 0,
    userId: 0,
    playlistTitle: "",
    playlistIsPublic: 0,
    playlistCreatedDate: "",
  });
  const [playlistTrackList, setPlaylistTrackList] =
    useState<TrackListDataType[]>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<SearchGenreTrackType>({
    tracks: {
      items: [],
    },
  });

  // 검색어로 스포티파이에서 검색
  const [search, setSearch] = useState<string>("");
  const searchTrack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search) setIsLoading(true);
    const trimmed = search.trim();
    if (trimmed === "") return;
    if (search !== "") {
      apiGetTrackList(search).then((res) => {
        console.log(res);
        setData(res);
        setIsLoading(false);
      });
    } else setData({ tracks: { items: [] } });
  };

  // 인풋에서 검색어 입력
  const changeSearchTrackInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // 플리 수정
  const [updatePlaylistIsOpen, setUpdatePlaylistIsOpen] =
    useState<boolean>(false);
  const fetchPlaylist = async () => {
    if (!playlistId) return;
    try {
      const res = await hostInstance.get("playlist/list", {
        params: { playlistId: Number(playlistId) },
      });
      setMyPlaylistData(res.data[0]);
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
      console.log(trackList);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId, updatePlaylistIsOpen, refresh]);

  const [isDelete, setIsDelete] = useState<boolean>(false);

  // 플레이리스트 트랙 삭제
  const deletePlaylistTrack = async (trackId: string) => {
    if (!playlistId) return;
    await hostInstance.delete(
      `playlistTrack/delete/playlist/${playlistId}/track/${trackId}`
    );
    fetchPlaylist();
  };

  // 플레이리스트 삭제
  const deleteMyPlaylist = async () => {
    await hostInstance.delete(`playlist/delete/track/${playlistId}`);
    await hostInstance.delete(`playlist/delete/${playlistId}`);

    setRefresh((prev) => prev + 1);
    navigate("/");
  };

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
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

  // 곡 재생
  const playTrack = async (
    artists: { name: string }[],
    title: string,
    trackId: string,
    duration_ms: number,
    trackImageUrl: string,
    releaseDate: string,
    index: number
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
    // 곡 재생상태를 재생중으로 고정
    setIsPlaying(true);

    fetchPlaylist();

    // 최근 재생 목록 갱신
    // if (userInfo.username !== "") {
    //   dispatch(addRecentTrackInfo(recentTrack));
    //   const stored = getRecentTrack();
    //   const updated = [
    //     recentTrack,
    //     ...stored.filter(
    //       (t) =>
    //         t.name !== recentTrack.name || t.artists !== recentTrack.artists
    //     ),
    //   ];
    //   if (updated.length > 10) updated.pop();
    //   setRecentTrack(updated);
    // }
  };

  const updatePlaylistBtn = () => {
    setUpdatePlaylistIsOpen(!updatePlaylistIsOpen);
  };

  const updatePlaylistIsPublic = async (playlistIsPublic: number) => {
    const playlistData: UpdatePlaylistType = {
      playlistId: Number(playlistId),
      playlistTitle: myPlaylistData.playlistTitle,
      playlistIsPublic: playlistIsPublic,
    };
    await hostInstance.put("playlist/create", playlistData);
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="w-full mt-5 flex justify-between items-center ">
        {/* 플레이리스트 제목 */}
        <div className=" flex justify-center text-center inline-block">
          {myPlaylistData?.playlistTitle && (
            <button
              type="button"
              className="text-4xl md:text-6xl font-bold break-words w-full cursor-pointer whitespace-nowrap"
              onClick={updatePlaylistBtn}
            >
              {myPlaylistData.playlistTitle}
            </button>
          )}
        </div>
        <PlaylistTrackUpdate
          isOpen={updatePlaylistIsOpen}
          onClose={updatePlaylistBtn}
          playlistId={playlistId}
          playlistIsPublicInput={myPlaylistData.playlistIsPublic}
        />

        <div className="text-center inline-block">
          {/* 플레이리스트 공개 상태 */}
          {myPlaylistData.playlistIsPublic ? (
            <button
              className="bg-green-500 hover:bg-green-400 m-[1px] text-white font-semibold py-2 px-6 rounded-lg text-lg shadow transition w-30"
              onClick={() => updatePlaylistIsPublic(0)}
            >
              Public
            </button>
          ) : (
            <button
              className="bg-red-500 hover:bg-red-400 m-[1px] text-white font-semibold py-2 px-6 rounded-lg text-lg shadow transition w-30"
              onClick={() => updatePlaylistIsPublic(1)}
            >
              Private
            </button>
          )}
          {/* 플레이리스트 삭제 버튼 */}
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg text-lg shadow transition w-48"
            onClick={deleteMyPlaylist}
          >
            플레이리스트 삭제
          </button>
        </div>
      </div>

      {/* 플레이리스트에 등록된 트랙 목록 */}
      <div className="my-10 py-10  ">
        <div className="text-xl font-semibold mb-4 w-20 ">내 트랙</div>
        <table className="min-w-full bg-white rounded-xl shadow">
          <colgroup>
            <col className="w-20" />
            <col />
            <col className="w-40" />
            <col className="w-20" />
            <col className="w-20" />
          </colgroup>
          <thead className=" text-gray-700 text-sm">
            <tr>
              <th className="px-2 py-2 text-center">#</th>
              <th className="px-4 py-2 text-left ">곡 정보</th>
              <th className="px-4 py-2 text-center max-lg:hidden ">
                등록된 날짜
              </th>
              <th className="px-2 py-2 text-center max-lg:hidden ">
                재생 시간
              </th>
              <th className="px-2 py-2 text-center">삭제</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {playlistTrackList?.map((track, index) => (
              <tr
                key={track.trackId}
                className="hover:bg-indigo-50 transition cursor-pointer"
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
                    index
                  )
                }
              >
                {/* 플레이리스트에 등록된 날짜순으로 정렬된 번호 */}
                <td className="text-center text-black font-bold text-lg px-5">
                  {index + 1}
                </td>

                {/* 플레이리스트에 등록된 곡 정보 */}
                <td className="px-4 py-3 flex items-center gap-4 overflow-hidden">
                  <img
                    src={track.trackImageUrl}
                    alt={track.trackName}
                    className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="truncate">
                    <p className="text-lg font-semibold text-gray-900 truncate">
                      {track.trackName}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {track.artists}
                    </p>
                  </div>
                </td>

                {/* 플레이리스트에 등록된 날짜 표시 */}
                <td className="px-6 py-3 text-sm text-gray-500 text-center whitespace-nowrap max-lg:hidden">
                  {track.playlistTrackCreateDate}
                </td>

                {/* 플레이리스트에 등록된 곡 재생시간 표시 */}
                <td className="px-6 py-3 text-sm text-gray-500 text-right max-lg:hidden">
                  {`${Math.floor(track.trackDuration / 60000)}:${Math.floor(
                    (track.trackDuration % 60000) / 1000
                  )
                    .toString()
                    .padStart(2, "0")}`}
                </td>

                {/* 플레이리스트에 등록된 곡 삭제버튼 */}
                <td className="px-4 py-3 text-center">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white text-sm px-2 py-1 rounded-md transition cursor-pointer w-13"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylistTrack(track.trackId);
                      setRefresh((prev) => prev + 1);
                    }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 검색창 */}
      <div className="mt-14 text-center">
        <form
          className="flex justify-center items-center"
          onSubmit={searchTrack}
        >
          <input
            type="text"
            className="w-full max-w-xl py-2 px-4 rounded-md border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
            placeholder="아티스트 또는 노래 검색"
            value={search}
            onChange={changeSearchTrackInput}
          />
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-lg px-4 py-2 rounded-md transition whitespace-nowrap cursor-pointer"
          >
            검색
          </button>
        </form>
      </div>

      {/* 검색 결과 */}
      <div className="mt-8">
        <div className="text-xl font-semibold mb-4 ">검색 결과</div>
        {isLoading ? (
          <SkeletonTrackList />
        ) : (
          <ul className="space-y-4">
            {data.tracks.items.map((track) => (
              <li
                key={`${track.id} - ${playlistId}`}
                className="bg-white shadow hover:shadow-md rounded-xl px-4 py-3 flex justify-between items-center transition hover:bg-indigo-50"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <img
                    src={track.album?.images?.[1].url}
                    alt={track.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="text-left truncate">
                    <p className="text-lg font-semibold text-gray-900 truncate">
                      {track.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {track.artists[0].name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm px-4 py-2 rounded-md transition whitespace-nowrap cursor-pointer z-10"
                  onClick={() => {
                    addPlaylistTrack(track);
                    setRefresh((prev) => prev + 1);
                  }}
                  disabled={btnDisabled}
                >
                  추가
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default PlaylistTrack;
