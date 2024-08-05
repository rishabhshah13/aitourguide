// src/components/TextInput.js
import React from 'react';

const TextInput = ({ setFileTextSegments }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        const segments = text.split('.').map(segment => segment.trim()).filter(segment => segment);
        setFileTextSegments(segments);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".txt" onChange={handleFileChange} />
    </div>
  );
};

export default TextInput;
