// src/components/RealTimeTTS.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RealTimeTTS = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const fetchTTS = async () => {
      if (text.length > 0) {
        const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
        const url = 'https://api.deepgram.com/v1/speak?model=aura-asteria-en'; // Endpoint for TTS

        try {
          const response = await axios.post(url, { text }, {
            headers: {
              'Authorization': `Token ${apiKey}`,
              'Content-Type': 'application/json',
            },
            responseType: 'blob',
          });

          if (response.status === 200) {
            const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
          } else {
            console.error(`HTTP error! Status: ${response.status}`);
          }
        } catch (error) {
          console.error('Error generating audio:', error.message);
        }
      }
    };

    fetchTTS();
  }, [text]);

  return (
    <div>
      <h2>Real-Time Text to Speech</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        cols="50"
        placeholder="Enter text here..."
      />
      {audioUrl && (
        <div>
          <h3>Generated Audio:</h3>
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
};

export default RealTimeTTS;
