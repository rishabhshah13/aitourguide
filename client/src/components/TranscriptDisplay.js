// src/components/TranscriptDisplay.js
import React from 'react';

const TranscriptDisplay = ({ transcript, currentSegmentIndex, fileTextSegments }) => {
  return (
    <div>
      {/* <h3>Transcript:</h3> */}
      {/* <p>{transcript}</p> */}
      <h3>File Text Segments:</h3>
      {fileTextSegments.map((segment, index) => (
        <span
          key={index}
          style={{
            backgroundColor: index === currentSegmentIndex ? 'yellow' : 'transparent'
          }}
        >
          {segment}.
        </span>
      ))}
    </div>
  );
};

export default TranscriptDisplay;
