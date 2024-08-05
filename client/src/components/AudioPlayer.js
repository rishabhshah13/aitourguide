// src/components/AudioPlayer.js
import React from 'react';

const AudioPlayer = ({ src }) => {
  return (
    <div>
      {src && (
        <div>
          <h3>Generated Audio:</h3>
          <audio controls src={src} />
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
