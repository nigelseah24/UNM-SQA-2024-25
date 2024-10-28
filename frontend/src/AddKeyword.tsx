import React, { useState } from "react";
import { addKeyword } from "./api";

interface AddKeywordFormProps {
  onKeywordAdded: () => void;
}

const AddKeywordForm: React.FC<AddKeywordFormProps> = ({ onKeywordAdded }) => {
  const [name, setName] = useState("");

  const handleAddKeyword = async () => {
    await addKeyword(name);
    setName("");
    onKeywordAdded();
  };

  return (
    <div className="add-keyword-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter new keyword"
      />
      <button onClick={handleAddKeyword}>Add Keyword</button>
    </div>
  );
};

export default AddKeywordForm;
