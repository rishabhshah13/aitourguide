// src/components/DeepgramTTS.js
import React, { useState, useRef, useEffect } from 'react';
import TextInput from './TextInput';
import TranscriptDisplay from './TranscriptDisplay';
import { startRecording, stopRecording } from './AudioRecorder';
import convertSpeechToText from './SpeechToText';
import fetchChatGptResponse from './ChatGPTIntegration';
import TextToSpeech from './TextToSpeech';

const DeepgramTTS = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [fileTextSegments, setFileTextSegments] = useState([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);
  const audioRef = useRef(null);
  const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;

  useEffect(() => {
    if (currentSegmentIndex >= 0 && currentSegmentIndex < fileTextSegments.length) {
      handleTTS(fileTextSegments[currentSegmentIndex]);
    }
  }, [currentSegmentIndex]);

  const handleTTS = async (segment) => {
    const audioBlob = await TextToSpeech(segment, apiKey);
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          if (currentSegmentIndex < fileTextSegments.length - 1) {
            setCurrentSegmentIndex(currentSegmentIndex + 1);
          } else {
            setCurrentSegmentIndex(-1);
          }
        };
        await audioRef.current.play();
      }
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      const { buffer, blob } = await stopRecording();
      setIsRecording(false);

      const transcriptText = await convertSpeechToText(new File(buffer, 'recording.wav', { type: 'audio/wav' }), apiKey);
      setTranscript(transcriptText);

      const answer = await fetchChatGptResponse(transcriptText);

      const answerAudioBlob = await TextToSpeech(answer, apiKey);
      if (answerAudioBlob) {
        const audioUrl = URL.createObjectURL(answerAudioBlob);
        setAudioUrl(audioUrl);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      }
    } else {
      const success = await startRecording();
      setIsRecording(success);
    }
  };

  return (
    <div>
      <h2>Text to Speech</h2>
      <TextInput setFileTextSegments={setFileTextSegments} />
      <button onClick={() => setCurrentSegmentIndex(0)} disabled={fileTextSegments.length === 0}>Convert to Speech</button>

      <h2>Ask Question</h2>
      <button
        onClick={toggleRecording}
        style={{
          backgroundColor: isRecording ? 'red' : 'gray',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {isRecording ? 'Recording...' : 'Ask Question'}
      </button>
      <audio ref={audioRef} controls style={{ display: 'none' }} />
      <TranscriptDisplay transcript={transcript} currentSegmentIndex={currentSegmentIndex} fileTextSegments={fileTextSegments} />
    </div>
  );
};

export default DeepgramTTS;
