import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ApiGetAlbumItemsType,
  ApiGetAlbumType,
  PlayTrack,
  SearchGenreTrackType,
  Track,
} from "../types/types";
import { apiGetAlbumList, apiGetGenreTrack } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { usePlayer } from "./player/PlayerContext";
import { hostInstance } from "../api/hostInstance";
import { mapTrackToTrackListDataType } from "./SearchResult";
import { TrackListDataType } from "./PlaylistTrack";
import { addRecentTrackInfo } from "../store/recentTrackInfo";
import { getRecentTrack, setRecentTrack } from "../helper/storage";
import { selectUserInfo } from "../store/userInfo";

const GenreListDetail = () => {
  const { genre } = useParams<string>();
  const [data, setData] = useState<SearchGenreTrackType>({
    tracks: {
      items: [],
    },
  });
  const [albumData, setAlbumData] = useState<ApiGetAlbumType>({
    albums: {
      href: "",
      items: [],
      limit: 0,
      next: "",
      offset: 0,
      previous: "",
      total: 0,
    },
  });
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const { setCurrentTrack, setIsPlaying, setTrackList, setCurrentIndex } =
    usePlayer();

  // 곡 재생
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
    if (genre) {
      apiGetGenreTrack(genre).then((res) => {
        console.log(genre);
        console.log(res);
        setData(res);
      });
      apiGetAlbumList(genre, 0).then((abumList) => {
        console.log(genre);
        console.log(abumList);
        setAlbumData(abumList);
      });
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-gray-800">
      {/* 앨범 섹션 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">{genre} 앨범</h2>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albumData.albums.items.map((item) => (
            <li
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <Link to={`/albumDetail?search=${item.name}&id=${item.id}`}>
                <img
                  src={item.images[1]?.url}
                  alt={item.name}
                  className="w-full  object-cover rounded-t-xl"
                />

                <div className="p-3">
                  <p className="text-sm font-bold truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.artists[0]?.name}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 트랙 섹션 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">{genre} 트랙</h2>
        <ul className="space-y-3">
          {data.tracks.items.map((track, index) => (
            <button
              className="flex items-center bg-gray-50 hover:bg-indigo-50 rounded-xl p-3 transition cursor-pointer text-start w-full"
              type="button"
              onClick={() => clickTrack(track.id, index)}
            >
              <img
                src={track.album.images[1].url}
                alt={track.name}
                className="w-16 h-16 object-cover rounded-lg shadow"
              />
              <div className="ml-4">
                <p className="text-lg font-semibold">{track.name}</p>
                <p className="text-sm text-gray-500">{track.artists[0].name}</p>
              </div>
            </button>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default GenreListDetail;
