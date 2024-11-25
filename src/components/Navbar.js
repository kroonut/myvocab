import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      {/* Brand logo and title */}
      <Link to="/" className="navbar-brand">
        <img src="/myvocab/assets/logo.png" alt="Logo" className="navbar-logo" />
        English Flashcard
      </Link>

      {/* Hamburger Icon */}
      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleMenu}
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Menu Items */}
      <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={toggleMenu}>
              <i className="fas fa-home"></i> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/vocabulary" className="nav-link" onClick={toggleMenu}>
              <i className="fas fa-book"></i> คำศัพท์
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/allvocab" className="nav-link" onClick={toggleMenu}>
              <i className="fas fa-list"></i> ทั้งหมด
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/search" className="nav-link" onClick={toggleMenu}>
              <i className="fas fa-search"></i> ค้นหา
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/CategoriesList" className="nav-link" onClick={toggleMenu}>
              <i className="fas fa-random"></i> หมวดหมู๋
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/VocabQuizGame" className="nav-link" onClick={toggleMenu}>
              <i className="fas fa-gamepad"></i> เกมส์
            </Link>
          </li>          
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
