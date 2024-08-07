import axios from 'axios';
import convertSpeechToText from '../components/SpeechToText';

// Mock axios
jest.mock('axios');

describe('convertSpeechToText', () => {
  const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
  const mockAudioFile = new Blob(['mock audio data'], { type: 'audio/wav' });

  beforeAll(() => {
    // Suppress console.error in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it('should return transcript from API response', async () => {
    // Arrange
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

    // Act
    const transcript = await convertSpeechToText(mockAudioFile, apiKey);

    // Assert
    expect(transcript).toBe('This is a test transcript');
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

  it('should handle errors gracefully', async () => {
    // Arrange
    axios.post.mockRejectedValue(new Error('Network error'));

    // Act
    const transcript = await convertSpeechToText(mockAudioFile, apiKey);

    // Assert
    expect(transcript).toBe('');
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
