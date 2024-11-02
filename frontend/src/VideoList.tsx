import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { fetchVideos } from "./api";
import './styling/App.css';

interface Video {
  title: string;
  thumbnail: string;
  videoId: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
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
      console.log("Fetched videos:", result); // Log the fetched videos
      setVideos(result);
    };

    loadVideos();
  }, [query]);

  return (
    <div className="video-list">
      {videos.map((video, index) => (
        <VideoCard 
        key={index} 
        title={video.title}
        thumbnail={video.thumbnail}
        videoId={video.videoId} 
        channelTitle={video.channelTitle}
        publishedAt={video.publishedAt}
        viewCount={video.viewCount}
        duration={video.duration}
        onClick={() => {console.log("Selected videoId in VideoList:", video.videoId); onVideoSelect(video.videoId)}} />
      ))}
    </div>
  );
};

export default VideoList;
