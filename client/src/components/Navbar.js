// Import React and the Link component from react-router-dom for navigation
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A functional component that renders the navigation bar of the application.
 *
 * @returns {JSX.Element} The JSX code for rendering the navigation bar.
 *
 * @component
 * @example
 * // Example usage:
 * <Navbar />
 */
const Navbar = () => {
  return (
    <nav>
      <ul>
        {/* Navigation link to the Home page */}
        <li>
          <Link to="/">Home</Link>
        </li>
        {/* Navigation link to the Text to Speech page */}
        <li>
          <Link to="/tts">Text to Speech</Link>
        </li>
        {/* Uncomment the following links to add additional navigation options */}
        {/* <li><Link to="/realtime-stt">Realtime Speech to Text</Link></li> */}
        {/* <li><Link to="/realtime-tts">Realtime Text to Speech</Link></li> */}
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
};

// Export the Navbar component as the default export
export default Navbar;
