import React, { useState } from 'react';
import axios from 'axios';
import MicRecorder from 'mic-recorder-to-mp3';

const recorder = new MicRecorder({ bitRate: 128 });

const DeepgramTTS = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const [fileText, setFileText] = useState('');

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
    const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
    const TTSurl = 'https://api.deepgram.com/v1/speak?model=aura-asteria-en';

    try {
      const response = await axios.post(TTSurl, { text: fileText || text }, {
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
  };

  const startRecording = () => {
    recorder.start().then(() => {
      setIsRecording(true);
    }).catch((e) => console.error(e));
  };

  const stopRecording = () => {
    recorder.stop().getMp3().then(([buffer, blob]) => {
      const blobURL = URL.createObjectURL(blob);
      setBlobURL(blobURL);
      setIsRecording(false);
  
      const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
      const url = 'https://api.deepgram.com/v1/listen';
  
      axios.post(url, new File(buffer, 'recording.wav', { type: 'audio/wav' }), {
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'audio/wav',
        },
      }).then(async (response) => {
        const transcriptText = response.data.results.channels[0].alternatives[0].transcript;
        setTranscript(transcriptText);
  
        // Send the transcript to FastAPI
        const chatGptResponse = await axios.post('http://localhost:8000/chatgpt', { question: transcriptText });
        const answer = chatGptResponse.data.answer;
        
        console.log("Back from chatGPT")

        console.log(answer.content)

        // Convert the answer to speech
        const TTSurl = 'https://api.deepgram.com/v1/speak?model=aura-asteria-en';
        const ttsResponse = await axios.post(TTSurl, { text: answer.content }, {
          headers: {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        });
  
        if (ttsResponse.status === 200) {
          const audioBlob = new Blob([ttsResponse.data], { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
        }
      }).catch((error) => {
        console.error('Error transcribing audio:', error);
      });
    }).catch((e) => console.log(e));
  };
  

  return (
    <div>
      <h2>Text to Speech</h2>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <textarea
        value={text}
        onChange={handleTextChange}
        rows="4"
        cols="50"
        placeholder="Enter text here..."
      />
      <button onClick={handleTTS}>Convert to Speech</button>
      {audioUrl && (
        <div>
          <h3>Generated Audio:</h3>
          <audio controls src={audioUrl} />
        </div>
      )}

      <h2>Speech to Text</h2>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      {blobURL && (
        <div>
          <h3>Recorded Audio:</h3>
          <audio controls src={blobURL} />
        </div>
      )}
      {transcript && (
        <div>
          <h3>Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default DeepgramTTS;
