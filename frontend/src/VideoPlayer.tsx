// import React, { useRef } from "react";

import React, { useState } from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoId: string | null; // Video ID to play, null when no video is selected
}

// const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
//   const videoRef = useRef<HTMLIFrameElement | null>(null);

//   return (
//     <div
//       className="video-player"
//       style={{ textAlign: "center", margin: "20px auto" }}
//     >
//       {videoId ? (
//         <iframe
//           ref={videoRef}
//           width="560"
//           height="315"
//           src={`https://www.youtube.com/embed/${videoId}`}
//           title="YouTube Video Player"

//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//         />
//       ) : (
//         <p>Select a video to play</p>
//       )}
//     </div>
//   );
// };

// export default VideoPlayer;

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  const [playedSeconds, setPlayedSeconds] = useState(0);

  return (
    <div>
      <ReactPlayer
      className = "video-player"
        url={`https://www.youtube.com/embed/${videoId}`}
        playing
        controls
        onProgress={({ playedSeconds }) => setPlayedSeconds(playedSeconds)}
        onSeek={(seconds) => console.log(`Seeked to ${seconds} seconds`)}
      />
      <p className="played-seconds">Played seconds: {playedSeconds}</p>
    </div>
  );
};

export default VideoPlayer;
