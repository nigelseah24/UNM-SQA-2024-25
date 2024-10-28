import React from "react";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  videoId: string;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, thumbnail, onClick }) => (
  <div className="video-card" onClick={onClick} style={{ cursor: 'pointer' }}>
    <img src={thumbnail} alt={title} />
    <h4>{title}</h4>
  </div>
);

export default VideoCard;
