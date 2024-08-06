// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DeepgramTTS from './components/DeepgramTTS';

// import RealTimeSTT from './components/RealTimeSTT with button'; // Import the new component
// import RealTimeTTS from './components/RealTimeTTS'; // Import the new component

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          {/* <TopBar /> */}
          <Route path="/tts" element={<DeepgramTTS />} />
          {/* <Route path="/realtime-stt" element={<RealTimeSTT />} /> Add route for RealTimeSTT */}
          {/* <Route path="/realtime-tts" element={<RealTimeTTS />} /> Add route for RealTimeTTS */}
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
