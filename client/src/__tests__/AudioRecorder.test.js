// Import functions and the MicRecorder library for testing
import { startRecording, stopRecording } from '../components/AudioRecorder';
import MicRecorder from 'mic-recorder-to-mp3';

// Mocking MicRecorder to control its behavior during tests
jest.mock('mic-recorder-to-mp3');

/**
 * Tests for the AudioRecorder component.
 */
describe('AudioRecorder', () => {
  /**
   * Tests that the startRecording function successfully starts recording.
   *
   * Arrange:
   * - Mock the MicRecorder.start method to resolve successfully.
   *
   * Act:
   * - Call the startRecording function.
   *
   * Assert:
   * - Verify that the result is true, indicating that recording has started.
   */
  test('startRecording starts recording', async () => {
    // Arrange: Mock MicRecorder to return a successful result
    MicRecorder.prototype.start.mockResolvedValue(true);

    // Act: Execute the function to start recording
    const result = await startRecording();

    // Assert: Check that the result is true
    expect(result).toBe(true);
  });

  /**
   * Tests that the stopRecording function successfully stops recording and returns a result.
   *
   * Arrange:
   * - Mock the MicRecorder.stop method to return a result with a Blob and an ArrayBuffer.
   *
   * Act:
   * - Call the stopRecording function.
   *
   * Assert:
   * - Verify that the result contains a Blob property.
   */
  test('stopRecording stops recording', async () => {
    // Arrange: Mock MicRecorder to return a Blob and buffer
    MicRecorder.prototype.stop.mockResolvedValue({
      blob: new Blob(),
      buffer: new ArrayBuffer(8),
    });

    // Act: Execute the function to stop recording
    const result = await stopRecording();

    // Assert: Check that the result has a Blob property
    expect(result).toHaveProperty('blob');
  });
});
