// Import the axios library for making HTTP requests
import axios from 'axios';

/**
 * Fetches a response from a language model (LLM) by sending a question and model identifier to a local server.
 *
 * @param {string} question - The question to be sent to the LLM.
 * @param {string} model - The identifier for the specific LLM model to use.
 * @returns {Promise<string>} - A promise that resolves to the content of the LLM's response if successful, or an empty string if an error occurs.
 */
const fetchLLMResponse = async (question, model) => {
  try {
    // Log the question and model for debugging purposes
    console.log(question, model);

    // Send a POST request to the local server to get a response from the LLM
    const response = await axios.post('http://localhost:8000/get_response', {
      question,
      model,
    });

    // Return the content of the LLM's response
    return response.data.answer.content;
  } catch (error) {
    // Log any errors that occur during the request
    console.error('Error fetching ChatGPT response:', error);
    return '';
  }
};

// Export the fetchLLMResponse function as the default export
export default fetchLLMResponse;
