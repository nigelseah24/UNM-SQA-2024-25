import React, { useState } from "react";
import VideoList from "./VideoList";
import KeywordList from "./KeywordList";
import AddKeywordForm from "./AddKeyword";
import VideoPlayer from './VideoPlayer';
import "./styling/App.css";

const App: React.FC = () => {
  const [query, setQuery] = useState("Workflow+Code+Assistant+AI+Software+Development+Debugging+Testing+Documentation+Learning+Tools+Automation");
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  // for selecting multiple keywords
  const handleKeywordsSelect = (selectedKeywords: string[]) => {
    const combinedQuery = selectedKeywords.join('+');  // combine keywords with '+'
    setQuery(combinedQuery);
  };

  // for adding keyword
  const handleKeywordSelect = (keyword: string) => {
    setQuery(keyword);
  };

  return (
    <div className="App">
      <h1>YouTube Video Collection App</h1>
      <AddKeywordForm onKeywordAdded={() => handleKeywordSelect(query)} />
      <KeywordList onKeywordsSelect={handleKeywordsSelect} />

      <div className="content-wrapper">
      
        <div className="video-list-wrapper">
          <VideoList query={query} onVideoSelect={(videoId) => setSelectedVideoId(videoId)} />
        </div>
        <div className="video-player-wrapper">
        <VideoPlayer videoId={selectedVideoId} />
        </div>
    </div>
    </div>
  );
};

export default App;

