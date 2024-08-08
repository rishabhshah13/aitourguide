// Import the axios library for HTTP requests and the convertSpeechToText function to be tested
import axios from 'axios';
import convertSpeechToText from '../components/SpeechToText';

// Mock axios to intercept and control HTTP requests during testing
jest.mock('axios');

describe('convertSpeechToText', () => {
  // Define constants used in the tests
  const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
  const mockAudioFile = new Blob(['mock audio data'], { type: 'audio/wav' });

  // Before running any tests, suppress console.error to prevent test output from being cluttered
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // After all tests have been executed, restore console.error to its original implementation
  afterAll(() => {
    console.error.mockRestore();
  });

  /**
   * Test case for ensuring that a successful API request returns the correct transcript.
   *
   * Arrange:
   * - Mock axios.post to resolve with a response containing a transcript.
   *
   * Act:
   * - Call the convertSpeechToText function with a mock audio file and API key.
   *
   * Assert:
   * - Verify that the transcript matches the expected text.
   * - Verify that axios.post was called with the correct URL, request body, and headers.
   */
  it('should return transcript from API response', async () => {
    // Arrange: Set up axios.post to return a mock response with a transcript
    const mockResponse = {
      data: {
        results: {
          channels: [
            {
              alternatives: [{ transcript: 'This is a test transcript' }],
            },
          ],
        },
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    // Act: Execute the convertSpeechToText function
    const transcript = await convertSpeechToText(mockAudioFile, apiKey);

    // Assert: Check that the transcript is correct
    expect(transcript).toBe('This is a test transcript');
    // Verify axios.post was called with correct parameters
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.deepgram.com/v1/listen',
      mockAudioFile,
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'audio/wav',
        },
      }
    );
  });

  /**
   * Test case for ensuring that errors are handled gracefully.
   *
   * Arrange:
   * - Mock axios.post to reject with a network error.
   *
   * Act:
   * - Call the convertSpeechToText function with a mock audio file and API key.
   *
   * Assert:
   * - Verify that the transcript is an empty string when an error occurs.
   * - Verify that axios.post was called with the correct URL, request body, and headers.
   */
  it('should handle errors gracefully', async () => {
    // Arrange: Set up axios.post to throw a network error
    axios.post.mockRejectedValue(new Error('Network error'));

    // Act: Execute the convertSpeechToText function
    const transcript = await convertSpeechToText(mockAudioFile, apiKey);

    // Assert: Check that the transcript is an empty string
    expect(transcript).toBe('');
    // Verify axios.post was called with correct parameters
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.deepgram.com/v1/listen',
      mockAudioFile,
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'audio/wav',
        },
      }
    );
  });
});
