import React, { useRef, useState } from 'react';
import '../styles/textinput.css'; // Ensure this import is included
import nlp from 'compromise';

/**
 * A component that allows users to upload a text file, displays its content,
 * and provides a dropdown menu for selecting an option.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setFileTextSegments - A function to set the text segments extracted from the file.
 * @param {Function} props.setSelectedOption - A function to set the selected option from the dropdown menu.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Example usage:
 * <TextInput
 *   setFileTextSegments={(segments) => console.log('Text segments:', segments)}
 *   setSelectedOption={(option) => console.log('Selected option:', option)}
 * />
 */
const TextInput = ({
  setFileTextSegments,
  setSelectedOption,
  currentSegmentIndex,
}) => {
  // Ref for the file input element
  const fileInputRef = useRef(null);
  // State to control button visibility
  const [buttonVisible, setButtonVisible] = useState(true);
  // State to store file content
  const [fileContent, setFileContent] = useState('');
  // State to manage selected dropdown option
  const [selectedOption, setSelectedOptionState] = useState('GPT4o'); // Default option
  // State to manage file text segments
  const [fileTextSegments, setFileTextSegmentsState] = useState([]);
  // State to manage the current segment index

  /**
   * Handles file selection and reads the file content.
   *
   * @param {Event} e - The event object from the file input change event.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        const doc = nlp(text);
        const segments = doc.sentences().out('array');

        // Parse the custom image format and replace it in the text
        const segmentsWithImages = segments.map((segment) => {
          return segment.replace(
            /<<image\s+\[(.*?)\]\s+>>/g,
            (_, imagePath) => {
              const url = `http://localhost:8000/assets/${imagePath}`;
              return `<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`;
              // return (
              //   <img
              //     src={process.env.PUBLIC_URL + imagePath}
              //     alt="embedded"
              //     style={{ maxWidth: '100%', height: 'auto' }}
              //   />
              // );
              // return `<img src="/Users/rishabhshah/Desktop/ai-tour-guide/virtual-tour-guide/assets/about_the_white_house.jpeg" alt="Image" style="max-width: 100%; height: auto;"/>`;
            }
          );
        });

        setFileTextSegments(segmentsWithImages);
        setFileTextSegmentsState(segmentsWithImages); // Set file text segments to state
        setFileContent(text); // Set file content to state
      };
      reader.readAsText(file);
      setButtonVisible(false); // Hide the button after file selection
    }
  };

  /**
   * Triggers the file input click event programmatically.
   */
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  /**
   * Handles dropdown menu changes and updates the selected option.
   *
   * @param {Event} e - The event object from the dropdown change event.
   */
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
          <div className="dropdown-container">
            <label className="dropdown-label" htmlFor="model-select">
              Select Model
            </label>
            <select
              id="model-select"
              value={selectedOption}
              onChange={handleDropdownChange}
              className="dropdown-menu"
            >
              <option value="GPT4o">GPT4o</option>
              <option value="Mistral">Mistral</option>
            </select>
          </div>
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
          <pre>
            {fileTextSegments.length > 0 && (
              <div>
                {fileTextSegments.map((segment, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor:
                        index === currentSegmentIndex
                          ? 'yellow'
                          : 'transparent',
                    }}
                    dangerouslySetInnerHTML={{ __html: segment }}
                  />
                ))}
              </div>
            )}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TextInput;
