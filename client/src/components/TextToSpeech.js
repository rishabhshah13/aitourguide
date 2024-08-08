import axios from 'axios';

/**
 * Converts text to speech using the Deepgram Text-to-Speech API.
 *
 * @param {string} text - The text to convert to speech.
 * @param {string} apiKey - The API key for authentication with the Deepgram API.
 *
 * @returns {Promise<Blob|null>} A promise that resolves to a Blob containing the audio data if successful, or null if an error occurs.
 *
 * @example
 * // Example usage:
 * const audioBlob = await TextToSpeech('Hello world', 'your-deepgram-api-key');
 * if (audioBlob) {
 *   // Do something with the audio blob, such as playing it or saving it
 * }
 */
const TextToSpeech = async (text, apiKey) => {
  const url = 'https://api.deepgram.com/v1/speak?model=aura-asteria-en';

  try {
    // Make POST request to Deepgram API
    const response = await axios.post(
      url,
      { text },
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      }
    );

    // Check if the response status is OK (200)
    if (response.status === 200) {
      return new Blob([response.data], { type: 'audio/mp3' });
    } else {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    // Handle any errors during the request
    console.error('Error generating audio:', error.message);
    return null;
  }
};

export default TextToSpeech;
