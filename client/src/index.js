// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './components/Styles.css'; // Import the CSS file
import DeepgramTTS from './components/DeepgramTTS';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <DeepgramTTS />
  </React.StrictMode>
);


// // src/index.js
// import React from 'react';
// import ReactDOM from 'react-dom';
// import './components/Styles.css'; // Import the CSS file
// import DeepgramTTS from './components/DeepgramTTS';

// ReactDOM.render(
//   <React.StrictMode>
//     <DeepgramTTS />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
