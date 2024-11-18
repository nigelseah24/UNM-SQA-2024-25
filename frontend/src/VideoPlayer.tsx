import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { getVideoDetails } from "./api";

interface VideoPlayerProps {
  videoId: string | null; // Video ID to play, null when no video is selected
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
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
        console.log("Channel Title:", video.channelTitle);
        console.log("Published At:", video.publishedAt);
        console.log("View Count:", video.viewCount);
        console.log("Duration:", video.duration);
        console.log("Like Count:", video.likeCount);
      });
    }
  }, [videoId]);

  return (
    <div>
      <ReactPlayer
        className="video-player"
        url={`https://www.youtube.com/embed/${videoId}`}
        playing
        controls
        onProgress={({ playedSeconds }) => setPlayedSeconds(playedSeconds)}
        onSeek={(seconds) => console.log(`Seeked to ${seconds} seconds`)}
      />
      <div className="video-player-content">
        <h1>{title}</h1>
        <p>
          <strong>Channel:</strong> {channelTitle}
        </p>
        <p>
          <strong>Published At:</strong> {publishedAt}
        </p>
        <p>
          <strong>View Count:</strong> {viewCount}
        </p>
        <p>
          <strong>Duration:</strong> {duration}
        </p>
        <p>
          <strong>Like Count:</strong> {likeCount}
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
