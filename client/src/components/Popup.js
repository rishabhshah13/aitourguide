// src/components/Popup.js
import React from 'react';
import './Popup.css';

const Popup = ({ message, onClose }) => (
  <div className="popup-overlay">
    <div className="popup-modal">
      <p>{message}</p>
      <button onClick={onClose} className="popup-button">Close</button>
    </div>
  </div>
);

export default Popup;
