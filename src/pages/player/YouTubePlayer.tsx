import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { usePlayer } from "./PlayerContext";
import { searchYoutubeVideoId } from "./searchYoutubeVideoId";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userInfo";

const YouTubePlayer: React.FC = () => {
  const userInfo = useSelector(selectUserInfo);
  const isLogined = userInfo.username !== "";
  const {
    currentTrack,
    isPlaying,
    setPlayed,
    setDuration,
    volume,
    nextTrack,
    playerRef,
    playlistTrackList,
    setIsPlaying,
    duration,
  } = usePlayer();

  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentTrack) return;
    console.log(currentTrack.trackId);
    let query = "";
    if (currentTrack.trackName) {
      query = `${currentTrack.trackName} ${currentTrack.artists}`;
    } else {
      query = `${playlistTrackList.trackName} ${playlistTrackList.artists}`;
    }
    const fetchVideo = async () => {
      const id = await searchYoutubeVideoId(query);
      setVideoId(id);
    };

    fetchVideo();
  }, [currentTrack]);

  if (!videoId) return null;

  return (
    <ReactPlayer
      ref={playerRef}
      url={`https://www.youtube.com/watch?v=${videoId}`}
      playing={isPlaying}
      controls={false}
      width="100%"
      height="0"
      volume={volume / 100}
      onProgress={({ played }) => {
        setPlayed(played);
        if (
          (userInfo.username === "" ||
            !(
              userInfo.sub ||
              String(userInfo.roleNo) === "2" ||
              String(userInfo.roleNo) === "3"
            )) &&
          played * duration > 30
        ) {
          playerRef.current?.seekTo(0);
          setIsPlaying(false);
          setPlayed(0);
        }
      }}
      onDuration={setDuration}
      onEnded={nextTrack}
    />
  );
};

export default YouTubePlayer;
