// src/components/Popup.js
import React from 'react';
import '../styles/popup.css';

const Popup = ({ message, onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup-message">{message}</div>
      <button className="popup-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default Popup;
