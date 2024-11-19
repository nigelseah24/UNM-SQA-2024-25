import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import { getVideoDetails } from "./api";

interface VideoPlayerProps {
  videoId: string | null; // Video ID to play, null when no video is selected
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  const playerRef = useRef<ReactPlayer>(null); // Reference to the ReactPlayer instance
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [title, setTitle] = useState("");
  const [channelTitle, setChannelTitle] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [duration, setDuration] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (videoId) {
      getVideoDetails(videoId).then((videoDetails) => {
        const video = videoDetails.items[0]; // Get the first video in the array

        // Safely set the state variables
        setTitle(video.title);
        setChannelTitle(video.channelTitle);
        setPublishedAt(video.publishedAt);
        setViewCount(video.viewCount);
        setDuration(video.duration);
        setLikeCount(video.likeCount);

        // Debugging logs
        console.log("Video Details:", videoDetails);
      });
    }
  }, [videoId]);

  // Handlers for custom controls
  const handlePlay = () => {
    playerRef.current?.getInternalPlayer()?.playVideo(); // Play video
  };

  const handlePause = () => {
    playerRef.current?.getInternalPlayer()?.pauseVideo(); // Pause video
  };

  const handleSkipForward = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    playerRef.current?.seekTo(currentTime + 5); // Skip forward 5 seconds
  };

  const handleSkipBackward = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    playerRef.current?.seekTo(Math.max(currentTime - 5, 0)); // Skip backward 5 seconds
  };

  return (
    <div>
      <ReactPlayer
        ref={playerRef}
        className="video-player"
        url={`https://www.youtube.com/embed/${videoId}`}
        playing
        controls={true} // Disable built-in controls
        onProgress={({ playedSeconds }) => setPlayedSeconds(playedSeconds)}
      />
      {/* Custom controls */}
      <div className="video-controls">
        <button className="play-button" onClick={handlePlay}>
          Play
        </button>
        <button className="pause-button" onClick={handlePause}>
          Pause
        </button>
        <button className="rewind-button" onClick={handleSkipBackward}>
          Rewind 5s
        </button>
        <button className="forward-button" onClick={handleSkipForward}>
          Forward 5s
        </button>
      </div>

      <div className="video-player-content">
        <h1>{title}</h1>
        <p className="channel-title">Channel: {channelTitle}</p>
        <p className="published-at">Published At: {publishedAt}</p>
        <p className="view-count">View Count: {viewCount}</p>
        <p className="duration">Duration: {duration}</p>
        <p className="like-count">Like Count: {likeCount}</p>
        <p className="played-seconds">Played seconds: {playedSeconds}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
