import React from 'react';
import '../styles/TopBar.css';

/**
 * Renders the top bar of the application with the title "Virtual Tour Guide".
 *
 * This component is a functional React component that displays a header
 * section at the top of the application.
 *
 * @returns {JSX.Element} A React component representing the top bar.
 *
 * @example
 * // Example usage:
 * <TopBar />
 */
const TopBar = () => {
  return (
    <div className="top-bar">
      <h1>Virtual Tour Guide</h1>
    </div>
  );
};

export default TopBar;
