// Import axios for making HTTP requests
import axios from 'axios';

/**
 * Converts speech to text using the Deepgram API.
 *
 * @param {Blob} audioFile - The audio file to be transcribed. Expected to be in 'audio/wav' format.
 * @param {string} apiKey - The API key for authenticating with the Deepgram API.
 *
 * @returns {Promise<string>} A promise that resolves to the transcribed text from the audio file.
 *
 * @throws {Error} Throws an error if there is an issue with the API request or response.
 *
 * @example
 * // Example usage:
 * const audioFile = new Blob(['mock audio data'], { type: 'audio/wav' });
 * const apiKey = 'your-api-key';
 * convertSpeechToText(audioFile, apiKey)
 *   .then(transcript => console.log('Transcribed text:', transcript))
 *   .catch(error => console.error('Error:', error));
 */
const convertSpeechToText = async (audioFile, apiKey) => {
  // Deepgram API URL for speech-to-text conversion
  const url = 'https://api.deepgram.com/v1/listen';

  try {
    // Make POST request to the Deepgram API
    const response = await axios.post(url, audioFile, {
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'audio/wav',
      },
    });

    // Return the transcribed text from the response
    return response.data.results.channels[0].alternatives[0].transcript;
  } catch (error) {
    // Log the error and return an empty string if there is an issue
    console.error('Error transcribing audio:', error);
    return '';
  }
};

// Export the convertSpeechToText function as the default export
export default convertSpeechToText;
