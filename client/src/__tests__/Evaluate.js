const fs = require('fs');
const axios = require('axios');
const now = require('performance-now');
const dotenv = require('dotenv');
const FormData = require('form-data');

dotenv.config({ path: '../.env' });

const DEEPGRAM_API_KEY = process.env.REACT_APP_DEEPGRAM_API_KEY;
const TTS_URL = 'https://api.deepgram.com/v1/speak?model=aura-asteria-en';
const STT_URL = 'https://api.deepgram.com/v1/listen';

console.log(DEEPGRAM_API_KEY);

const textToSpeech = async (text, apiKey) => {
  const start = now();
  try {
    const response = await axios.post(
      TTS_URL,
      { text },
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      }
    );

    const end = now();
    console.log(`TTS Response Time: ${(end - start).toFixed(2)} ms`);

    if (response.status === 200) {
      return new Blob([response.data], { type: 'audio/mp3' });
    } else {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    const end = now();
    console.error(`Error generating audio: ${error.message}`);
    console.log(`TTS Response Time: ${(end - start).toFixed(2)} ms`);
    return null;
  }
};

const convertSpeechToText = async (audioFilePath, apiKey) => {
  const start = now();
  try {
    const audioFile = fs.createReadStream(audioFilePath);
    const form = new FormData();
    form.append('file', audioFile);

    const response = await axios.post(STT_URL, audioFile, {
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    const end = now();
    console.log(`STT Response Time: ${(end - start).toFixed(2)} ms`);

    return response.data.results.channels[0].alternatives[0].transcript;
  } catch (error) {
    const end = now();
    console.error(`Error transcribing audio: ${error.message}`);
    console.log(`STT Response Time: ${(end - start).toFixed(2)} ms`);
    return '';
  }
};

// Example usage:
const runTests = async () => {
  const text = 'Hello, this is a test.';
  const audioFile = '../assets/sample.mp3'; // Load an audio file for testing

  console.log('Testing Text to Speech:');
  await textToSpeech(text, DEEPGRAM_API_KEY);

  console.log('Testing Speech to Text:');
  await convertSpeechToText(audioFile, DEEPGRAM_API_KEY);
};

runTests();
