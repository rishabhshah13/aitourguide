// Import React and the CSS styles for the popup component
import React from 'react';
import '../styles/popup.css';

/**
 * A functional component that renders a popup message with a close button.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.message - The message to be displayed in the popup.
 * @param {Function} props.onClose - The callback function to be called when the close button is clicked.
 *
 * @returns {JSX.Element} The JSX code for rendering the popup.
 *
 * @component
 * @example
 * // Example usage:
 * const handleClose = () => { console.log('Popup closed'); };
 * <Popup message="This is a popup message" onClose={handleClose} />
 */
const Popup = ({ message, onClose }) => {
  return (
    <div className="popup-container">
      {/* Display the popup message */}
      <div className="popup-message">{message}</div>
      {/* Button to close the popup */}
      <button className="popup-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

// Export the Popup component as the default export
export default Popup;
