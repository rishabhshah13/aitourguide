// src/components/DeepgramTTS.js
import React, { useState, useRef, useEffect } from 'react';
import TextInput from './TextInput';
import TranscriptDisplay from './TranscriptDisplay';
import { startRecording, stopRecording } from './AudioRecorder';
import convertSpeechToText from './SpeechToText';
import fetchChatGptResponse from './ChatGPTIntegration';
import TextToSpeech from './TextToSpeech';
import Popup from './Popup';


const DeepgramTTS = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [fileTextSegments, setFileTextSegments] = useState([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [askQuestionInProgress, setAskQuestionInProgress] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // New state for popup
  const audioRef = useRef(null);
  const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
  const [originalTTSUrls, setOriginalTTSUrls] = useState([]);
  const [originalTTSIndex, setOriginalTTSIndex] = useState(0); // Track TTS playback

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
      setOriginalTTSUrls(prevUrls => [...prevUrls, audioUrl]); // Save the URL
      setOriginalTTSIndex(originalTTSUrls.length); // Update index
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
            setShowPopup(true); // Show popup after the answer TTS is done
            if (currentSegmentIndex === -1) { // If no segment is currently playing, start from the first segment
              setCurrentSegmentIndex(0);
            }
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
    // Resume original TTS playback if it was interrupted
    if (originalTTSIndex < originalTTSUrls.length) {
      const nextTTSUrl = originalTTSUrls[originalTTSIndex];
      setAudioUrl(nextTTSUrl);
      if (audioRef.current) {
        audioRef.current.src = nextTTSUrl;
        audioRef.current.play();
        setOriginalTTSIndex(originalTTSIndex + 1);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div>
      <h2>Text to Speech</h2>
      <TextInput setFileTextSegments={setFileTextSegments} />
      <button onClick={() => setCurrentSegmentIndex(0)} disabled={fileTextSegments.length === 0}>
        Convert to Speech
      </button>

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
      {showPopup && (
        <Popup message="The answer has been generated and spoken. Please review it." onClose={handlePopupClose} />
      )}
    </div>
  );
};

export default DeepgramTTS;
