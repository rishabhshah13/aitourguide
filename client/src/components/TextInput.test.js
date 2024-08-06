// src/components/TextInput.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import TextInput from './TextInput';

test('renders TextInput component', () => {
  render(<TextInput setFileTextSegments={() => {}} />);
  const buttonElement = screen.getByText(/Add Tour Guide/i);
  expect(buttonElement).toBeInTheDocument();
});
