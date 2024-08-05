// src/components/w.js
import axios from 'axios';

const convertTextToSpeech = async (text, apiKey) => {
  const url = 'https://api.deepgram.com/v1/speak?model=aura-asteria-en';

  try {
    const response = await axios.post(url, { text }, {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    });

    if (response.status === 200) {
      return new Blob([response.data], { type: 'audio/mp3' });
    }
  } catch (error) {
    console.error('Error generating audio:', error.message);
    return null;
  }
};

export default convertTextToSpeech;
