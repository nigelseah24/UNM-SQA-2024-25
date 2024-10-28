import React, { useEffect, useState } from "react";
import { fetchKeywords } from "./api";
import "./styling/KeywordList.css";

interface Keyword {
  id: number;
  name: string;
}

interface KeywordListProps {
  onKeywordsSelect: (selectedKeywords: string[]) => void;
}

const KeywordList: React.FC<KeywordListProps> = ({ onKeywordsSelect }) => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  useEffect(() => {
    const loadKeywords = async () => {
      const result = await fetchKeywords();
      setKeywords(result);
    };
    
    loadKeywords();
  }, []);

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prevSelected) => {
      const isSelected = prevSelected.includes(keyword);
      const updatedKeywords = isSelected
        ? prevSelected.filter((k) => k !== keyword)  // remove keyword if already selected
        : [...prevSelected, keyword];  // add keyword if not selected
      
      onKeywordsSelect(updatedKeywords);  // pass updated keywords to parent
      return updatedKeywords;
    });
  };

  return (
    <div className="keyword-list">
      {keywords.map((keyword) => (
        <button
        key={keyword.id}
        onClick={() => toggleKeyword(keyword.name)}
        className={selectedKeywords.includes(keyword.name) ? 'selected' : ''}
        >
          {keyword.name}
        </button>
      ))}
    </div>
  );
};

export default KeywordList;
