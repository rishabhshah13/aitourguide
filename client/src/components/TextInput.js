import React, { useRef, useState } from 'react';
import '../styles/textinput.css'; // Ensure this import is included

/**
 * A component that allows users to upload a JSON file, displays its content,
 * and provides a dropdown menu for selecting an option.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setFileTextSegments - A function to set the text segments extracted from the file.
 * @param {Function} props.setSelectedOption - A function to set the selected option from the dropdown menu.
 * @param {number} props.currentSegmentIndex - The index of the currently selected segment.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Example usage:
 * <TextInput
 *   setFileTextSegments={(segments) => console.log('Text segments:', segments)}
 *   setSelectedOption={(option) => console.log('Selected option:', option)}
 *   currentSegmentIndex={0} // Example segment index for highlighting
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
        try {
          const jsonData = JSON.parse(reader.result);
          // Process JSON data
          const segments = jsonData.map((item) => ({
            place: item.place,
            script: item.script,
          }));

          // Complex regex for sentence segmentation
          const sentenceRegex = /(?<!\b\w\.\w.)(?<=[.!?])\s+(?=[A-Z])/g;

          // Create segments with headings and text, and handle images
          const segmentsWithHeadingsAndImages = segments.map((segment) => {
            const scriptWithImages = segment.script.replace(
              /<<image\s+\[(.*?)\]\s+>>/g,
              (_, imagePath) => {
                const url = `http://localhost:8000/image/${imagePath}`;
                // Return image div with CSS class for styling
                return `<div class="image-container"><img src="${url}" alt="Image" /></div>`;
              }
            );

            // Split the script into segments while preserving images and ensuring paragraphs are well-formed
            const segmentsWithImages = scriptWithImages.split(
              /(<div class="image-container">.*?<\/div>)/
            );

            const formattedSegments = segmentsWithImages
              .map((segment) => {
                if (/^<div class="image-container">.*<\/div>$/.test(segment)) {
                  // It's an image div, return it as is
                  return segment;
                } else {
                  // It's text, wrap it in <p> tags
                  return segment
                    .split(sentenceRegex)
                    .map((sentence) => sentence.trim())
                    .filter((sentence) => sentence)
                    .map((sentence) => `<p>${sentence}</p>`)
                    .join('');
                }
              })
              .join('');

            // Return formatted segment with heading and segmented sentences
            return `<h2>${segment.place}</h2>${formattedSegments}`;
          });

          setFileTextSegments(segmentsWithHeadingsAndImages);
          setFileTextSegmentsState(segmentsWithHeadingsAndImages); // Set file text segments to state
          setFileContent(JSON.stringify(jsonData, null, 2)); // Set file content to state

          // Create payload with segmentsWithHeadingsAndImages
          const payload = JSON.stringify(segmentsWithHeadingsAndImages);

          fetch('http://localhost:8000/data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: payload,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.text(); // Or response.json() if the response is JSON
            })
            .then((data) => {
              console.log('Response data:', data);
              // Handle the response data here
            })
            .catch((error) => {
              console.error(
                'There was a problem with the fetch operation:',
                error
              );
            });
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
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
        accept=".json"
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
