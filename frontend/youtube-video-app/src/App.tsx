import React, { useState } from "react";
import VideoList from "./VideoList";
import KeywordList from "./KeywordList";
import AddKeywordForm from "./AddKeyword";
import "./App.css";

const App: React.FC = () => {
  const [query, setQuery] = useState("AI");

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
      <VideoList query={query} />
    </div>
  );
};

export default App;

