// src/components/TranscriptDisplay.js
import React from 'react';

const TranscriptDisplay = ({ transcript }) => {
  return (
    <div>
      {transcript && (
        <div>
          <h3>Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay;
