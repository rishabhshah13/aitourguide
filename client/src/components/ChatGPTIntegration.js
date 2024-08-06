// src/components/ChatGPTIntegration.js
import axios from 'axios';

const fetchChatGptResponse = async (question) => {
  try {
    const response = await axios.post('http://localhost:8000/chatgpt', {
      question,
    });
    return response.data.answer.content;
  } catch (error) {
    console.error('Error fetching ChatGPT response:', error);
    return '';
  }
};

export default fetchChatGptResponse;
