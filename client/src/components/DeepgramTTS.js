// src/components/DeepgramTTS.js
import React, { useState, useRef, useEffect } from 'react';
import TextInput from './TextInput';
import TranscriptDisplay from './TranscriptDisplay';
import { startRecording, stopRecording } from './AudioRecorder';
import convertSpeechToText from './SpeechToText';
import fetchChatGptResponse from './ChatGPTIntegration';
import TextToSpeech from './TextToSpeech';
import Popup from './Popup';
import '../styles/colors.css';
import '../styles/layout.css';
import '../styles/buttons.css';
import '../styles/text.css';

const DeepgramTTS = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [fileTextSegments, setFileTextSegments] = useState([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [askQuestionInProgress, setAskQuestionInProgress] = useState(false);
  const [showPopup, setShowPopup] = useState(false); 
  const audioRef = useRef(null);
  const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
  const [originalTTSUrls, setOriginalTTSUrls] = useState([]);
  const [originalTTSIndex, setOriginalTTSIndex] = useState(0);

  useEffect(() => {
    if (currentSegmentIndex >= 0 && currentSegmentIndex < fileTextSegments.length && !isPlaying && !askQuestionInProgress) {
      handleTTS(fileTextSegments[currentSegmentIndex]);
    }
  }, [currentSegmentIndex, isPlaying, askQuestionInProgress]);

  const handleTTS = async (segment) => {
    const audioBlob = await TextToSpeech(segment, apiKey);
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setOriginalTTSUrls(prevUrls => [...prevUrls, audioUrl]); 
      setOriginalTTSIndex(originalTTSUrls.length);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsPlaying(false);
          if (currentSegmentIndex < fileTextSegments.length - 1) {
            setCurrentSegmentIndex(currentSegmentIndex + 1);
          } else {
            setCurrentSegmentIndex(-1);
          }
        };
        setIsPlaying(true);
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
        const answerAudioUrl = URL.createObjectURL(answerAudioBlob);
        setAudioUrl(answerAudioUrl);
        if (audioRef.current) {
          audioRef.current.src = answerAudioUrl;
          audioRef.current.onended = () => {
            setAskQuestionInProgress(false);
            setShowPopup(true); 
          };
          audioRef.current.play();
          setAskQuestionInProgress(true);
        }
      }
    } else {
      const waitUntilDone = new Promise((resolve) => {
        if (audioRef.current) {
          audioRef.current.onended = () => {
            resolve();
          };
        } else {
          resolve();
        }
      });

      await waitUntilDone;

      const success = await startRecording();
      if (success) {
        setIsRecording(true);
      }
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setCurrentSegmentIndex(currentSegmentIndex + 1);
    setIsPlaying(false);
  };

  return (
    <div className="container">
      <div className="section">
        <h2>Text to Speech</h2>
        <TextInput setFileTextSegments={setFileTextSegments} />
        <div className="button-container">
          <button onClick={() => setCurrentSegmentIndex(0)} disabled={fileTextSegments.length === 0}>
            <i className="fas fa-play"></i> Convert to Speech
          </button>
        </div>
      </div>

      <div className="section">
        <h2>Ask Question</h2>
        <div className="button-container">
          <button
            onClick={toggleRecording}
            className={isRecording ? 'recording' : ''}
          >
            <i className={isRecording ? 'fas fa-microphone-slash' : 'fas fa-microphone'}></i> {isRecording ? 'Recording...' : 'Ask Question'}
          </button>
        </div>
      </div>

      <audio ref={audioRef} controls style={{ display: 'none' }} />
      <TranscriptDisplay transcript={transcript} currentSegmentIndex={currentSegmentIndex} fileTextSegments={fileTextSegments} />
      {showPopup && (
        <Popup message="The answer has been generated and spoken. Please review it." onClose={handlePopupClose} />
      )}
    </div>
  );
};

export default DeepgramTTS;
