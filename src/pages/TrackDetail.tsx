// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { SearchGenreTrackType, PlayTrack, Artist } from "../types/types";
// import { apiGetTrackList } from "../api/api";
// import { usePlayer } from "./player/PlayerContext";
// import { addRecentTrackInfo } from "../store/recentTrackInfo";
// import { useDispatch } from "react-redux";
// import { getRecentTrack, setRecentTrack } from "../helper/storage";
// import { mapTrackToTrackListDataType } from "./SearchResult";
// import { TrackListDataType } from "./PlaylistTrack";

// const TrackDetail: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const search = searchParams.get("search");
//   const id = searchParams.get("id");
//   const [data, setData] = useState<SearchGenreTrackType>({
//     tracks: { items: [] },
//   });
//   const { setCurrentTrack } = usePlayer();
//   const dispatch = useDispatch();
//   useEffect(() => {
//     if (!search || !id) return;

//     const fetchTrack = async () => {
//       const res = await apiGetTrackList(search);
//       setData(res);
//       console.log(res);
//       const track = res.tracks.items.find((item: PlayTrack) => item.id === id);

//       if (track) {
//         const simplifiedTrack: TrackListDataType = {
//         trackId: track.id,
//           trackName: track.name,
//           trackDuration: track.duration_ms,
//           artists: track.artists,
//           releaseDate:  track.duaration,
//           playlistId :track.playlistId,
//           playlistTrackCreateDate: playlistCreateDate,
//           trackImageUrl:
//         };

//         setCurrentTrack(simplifiedTrack);

//         const recentTrack: PlayTrack = {
//           id: track.id,
//           name: track.name,
//           duration_ms: track.duration_ms,
//           artists: track.artists.map((a: Artist) => ({ name: a.name })),
//           album: {
//             release_date: track.album.release_date,
//             images: track.album.images,
//           },
//         };
//         dispatch(addRecentTrackInfo(recentTrack));

//         const stored = getRecentTrack();
//         const updated = [
//           recentTrack,
//           ...stored.filter((t) => t.name !== recentTrack.name),
//         ];
//         if (updated.length > 10) updated.pop();
//         setRecentTrack(updated);
//       }
//     };

//     fetchTrack();
//   }, [search, id, setCurrentTrack]);
//   // console.log(recentTarckInfo);
//   // console.log(getRecentTrack());
//   const selectedTrack = data.tracks.items.find((item) => item.id === id);
//   if (!selectedTrack) return <div>트랙을 찾을 수 없습니다.</div>;

//   return (
//     <div className="flex flex-col items-center p-6">
//       <img
//         className="w-72 h-72 rounded-xl shadow-xl shadow-gray-700 mb-6"
//         src={
//           selectedTrack.album.images[1]?.url ||
//           selectedTrack.album.images[0]?.url
//         }
//         alt={`${selectedTrack.name} 앨범 커버`}
//       />
//       <p className="text-2xl font-bold text-center mb-2">
//         {selectedTrack.name}
//       </p>
//       <p className="text-lg text-gray-400 text-center mb-1">
//         {selectedTrack.artists[0]?.name}
//       </p>
//       <p className="text-sm text-center text-gray-500">
//         {selectedTrack.album.release_date}
//       </p>
//     </div>
//   );
// };

// export default TrackDetail;
