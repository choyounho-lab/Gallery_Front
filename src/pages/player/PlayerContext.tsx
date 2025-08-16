import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  MutableRefObject,
  useEffect,
} from "react";
import ReactPlayer from "react-player";
import { TrackListDataType } from "../PlaylistTrack";
import { hostInstance } from "../../api/hostInstance";

interface PlayerContextType {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  played: number;
  setPlayed: (value: number) => void;
  duration: number;
  setDuration: (value: number) => void;
  currentTrack: TrackListDataType | null;
  setCurrentTrack: (track: TrackListDataType | null) => void;
  trackList: TrackListDataType[];
  setTrackList: (list: TrackListDataType[]) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleRepeat: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  volume: number;
  setVolume: (value: number) => void;
  playerRef: MutableRefObject<ReactPlayer | null>;
  repeatMode: "off" | "one" | "all";
  currentIndex: number;
  playlistTrackList: TrackListDataType;
  setCurrentIndex: (value: number) => void;
  refresh: number;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
  reset: () => void;
}
type RepeatMode = "off" | "one" | "all";
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackListDataType | null>(
    null
  );
  const playerRef = useRef<ReactPlayer | null>(null);
  const [trackList, setTrackList] = useState<TrackListDataType[]>([]);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");
  const [playlistTrackList, setPlaylistTrackList] = useState<TrackListDataType>(
    {
      playlistId: 0,
      trackId: "",
      trackName: "",
      artists: "",
      trackDuration: 0,
      releaseDate: "",
      trackImageUrl: "",
      playlistTrackCreateDate: "",
    }
  );
  useEffect(() => {
    if (currentTrack)
      setPlaylistTrackList({
        playlistId: 0,
        trackId: currentTrack.trackId,
        trackName: currentTrack.trackName,
        artists: currentTrack.artists,
        trackDuration: currentTrack.trackDuration,
        releaseDate: "",
        trackImageUrl: "",
        playlistTrackCreateDate: "",
      });
  }, [, currentTrack]);

  const nextTrack = async () => {
    if (repeatMode === "one") {
      playerRef.current?.seekTo(0); // 현재 곡 반복
      return;
    }

    if (shuffle && trackList.length > 1) {
      // 셔플 모드: 현재 곡 제외한 랜덤 곡 선택
      let next = Math.floor(Math.random() * trackList.length);
      while (next === currentIndex) {
        next = Math.floor(Math.random() * trackList.length);
      }
      setCurrentTrack(trackList[next]);
      setCurrentIndex(next);
      await hostInstance.post("track/save", {
        trackId: currentTrack?.trackId,
        trackName: currentTrack?.trackName,
        artists: currentTrack?.artists,
        trackDuration: currentTrack?.trackDuration,
        releaseDate: currentTrack?.releaseDate,
        trackImageUrl: currentTrack?.trackImageUrl,
      });
      await hostInstance.post("track/save/date", {
        trackId: currentTrack?.trackId,
      });
    } else {
      const isLast = currentIndex === trackList.length - 1;
      const next = currentIndex + 1;

      if (isLast) {
        if (repeatMode === "all") {
          setCurrentTrack(trackList[0]);
          setCurrentIndex(0);

          await hostInstance.post("track/save", {
            trackId: currentTrack?.trackId,
            trackName: currentTrack?.trackName,
            artists: currentTrack?.artists,
            trackDuration: currentTrack?.trackDuration,
            releaseDate: currentTrack?.releaseDate,
            trackImageUrl: currentTrack?.trackImageUrl,
          });
          await hostInstance.post("track/save/date", {
            trackId: currentTrack?.trackId,
          });
        } else {
          setIsPlaying(false); // 마지막 곡이고 반복 없음이면 정지
        }
      } else {
        setCurrentTrack(trackList[next]);
        setCurrentIndex(next);
        await hostInstance.post("track/save", {
          trackId: currentTrack?.trackId,
          trackName: currentTrack?.trackName,
          artists: currentTrack?.artists,
          trackDuration: currentTrack?.trackDuration,
          releaseDate: currentTrack?.releaseDate,
          trackImageUrl: currentTrack?.trackImageUrl,
        });
        await hostInstance.post("track/save/date", {
          trackId: currentTrack?.trackId,
        });
      }
    }
  };
  const prevTrack = async () => {
    const currentTime = playerRef.current?.getCurrentTime?.() || 0;

    if (currentTime > 3) {
      // 재생 위치가 3초 이상이면 현재 곡 처음부터
      playerRef.current?.seekTo(0);
      return;
    }

    if (trackList.length === 0) return;

    const prev = currentIndex === 0 ? trackList.length - 1 : currentIndex - 1;
    setCurrentTrack(trackList[prev]);
    setCurrentIndex(prev);
    await hostInstance.post("track/save", {
      trackId: currentTrack?.trackId,
      trackName: currentTrack?.trackName,
      artists: currentTrack?.artists,
      trackDuration: currentTrack?.trackDuration,
      releaseDate: currentTrack?.releaseDate,
      trackImageUrl: currentTrack?.trackImageUrl,
    });
    await hostInstance.post("track/save/date", {
      trackId: currentTrack?.trackId,
    });
  };
  const toggleRepeat = () => {
    setRepeatMode((prev) =>
      prev === "off" ? "one" : prev === "one" ? "all" : "off"
    );
  };
  const toggleShuffle = () => setShuffle((prev) => !prev);
  const [refresh, setRefresh] = useState<number>(0);
  const reset = () => {
    playerRef.current?.seekTo(0);
    setIsPlaying(false);
    setCurrentTrack(null);
    setRepeatMode("all");
    setTrackList([]);
    setVolume(50);
  };
  useEffect(() => {}, [refresh]);
  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        played,
        setPlayed,
        duration,
        setDuration,
        currentTrack,
        setCurrentTrack,
        trackList,
        setTrackList,
        nextTrack,
        prevTrack,
        toggleRepeat,
        shuffle,
        toggleShuffle,
        volume,
        setVolume,
        playerRef,
        repeatMode,
        currentIndex,
        playlistTrackList,
        setCurrentIndex,
        refresh,
        setRefresh,
        reset,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};
