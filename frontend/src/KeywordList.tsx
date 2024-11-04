import React, { useState } from "react";
import "./styling/KeywordList.css";

interface Keyword {
  id: number;
  name: string;
}

interface KeywordListProps {
  keywords: Keyword[];
  onKeywordsSelect: (selectedKeywords: string[]) => void;
}

const KeywordList: React.FC<KeywordListProps> = ({
  keywords,
  onKeywordsSelect,
}) => {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([
    "Workflow",
    "Code",
    "Assistant",
    "Software",
    "Development",
    "Debugging",
    "Testing",
    "Documentation",
    "Learning",
    "Tools",
    "Automation",
    "AI",
  ]);

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prevSelected) => {
      const isSelected = prevSelected.includes(keyword);
      const updatedKeywords = isSelected
        ? prevSelected.filter((k) => k !== keyword)
        : [...prevSelected, keyword];

      onKeywordsSelect(updatedKeywords);
      return updatedKeywords;
    });
  };

  return (
    <div className="keyword-list">
      {keywords.map((keyword) => (
        <button
          key={keyword.id}
          onClick={() => toggleKeyword(keyword.name)}
          className={selectedKeywords.includes(keyword.name) ? "selected" : ""}
        >
          {keyword.name}
        </button>
      ))}
    </div>
  );
};

export default KeywordList;
