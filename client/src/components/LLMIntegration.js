// src/components/LLMIntegration.js
import axios from 'axios';

const fetchLLMResponse = async (question, model) => {
  try {
    console.log(question, model);

    const response = await axios.post(`http://localhost:8000/get_response`, {
      question,
      model,
    });
    return response.data.answer.content;
  } catch (error) {
    console.error('Error fetching ChatGPT response:', error);
    return '';
  }
};

export default fetchLLMResponse;
