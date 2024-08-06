import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [fileTextSegments, setFileTextSegments] = useState([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [askQuestionInProgress, setAskQuestionInProgress] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showAskQuestionButton, setShowAskQuestionButton] = useState(false);
  const [tourPaused, setTourPaused] = useState(false);
  const audioRef = useRef(null);
  const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;

  const handleTTS = useCallback(
    async (segment) => {
      const audioBlob = await TextToSpeech(segment, apiKey);
      if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
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
    },
    [apiKey, currentSegmentIndex, fileTextSegments.length]
  );

  useEffect(() => {
    if (
      currentSegmentIndex >= 0 &&
      currentSegmentIndex < fileTextSegments.length &&
      !isPlaying &&
      !askQuestionInProgress &&
      !tourPaused
    ) {
      handleTTS(fileTextSegments[currentSegmentIndex]);
    }
  }, [
    currentSegmentIndex,
    isPlaying,
    askQuestionInProgress,
    tourPaused,
    fileTextSegments,
    handleTTS,
  ]);

  const toggleRecording = async () => {
    if (isRecording) {
      const { buffer, blob } = await stopRecording();
      console.log(blob);
      setIsRecording(false);

      const transcriptText = await convertSpeechToText(
        new File(buffer, 'recording.wav', { type: 'audio/wav' }),
        apiKey
      );
      setTranscript(transcriptText);

      const answer = await fetchChatGptResponse(transcriptText);

      const answerAudioBlob = await TextToSpeech(answer, apiKey);
      if (answerAudioBlob) {
        const answerAudioUrl = URL.createObjectURL(answerAudioBlob);
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

  const handleStartTour = () => {
    setCurrentSegmentIndex(0);
    setShowAskQuestionButton(true);
    setTourPaused(false);
  };

  const handlePauseTour = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setTourPaused(true);
    }
  };

  return (
    <div className="container">
      <div className="section">
        <TextInput setFileTextSegments={setFileTextSegments} />
        <div className="button-container">
          {!showAskQuestionButton && (
            <button
              onClick={handleStartTour}
              disabled={fileTextSegments.length === 0}
            >
              <i className="fas fa-play"></i> Start Tour
            </button>
          )}
          {showAskQuestionButton && (
            <button onClick={handlePauseTour}>
              <i className="fas fa-pause"></i>{' '}
              {tourPaused ? 'Resume Tour' : 'Pause Tour'}
            </button>
          )}
        </div>
      </div>

      <audio ref={audioRef} controls style={{ display: 'none' }} />
      <TranscriptDisplay
        transcript={transcript}
        currentSegmentIndex={currentSegmentIndex}
        fileTextSegments={fileTextSegments}
      />

      {showAskQuestionButton && (
        <div className="ask-question-container">
          <button
            onClick={toggleRecording}
            className={isRecording ? 'recording' : ''}
          >
            <i
              className={
                isRecording ? 'fas fa-microphone-slash' : 'fas fa-microphone'
              }
            ></i>
          </button>
        </div>
      )}

      {showPopup && (
        <Popup
          message="The answer has been generated and spoken. Please review it."
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
};

export default DeepgramTTS;
