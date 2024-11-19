import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { fetchVideos } from "./api";
import "./styling/App.css";

interface Video {
  title: string;
  thumbnail: string;
  videoId: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
  likeCount: string;
}

interface VideoListProps {
  query: string;
  onVideoSelect: (videoId: string) => void;
}

const VideoList: React.FC<VideoListProps> = ({ query, onVideoSelect }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoIdList, setVideoIdList] = useState<string[]>([]);
  const [sortCriteria, setSortCriteria] = useState<string>("publishedAt");

  useEffect(() => {
    const loadVideos = async () => {
      if (!query) return;

      try {
        const result = await fetchVideos(query);
        console.log("Fetched videos:", result); // Log the fetched videos

        setVideos(result); // Update the videos state

        // Extract video IDs and update videoIdList state
        const videoIds = result.map((video: Video) => video.videoId);
        setVideoIdList(videoIds);

        // Log video IDs after they are processed
        console.log("Video ID List:", videoIds);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    loadVideos();
  }, [query]);

  const parseDuration = (duration: string): number => {
    const parts = duration.split(":").map(Number);
    if (parts.length === 3) {
      // Format is "H:MM:SS"
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // Format is "MM:SS"
      return parts[0] * 60 + parts[1];
    }
    return 0; // Fallback in case of unexpected format
  };

  // Function to sort videos based on selected criteria
  const sortVideos = (videos: Video[], criteria: string) => {
    return [...videos].sort((a, b) => {
      switch (criteria) {
        case "publishedAt":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          ); // Newest first
        case "duration":
          return parseDuration(b.duration) - parseDuration(a.duration); // Sort by duration
        case "likeCount":
          return parseInt(b.likeCount) - parseInt(a.likeCount); // Sort by likes
        default:
          return 0; // No sorting
      }
    });
  };

  const sortedVideos = sortVideos(videos, sortCriteria);

  return (
    <div>
      <div>
        <label htmlFor="sort">Sort by: </label>
        <select
          id="sort"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="publishedAt">Date Uploaded</option>
          <option value="duration">Duration</option>
          <option value="likeCount">Likes</option>
        </select>
      </div>

      <div className="video-list">
        {sortedVideos.map((video, index) => (
          <VideoCard
            key={index}
            title={video.title}
            thumbnail={video.thumbnail}
            videoId={video.videoId}
            channelTitle={video.channelTitle}
            publishedAt={video.publishedAt}
            viewCount={video.viewCount}
            duration={video.duration}
            likeCount={video.likeCount}
            onClick={() => {
              console.log("Selected videoId in VideoList:", video.videoId);
              onVideoSelect(video.videoId);
            }}
          />
        ))}
      </div>
      <p style={{ color: "white" }} className="video-id-list">
        {videoIdList}
      </p>
    </div>
  );
};

export default VideoList;
