import React, { useEffect, useState } from "react";
import { fetchKeywords } from "./api";

interface Keyword {
  id: number;
  name: string;
}

interface KeywordListProps {
  onKeywordSelect: (keyword: string) => void;
}

const KeywordList: React.FC<KeywordListProps> = ({ onKeywordSelect }) => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  useEffect(() => {
    const loadKeywords = async () => {
      const result = await fetchKeywords();
      setKeywords(result);
    };
    
    loadKeywords();
  }, []);

  return (
    <div className="keyword-list">
      {keywords.map((keyword) => (
        <button key={keyword.id} onClick={() => onKeywordSelect(keyword.name)}>
          {keyword.name}
        </button>
      ))}
    </div>
  );
};

export default KeywordList;
