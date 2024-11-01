import React from "react";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  videoId: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  title, 
  thumbnail, 
  channelTitle,
  publishedAt,
  viewCount,
  duration,
  onClick }) => (
  <div className="video-card" onClick={onClick} style={{ cursor: 'pointer', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', margin: '10px' }}>
    <img src={thumbnail} alt={title} style={{ width: '100%', borderRadius: '8px' }} />
    <h4>{title}</h4>
    <p><strong>Channel:</strong> {channelTitle}</p>
    <p><strong>Published:</strong> {new Date(publishedAt).toLocaleDateString()}</p>
    <p><strong>Views:</strong> {parseInt(viewCount).toLocaleString()}</p>
    <p><strong>Duration:</strong> {duration}</p>
  </div>
);

export default VideoCard;
