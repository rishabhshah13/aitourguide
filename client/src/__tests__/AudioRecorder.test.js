// src/__tests/AudioRecorder.test.js
import { startRecording, stopRecording } from '../components/AudioRecorder';
import MicRecorder from 'mic-recorder-to-mp3';

// Mocking MicRecorder
jest.mock('mic-recorder-to-mp3');

describe('AudioRecorder', () => {
  test('startRecording starts recording', async () => {
    // Arrange
    MicRecorder.prototype.start.mockResolvedValue(true);

    // Act
    const result = await startRecording();

    // Assert
    expect(result).toBe(true);
  });

  test('stopRecording stops recording', async () => {
    // Arrange
    MicRecorder.prototype.stop.mockResolvedValue({
      blob: new Blob(),
      buffer: new ArrayBuffer(8),
    });

    // Act
    const result = await stopRecording();

    // Assert
    expect(result).toHaveProperty('blob');
  });
});
