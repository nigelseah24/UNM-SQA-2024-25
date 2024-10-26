import React from "react";

interface VideoCardProps {
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, description, thumbnail, videoId }) => (
  <div className="video-card">
    <img src={thumbnail} alt={title} />
    <h3>{title}</h3>
    <p>{description}</p>
    <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
      Watch Video
    </a>
  </div>
);

export default VideoCard;
