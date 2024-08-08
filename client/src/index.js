// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
// import './components/Styles.css'; // Import the CSS file
import DeepgramTTS from './components/DeepgramTTS';
import TopBar from './components/TopBar';
// src/index.js or src/App.js
import './styles/colors.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <TopBar />
    <DeepgramTTS />
  </React.StrictMode>
);
