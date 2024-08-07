import React, { useRef, useState } from 'react';
import '../styles/textinput.css'; // Ensure this import is included

const TextInput = ({ setFileTextSegments, setSelectedOption }) => {
  const fileInputRef = useRef(null);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [fileContent, setFileContent] = useState('');
  const [selectedOption, setSelectedOptionState] = useState('GPT4o'); // Default option

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        const segments = text
          .split('.')
          .map((segment) => segment.trim())
          .filter((segment) => segment);
        setFileTextSegments(segments);
        setFileContent(text); // Set file content to state
      };
      reader.readAsText(file);
      setButtonVisible(false); // Hide the button after file selection
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDropdownChange = (e) => {
    const option = e.target.value;
    setSelectedOption(option);
    setSelectedOptionState(option);
  };

  return (
    <div className="text-input-container">
      {buttonVisible && (
        <div className="button-dropdown-container">
          <button onClick={handleButtonClick} className="add-tour-guide-button">
            Add Tour Guide
          </button>
          <select
            value={selectedOption}
            onChange={handleDropdownChange}
            className="dropdown-menu"
          >
            <option value="GPT4o">GPT4o</option>
            <option value="Mistral">Mistral</option>
          </select>
        </div>
      )}
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      {!buttonVisible && fileContent && (
        <div className="file-content-box">
          <pre>{fileContent}</pre>
        </div>
      )}
    </div>
  );
};

export default TextInput;
