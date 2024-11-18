import React, { useState, useEffect } from "react";
import VideoList from "./VideoList";
import KeywordList from "./KeywordList";
import AddKeywordForm from "./AddKeyword";
import VideoPlayer from "./VideoPlayer";
import { fetchKeywords } from "./api"; // Import the API function
import "./styling/App.css";

const App: React.FC = () => {
  const [query, setQuery] = useState(
    "Workflow+Code+Assistant+AI+Software+Development+Debugging+Testing+Documentation+Learning+Tools+Automation"
  );
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [keywords, setKeywords] = useState([]); // State to hold keywords

  // Function to fetch and update keywords
  const refreshKeywords = async () => {
    const result = await fetchKeywords();
    setKeywords(result);
    console.log("Fetched keywords:", result); // Log the fetched keywords
  };

  useEffect(() => {
    refreshKeywords(); // Load keywords initially
  }, []);

  const handleKeywordsSelect = (selectedKeywords: string[]) => {
    const combinedQuery = selectedKeywords.join("+");
    setQuery(combinedQuery);
  };

  const handleKeywordAdded = () => {
    refreshKeywords(); // Refresh keywords when a new one is added
  };

  return (
    <div className="App">
      <h1>YouTube Video Collection App</h1>
      <AddKeywordForm onKeywordAdded={handleKeywordAdded} />
      <KeywordList
        keywords={keywords}
        onKeywordsSelect={handleKeywordsSelect}
      />

      <div className="content-wrapper">
        <div className="video-list-wrapper">
          <VideoList
            query={query}
            onVideoSelect={(videoId) => {
              setSelectedVideoId(videoId);
            }}
          />
        </div>
        <div className="video-player-wrapper">
          <VideoPlayer videoId={selectedVideoId} />
        </div>
      </div>
    </div>
  );
};

export default App;
