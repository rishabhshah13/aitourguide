// src/components/LLMIntegration.js
import axios from 'axios';

const fetchLLMResponse = async (question) => {
  try {
    const response = await axios.post('http://localhost:8000/mistral', {
      question,
    });
    return response.data.answer.content;
  } catch (error) {
    console.error('Error fetching ChatGPT response:', error);
    return '';
  }
};

export default fetchLLMResponse;
