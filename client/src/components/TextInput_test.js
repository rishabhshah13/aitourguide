import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import TextInput from './TextInput';

// test('renders TextInput component', () => {
//   render(<TextInput setFileTextSegments={() => {}} />);
//   const buttonElement = screen.getByText(/Add Tour Guide/i);
//   expect(buttonElement).toBeInTheDocument();
// });
