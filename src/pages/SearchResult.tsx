import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ApiGetAlbumType,
  ApiGetArtistType,
  PlayTrack,
  SearchGenreTrackType,
  Track,
} from "../types/types";
import { apiGetAlbumList, apiGetArtistList, apiGetTrackList } from "../api/api";
import { usePlayer } from "./player/PlayerContext";
import { addRecentTrackInfo } from "../store/recentTrackInfo";
import { useDispatch, useSelector } from "react-redux";
import { getRecentTrack, setRecentTrack } from "../helper/storage";
import { selectUserInfo } from "../store/userInfo";
import { hostInstance } from "../api/hostInstance";
import { TrackListDataType } from "./PlaylistTrack";

export function mapTrackToTrackListDataType(
  track: Track,
  playlistId: number,
  playlistTrackCreateDate: string
): TrackListDataType {
  return {
    playlistId,
    trackId: track.id,
    trackName: track.name,
    artists: track.artists.map((artist) => artist.name).join(", "),
    trackDuration: track.duration_ms,
    releaseDate: track.album.release_date,
    trackImageUrl: track.album.images?.[1]?.url ?? "",
    playlistTrackCreateDate,
  };
}
const SearchResult = () => {
  const { search, genre } = useParams<{ search?: string; genre?: string }>();

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
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const { setCurrentTrack, setIsPlaying, setTrackList, setCurrentIndex } =
    usePlayer();

  // (트랙) 버튼 클릭 시
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
    // 버튼 누르면 무조건 재생 상태로 변경
    setIsPlaying(true);

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
      const [trackRes, albumRes, artistRes] = await Promise.all([
        apiGetTrackList(search),
        apiGetAlbumList(search, 0),
        apiGetArtistList(search),
      ]);
      setData(trackRes);
      setAlbumData(albumRes);
      setArtistData(artistRes);
    };

    fetchData();
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-800">
      {/* 아티스트 섹션 */}
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">아티스트</h2>
      <ul className="flex flex-wrap gap-6 mb-14">
        {artistData.artists.items.map((artist) =>
          artist.images[1]?.url || artist.images[0]?.url ? (
            <li key={artist.id} className="w-40 text-center">
              <Link to={`/artistDetail?search=${artist.name}&id=${artist.id}`}>
                <img
                  src={artist.images[1]?.url || artist.images[0]?.url}
                  alt={artist.name}
                  className="w-40 h-40 object-cover rounded-full shadow-md hover:shadow-xl transition"
                />
                <p className="mt-2 font-semibold line-clamp-1">{artist.name}</p>
                <p className="text-sm text-gray-500">{`팔로워 ${artist.followers.total.toLocaleString()}`}</p>
              </Link>
            </li>
          ) : null
        )}
      </ul>

      {/* 앨범 섹션 */}
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">앨범</h2>
      <ul className="flex flex-wrap gap-6 mb-14">
        {albumData.albums.items.map((album) => (
          <li key={album.id} className="w-40">
            <Link to={`/albumDetail?search=${album.name}&id=${album.id}`}>
              <img
                src={album.images[1].url}
                alt={album.name}
                className="w-40 h-40 object-cover rounded-xl shadow-md hover:shadow-xl transition"
              />
              <p className="mt-2 font-semibold line-clamp-1">{album.name}</p>
              <p className="text-sm text-gray-500">{album.artists[0].name}</p>
            </Link>
          </li>
        ))}
      </ul>

      {/* 노래 섹션 */}
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">노래</h2>
      <ul className="space-y-4">
        {data.tracks.items.map((track, index) => (
          <li key={track.id}>
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResult;
