// src/components/SpeechToText.js
import axios from 'axios';

const convertSpeechToText = async (audioFile, apiKey) => {
  const url = 'https://api.deepgram.com/v1/listen';

  try {
    const response = await axios.post(url, audioFile, {
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'audio/wav',
      },
    });

    return response.data.results.channels[0].alternatives[0].transcript;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return '';
  }
};

export default convertSpeechToText;
