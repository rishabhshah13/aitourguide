// https://deepgram.com/learn/how-to-add-speech-recognition-to-your-react-project
// https://deepgram.com/learn/protecting-api-key
// # use a proxy server because websocket cannot directly connect
// https://developers.deepgram.com/docs/getting-started-with-live-streaming-audio
// https://github.com/deepgram-devs/js-live-example/tree/main uses node js as server


// src/components/RealTimeSTT.js
import React, { useState, useEffect, useRef } from 'react';

const RealTimeSTT = () => {
  const [transcript, setTranscript] = useState('');
  const [stream, setStream] = useState(null);
  const wsRef = useRef(null); // Use ref to keep track of the WebSocket instance

  useEffect(() => {
    const startStreaming = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(audioStream);

        // Initialize WebSocket connection to Deepgram's STT API
        const wsUrl = `ws://localhost:8000/ws`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connection opened');
        };

        ws.onmessage = (message) => {
          const response = JSON.parse(message.data);
          if (response.channel && response.channel.alternatives[0]) {
            setTranscript(response.channel.alternatives[0].transcript);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed');
        };

        // Stream audio to WebSocket
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(audioStream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (event) => {
          if (wsRef.current.readyState === WebSocket.OPEN) {
            const inputBuffer = event.inputBuffer.getChannelData(0);
            wsRef.current.send(new Float32Array(inputBuffer));
          }
        };

      } catch (error) {
        console.error('Error setting up audio stream:', error);
      }

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    };

    startStreaming();

    // Cleanup on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div>
      <h2>Real-Time Speech to Text</h2>
      <p>{transcript}</p>
    </div>
  );
};

export default RealTimeSTT;
