// src/components/AudioRecorder.js
import MicRecorder from 'mic-recorder-to-mp3';

const recorder = new MicRecorder({ bitRate: 128 });

const startRecording = async () => {
  try {
    await recorder.start();
    return true;
  } catch (error) {
    console.error('Error starting recording:', error);
    return false;
  }
};

const stopRecording = async () => {
  try {
    const [buffer, blob] = await recorder.stop().getMp3();
    return { buffer, blob };
  } catch (error) {
    console.error('Error stopping recording:', error);
    return { buffer: null, blob: null };
  }
};

export { startRecording, stopRecording };