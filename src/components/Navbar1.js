// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen); // เปลี่ยนสถานะเปิด/ปิดของเมนู
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">My App</Link>
      
      {/* ปุ่ม Hamburger */}
      <button className="hamburger" onClick={toggleMenu}>
        &#9776;
      </button>

      {/* เมนู */}
      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/" className="navbar-link" onClick={toggleMenu}>Home</Link>
        </li>
        <li>
          <Link to="/vocabulary" className="navbar-link" onClick={toggleMenu}>Vocabulary</Link>
        </li>
        <li>
          <Link to="/allvocab" className="navbar-link" onClick={toggleMenu}>All Vocab</Link>
        </li>
        <li>
          <Link to="/search" className="navbar-link" onClick={toggleMenu}>Search</Link>
        </li>
        <li>
          <Link to="/contact" className="navbar-link" onClick={toggleMenu}>Contact</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
