import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Vocabulary from './components/Vocabulary';
import Showcat from './components/Showcat';  // Correctly import Showcat.js
import Allvocab from './components/Allvocab';
import Search from './components/Search';
import RandomVocab from './components/RandomVocab';  // Import RandomVocab component
import './index.css';

function App() {
  const cardData = [
    { id: 1, category: "grade1", count: "155 words", image: "/assets/p1.webp" },
    { id: 2, category: "grade2", count: "159 words", image: "/assets/p2.webp" },
    { id: 3, category: "grade3", count: "154 words", image: "/assets/p3.webp" },
    { id: 4, category: "grade4", count: "155 words", image: "/assets/p4.webp" },
    { id: 5, category: "grade5", count: "155 words", image: "/assets/p5.webp" },
    { id: 6, category: "grade6", count: "155 words", image: "/assets/p6.webp" },
  ];

  return (
    <div id="root">
      <Navbar />
      <div className="container-fluid">
        <Routes>
          {/* หน้าแรก (Homepage) */}
          <Route
            path="/"
            element={
              <div className="home-page text-center">
                <RandomVocab />  {/* Show RandomVocab on the homepage */}
                <div className="home-card-container">
                  {cardData.map((card) => (
                    <div className="home-card" key={card.id}>
                      <div className="home-card-inner">
                        {/* Front side */}
                        <div className="home-card-front">
                          <span className="badge">{card.category}</span>
                          <img src={card.image} alt={card.category} />
                        </div>
                        {/* Back side */}
                        <div className="home-card-back">
                          <div className="level-text">{card.category}</div>
                          <div className="count-text">{card.count}</div>
                        </div>
                      </div>
                      {/* Footer */}
                      <div className="home-card-footer">
                        <Link
                          to={`/showcat?category=${card.category}`}  // Changed 'level' to 'category'
                          className="home-card-button read-button"
                        >
                          <i className="fas fa-book-open"></i> ฝึกอ่าน
                        </Link>
                        <button className="home-card-button review-button">
                          <i className="fas fa-list-alt"></i> ทั้งหมด
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
          {/* Other Routes */}
          <Route path="/showcat" element={<Showcat />} />  {/* Showcat page */}
          <Route path="/allvocab" element={<Allvocab />} />
          <Route path="/search" element={<Search />} />
          <Route path="/randomVocab" element={<RandomVocab />} />
          <Route path="/Vocabulary" element={<Vocabulary />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
