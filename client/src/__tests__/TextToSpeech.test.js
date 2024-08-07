import axios from 'axios';
import TextToSpeech from '../components/TextToSpeech';

// Mock axios
jest.mock('axios');

describe('TextToSpeech', () => {
  const apiKey = 'mock-api-key';
  const text = 'Hello, world!';
  const mockBlob = new Blob(['mock audio data'], { type: 'audio/mp3' });

  beforeAll(() => {
    // Suppress console.error in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it('should return a Blob when API request is successful', async () => {
    // Arrange
    axios.post.mockResolvedValue({
      status: 200,
      data: mockBlob,
    });

    // Act
    const result = await TextToSpeech(text, apiKey);

    // Assert
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('audio/mp3');
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

  it('should handle HTTP errors gracefully', async () => {
    // Arrange
    axios.post.mockResolvedValue({
      status: 400,
      data: 'Bad Request',
    });

    // Act
    const result = await TextToSpeech(text, apiKey);

    // Assert
    expect(result).toBeNull();
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

  it('should handle network errors gracefully', async () => {
    // Arrange
    axios.post.mockRejectedValue(new Error('Network error'));

    // Act
    const result = await TextToSpeech(text, apiKey);

    // Assert
    expect(result).toBeNull();
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
