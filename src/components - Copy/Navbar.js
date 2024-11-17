import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the menu visibility
  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the state to open/close the menu
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">

        {/* Brand logo and title */}
        <Link to="/" className="navbar-brand">
        <img src="/assets/logo.png" alt="Logo" className="navbar-logo" /> {/* เพิ่มโลโก้ */}
        English Flashcard
        </Link>
        
        {/* Hamburger Icon */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu} // Handle click to toggle
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Items */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={toggleMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/vocabulary" className="nav-link" onClick={toggleMenu}>Vocabulary</Link>
            </li>
            <li className="nav-item">
              <Link to="/allvocab" className="nav-link" onClick={toggleMenu}>All Vocab</Link>
            </li>
            <li className="nav-item">
              <Link to="/search" className="nav-link" onClick={toggleMenu}>Search</Link>
            </li>
            <li className="nav-item">
              <Link to="/randomvocab" className="nav-link" onClick={toggleMenu}>Randomvocab</Link>
            </li>
          </ul>
        </div>
    </nav>
  );
};

export default Navbar;
