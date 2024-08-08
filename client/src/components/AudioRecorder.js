// Import the MicRecorder library for recording audio
import MicRecorder from 'mic-recorder-to-mp3';

// Variable to hold the instance of MicRecorder
let recorder;

/**
 * Starts recording audio using MicRecorder.
 *
 * @returns {Promise<boolean>} - A promise that resolves to true if recording started successfully, or false if an error occurred.
 */
export const startRecording = async () => {
  try {
    // Initialize a new MicRecorder instance
    recorder = new MicRecorder();
    // Start recording
    await recorder.start();
    return true;
  } catch (error) {
    // Log the error if recording fails to start
    console.error('Error starting recording:', error);
    return false;
  }
};

/**
 * Stops recording audio and returns the recorded data.
 *
 * @returns {Promise<{blob: Blob | null, buffer: ArrayBuffer | null}>} - A promise that resolves to an object containing the recorded audio Blob and buffer if successful, or null values if an error occurred.
 */
export const stopRecording = async () => {
  try {
    // Stop recording and retrieve the audio Blob and buffer
    const { blob, buffer } = await recorder.stop();
    return { blob, buffer };
  } catch (error) {
    // Log the error if stopping the recording fails
    console.error('Error stopping recording:', error);
    return { blob: null, buffer: null };
  }
};
