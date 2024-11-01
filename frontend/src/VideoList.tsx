import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { fetchVideos } from "./api";
import './styling/VideoList.css';

interface Video {
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
}

interface VideoListProps {
  query: string;
  onVideoSelect: (videoId: string) => void;
}

const VideoList: React.FC<VideoListProps> = ({ query, onVideoSelect }) =>{
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      const result = await fetchVideos(query);
      console.log("Fetched videos:", result);
      setVideos(result);
    };

    loadVideos();
  }, [query]);

  return (
    <div className="video-list">
      {videos.map((video, index) => (
        <VideoCard 
        key={index} 
        {...video} 
        onClick={() =>{  
          console.log("Selected videoId in VideoList:", video.videoId); 
          onVideoSelect(video.videoId)}} />
      ))}
    </div>
  );
};

export default VideoList;
