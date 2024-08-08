// Import necessary modules
const fs = require('fs');
const axios = require('axios');
const now = require('performance-now');
const dotenv = require('dotenv');
const FormData = require('form-data');

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

// Define constants for API key and endpoints
const DEEPGRAM_API_KEY = process.env.REACT_APP_DEEPGRAM_API_KEY;
const TTS_URL = 'https://api.deepgram.com/v1/speak?model=aura-asteria-en';
const STT_URL = 'https://api.deepgram.com/v1/listen';

// Log the API key for debugging purposes
console.log(DEEPGRAM_API_KEY);

/**
 * Converts text to speech using Deepgram's Text-to-Speech (TTS) API.
 *
 * @param {string} text - The text to be converted to speech.
 * @param {string} apiKey - The API key for authorization.
 * @returns {Promise<Blob|null>} - A promise that resolves to a Blob containing the audio data if successful, or null if an error occurs.
 */
const textToSpeech = async (text, apiKey) => {
  const start = now(); // Record the start time for performance measurement
  try {
    // Make a POST request to Deepgram's TTS API
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

    const end = now(); // Record the end time
    console.log(`TTS Response Time: ${(end - start).toFixed(2)} ms`);

    if (response.status === 200) {
      // Return the audio data as a Blob if the response is successful
      return new Blob([response.data], { type: 'audio/mp3' });
    } else {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    const end = now(); // Record the end time on error
    console.error(`Error generating audio: ${error.message}`);
    console.log(`TTS Response Time: ${(end - start).toFixed(2)} ms`);
    return null;
  }
};

/**
 * Converts speech to text using Deepgram's Speech-to-Text (STT) API.
 *
 * @param {string} audioFilePath - The file path to the audio file to be transcribed.
 * @param {string} apiKey - The API key for authorization.
 * @returns {Promise<string>} - A promise that resolves to the transcript of the audio if successful, or an empty string if an error occurs.
 */
const convertSpeechToText = async (audioFilePath, apiKey) => {
  const start = now(); // Record the start time for performance measurement
  try {
    const audioFile = fs.createReadStream(audioFilePath); // Create a readable stream from the audio file
    const form = new FormData();
    form.append('file', audioFile); // Append the audio file to the form data

    // Make a POST request to Deepgram's STT API
    const response = await axios.post(STT_URL, form, {
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'multipart/form-data',
        ...form.getHeaders(), // Include form headers
      },
    });

    const end = now(); // Record the end time
    console.log(`STT Response Time: ${(end - start).toFixed(2)} ms`);

    // Extract and return the transcript from the response data
    return response.data.results.channels[0].alternatives[0].transcript;
  } catch (error) {
    const end = now(); // Record the end time on error
    console.error(`Error transcribing audio: ${error.message}`);
    console.log(`STT Response Time: ${(end - start).toFixed(2)} ms`);
    return '';
  }
};

// Example usage of the textToSpeech and convertSpeechToText functions
const runTests = async () => {
  const text = 'Hello, this is a test.'; // Text to convert to speech
  const audioFile = '../assets/sample.mp3'; // Path to an audio file for testing

  console.log('Testing Text to Speech:');
  await textToSpeech(text, DEEPGRAM_API_KEY); // Convert text to speech

  console.log('Testing Speech to Text:');
  await convertSpeechToText(audioFile, DEEPGRAM_API_KEY); // Convert speech to text
};

// Run the example tests
runTests();
