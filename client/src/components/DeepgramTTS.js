// src/components/DeepgramTTS.js
import React, { useState } from 'react';
import TextInput from './TextInput';
import TextToSpeech from './TextToSpeech';
import { startRecording, stopRecording } from './AudioRecorder';
import convertSpeechToText from './SpeechToText';
import fetchChatGptResponse from './ChatGPTIntegration';
import AudioPlayer from './AudioPlayer';
import TranscriptDisplay from './TranscriptDisplay';

const DeepgramTTS = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const [fileText, setFileText] = useState('');
  const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileText(reader.result);
      };
      reader.readAsText(file);
    }
  };

  const handleTTS = async () => {
    const audioBlob = await TextToSpeech(fileText || text, apiKey);
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    }
  };

  const startRecordingHandler = async () => {
    const success = await startRecording();
    setIsRecording(success);
  };

  const stopRecordingHandler = async () => {
    const { buffer, blob } = await stopRecording();
    const blobURL = URL.createObjectURL(blob);
    setBlobURL(blobURL);
    setIsRecording(false);

    const transcriptText = await convertSpeechToText(new File(buffer, 'recording.wav', { type: 'audio/wav' }), apiKey);
    setTranscript(transcriptText);

    const answer = await fetchChatGptResponse(transcriptText);

    const answerAudioBlob = await TextToSpeech(answer, apiKey);
    if (answerAudioBlob) {
      const audioUrl = URL.createObjectURL(answerAudioBlob);
      setAudioUrl(audioUrl);
    }
  };

  return (
    <div>
      <h2>Text to Speech</h2>
      <TextInput text={text} onTextChange={handleTextChange} onFileChange={handleFileChange} />
      <button onClick={handleTTS}>Convert to Speech</button>
      <AudioPlayer src={audioUrl} />

      <h2>Speech to Text</h2>
      <button onClick={startRecordingHandler} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecordingHandler} disabled={!isRecording}>Stop Recording</button>
      <AudioPlayer src={blobURL} />
      <TranscriptDisplay transcript={transcript} />
    </div>
  );
};

export default DeepgramTTS;
