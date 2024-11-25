import React from 'react';
import './MyComponent.css';

const MyComponent = () => {
  return (
    <div className="simple-container">
      <img 
        src="https://via.placeholder.com/800x250" 
        alt="Example" 
        className="simple-image" 
      />
      <p className="simple-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </div>
  );
}

export default MyComponent;
