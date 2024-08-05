// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tts">Text to Speech</Link></li>
        {/* <li><Link to="/realtime-stt">Realtime Speech to Text</Link></li> */}
        {/* <li><Link to="/realtime-tts">Realtime Text to Speech</Link></li> */}
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
};

export default Navbar;
