import { render, screen, fireEvent, act } from '@testing-library/react';
import DeepgramTTS from '../components/DeepgramTTS';
import * as AudioRecorder from '../components/AudioRecorder';
import * as SpeechToText from '../components/SpeechToText';
import * as TextToSpeech from '../components/TextToSpeech';
import fetchLLMResponse from '../components/LLMIntegration';
import Popup from '../components/Popup';

beforeAll(() => {
  // Suppress console.error in tests
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});


jest.mock('../components/AudioRecorder');
jest.mock('../components/SpeechToText');
jest.mock('../components/TextToSpeech');
jest.mock('../components/LLMIntegration');
jest.mock('../components/Popup', () => ({
  __esModule: true,
  default: ({ message, onClose }) => (
    <div>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  )
}));

test('renders DeepgramTTS component with initial state', () => {
  render(<DeepgramTTS />);
  expect(screen.getByText(/Start Tour/i)).toBeInTheDocument();
  expect(screen.queryByText(/Pause Tour/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /recording/i })).not.toBeInTheDocument();
});

test('clicking Start Tour button initializes tour', () => {
  render(<DeepgramTTS />);
  fireEvent.click(screen.getByText(/Start Tour/i));
  expect(screen.getByText(/Pause Tour/i)).toBeInTheDocument();
});

test('toggle recording starts and stops recording', async () => {
  AudioRecorder.startRecording = jest.fn().mockResolvedValue(true);
  AudioRecorder.stopRecording = jest.fn().mockResolvedValue({ buffer: new ArrayBuffer(8), blob: new Blob() });
  SpeechToText.convertSpeechToText = jest.fn().mockResolvedValue('Sample Transcript');
  TextToSpeech.default = jest.fn().mockResolvedValue(new Blob());

  render(<DeepgramTTS />);

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /microphone/i }));
  });
  expect(AudioRecorder.startRecording).toHaveBeenCalled();

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /microphone-slash/i }));
  });
  expect(AudioRecorder.stopRecording).toHaveBeenCalled();
});

test('Text-to-Speech plays audio for a segment', async () => {
  TextToSpeech.default = jest.fn().mockResolvedValue(new Blob());

  render(<DeepgramTTS />);
  const component = screen.getByRole('button', { name: /Start Tour/i });
  fireEvent.click(component);

  await act(async () => {
    component.handleTTS('Test Segment');
  });

  expect(TextToSpeech.default).toHaveBeenCalledWith('Test Segment', expect.anything());
});

test('shows and closes the popup', () => {
  render(<DeepgramTTS />);
  fireEvent.click(screen.getByText(/Start Tour/i));
  fireEvent.click(screen.getByRole('button', { name: /microphone/i }));

  expect(screen.getByText(/The answer has been generated and spoken. Please review it./i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /close/i }));
  expect(screen.queryByText(/The answer has been generated and spoken. Please review it./i)).not.toBeInTheDocument();
});

test('handles jailbreaking attempts', async () => {
  fetchLLMResponse.mockImplementation(async (text, option) => {
    if (text.includes('dangerous content')) {
      return 'Response blocked due to inappropriate content';
    }
    return 'Safe response';
  });

  render(<DeepgramTTS />);

  fireEvent.click(screen.getByRole('button', { name: /microphone/i }));

  expect(fetchLLMResponse).toHaveBeenCalledWith(expect.stringContaining('dangerous content'), expect.anything());
  expect(screen.getByText(/Response blocked due to inappropriate content/i)).toBeInTheDocument();
});
