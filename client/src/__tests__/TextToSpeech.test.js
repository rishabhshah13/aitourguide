// Import the axios library for HTTP requests and the TextToSpeech function to be tested
import axios from 'axios';
import TextToSpeech from '../components/TextToSpeech';

// Mock axios to intercept and control HTTP requests during testing
jest.mock('axios');

describe('TextToSpeech', () => {
  // Define constants used in the tests
  const apiKey = 'mock-api-key';
  const text = 'Hello, world!';
  const mockBlob = new Blob(['mock audio data'], { type: 'audio/mp3' });

  // Before running any tests, suppress console.error to prevent test output from being cluttered
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // After all tests have been executed, restore console.error to its original implementation
  afterAll(() => {
    console.error.mockRestore();
  });

  /**
   * Test case for ensuring that a successful API request returns a Blob.
   *
   * Arrange:
   * - Mock axios.post to resolve with a successful response containing a Blob.
   *
   * Act:
   * - Call the TextToSpeech function with sample text and an API key.
   *
   * Assert:
   * - Verify that the result is a Blob with the correct type.
   * - Verify that axios.post was called with the correct URL, request body, and headers.
   */
  it('should return a Blob when API request is successful', async () => {
    // Arrange: Set up axios.post to return a successful response
    axios.post.mockResolvedValue({
      status: 200,
      data: mockBlob,
    });

    // Act: Execute the TextToSpeech function
    const result = await TextToSpeech(text, apiKey);

    // Assert: Check that the result is a Blob and has the correct type
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('audio/mp3');
    // Verify axios.post was called with correct parameters
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.deepgram.com/v1/speak?model=aura-asteria-en',
      { text },
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      }
    );
  });

  /**
   * Test case for ensuring that HTTP errors are handled gracefully.
   *
   * Arrange:
   * - Mock axios.post to resolve with an HTTP error status.
   *
   * Act:
   * - Call the TextToSpeech function with sample text and an API key.
   *
   * Assert:
   * - Verify that the result is null when an HTTP error occurs.
   * - Verify that axios.post was called with the correct URL, request body, and headers.
   */
  it('should handle HTTP errors gracefully', async () => {
    // Arrange: Set up axios.post to return an HTTP error response
    axios.post.mockResolvedValue({
      status: 400,
      data: 'Bad Request',
    });

    // Act: Execute the TextToSpeech function
    const result = await TextToSpeech(text, apiKey);

    // Assert: Check that the result is null
    expect(result).toBeNull();
    // Verify axios.post was called with correct parameters
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.deepgram.com/v1/speak?model=aura-asteria-en',
      { text },
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      }
    );
  });

  /**
   * Test case for ensuring that network errors are handled gracefully.
   *
   * Arrange:
   * - Mock axios.post to throw a network error.
   *
   * Act:
   * - Call the TextToSpeech function with sample text and an API key.
   *
   * Assert:
   * - Verify that the result is null when a network error occurs.
   * - Verify that axios.post was called with the correct URL, request body, and headers.
   */
  it('should handle network errors gracefully', async () => {
    // Arrange: Set up axios.post to throw a network error
    axios.post.mockRejectedValue(new Error('Network error'));

    // Act: Execute the TextToSpeech function
    const result = await TextToSpeech(text, apiKey);

    // Assert: Check that the result is null
    expect(result).toBeNull();
    // Verify axios.post was called with correct parameters
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.deepgram.com/v1/speak?model=aura-asteria-en',
      { text },
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      }
    );
  });
});
