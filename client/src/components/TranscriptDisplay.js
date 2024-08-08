import React from 'react';

/**
 * Component for displaying the transcript and file text segments.
 *
 * This component renders the transcript and highlights the current
 * text segment from a file. The transcript is hidden, and file text
 * segments are displayed with the current segment highlighted.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.transcript - The transcript text to be displayed.
 * @param {number} props.currentSegmentIndex - The index of the currently active segment.
 * @param {string[]} props.fileTextSegments - An array of text segments from a file.
 *
 * @returns {JSX.Element} A React component displaying the transcript and file text segments.
 *
 * @example
 * // Example usage:
 * <TranscriptDisplay
 *   transcript="This is the transcript of the audio."
 *   currentSegmentIndex={2}
 *   fileTextSegments={['First segment', 'Second segment', 'Third segment']}
 * />
 */
const TranscriptDisplay = ({
  transcript,
  currentSegmentIndex,
  fileTextSegments,
}) => {
  console.log('fileTextSegments', fileTextSegments);
  console.log('currentSegmentIndex', currentSegmentIndex);
  return (
    <div>
      <div style={{ display: 'none' }}>
        <h3>Transcript:</h3>
        <p>{transcript}</p>
      </div>

      {/* <h3>File Text Segments:</h3>
      {fileTextSegments.map((segment, index) => (
        <span
          key={index}
          style={{
            backgroundColor:
              index === currentSegmentIndex ? 'yellow' : 'transparent',
          }}
        >
          {segment}.
        </span>
      ))} */}

      {/* <h3>File Text Segments:</h3>
      {fileTextSegments.map((segment, index) => (
        <span
          key={index}
          style={{
            backgroundColor:
              index === currentSegmentIndex ? 'yellow' : 'transparent',
          }}
        >
          {segment}.
        </span>
      ))} */}
    </div>
  );
};

export default TranscriptDisplay;
