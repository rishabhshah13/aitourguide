// src/components/TextInput.js
import React from 'react';

const TextInput = ({ text, onTextChange, onFileChange }) => {
  return (
    <div>
      <input type="file" accept=".txt" onChange={onFileChange} />
      <textarea
        value={text}
        onChange={onTextChange}
        rows="4"
        cols="50"
        placeholder="Enter text here..."
      />
    </div>
  );
};

export default TextInput;
