import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { fetchVideos } from "./api";

interface Video {
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
}

interface VideoListProps {
  query: string;
}

const VideoList: React.FC<VideoListProps> = ({ query }) => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      const result = await fetchVideos(query);
      setVideos(result);
    };

    loadVideos();
  }, [query]);

  return (
    <div className="video-list">
      {videos.map((video, index) => (
        <VideoCard key={index} {...video} />
      ))}
    </div>
  );
};

export default VideoList;
