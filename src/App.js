import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Vocabulary from './components/Vocabulary';
import Showcat from './components/Showcat';
import Allvocab from './components/Allvocab';
import Allvocabcat from './components/Allvocabcat'; // Import Allvocabcat component
import Search from './components/Search';
import RandomVocab from './components/RandomVocab';
import './index.css';

function App() {
  const cardData = [
    { id: 1, category: "grade1", card_back_txt: "Grade 1", count: "155 words", image: "/assets/p1.webp" },
    { id: 2, category: "grade2", card_back_txt: "Grade 2", count: "159 words", image: "/assets/p2.webp" },
    { id: 3, category: "grade3", card_back_txt: "Grade 3", count: "154 words", image: "/assets/p3.webp" },
    { id: 4, category: "grade4", card_back_txt: "Grade 4", count: "255 words", image: "/assets/p4.webp" },
    { id: 5, category: "grade5", card_back_txt: "Grade 5", count: "254 words", image: "/assets/p5.webp" },
    { id: 6, category: "grade6", card_back_txt: "Grade 6", count: "250 words", image: "/assets/p6.webp" },
    { id: 6, category: "day", card_back_txt: "Days", count: "250 words", image: "/assets/1-day.webp" },
    { id: 6, category: "animal", card_back_txt: "Animals", count: "120 words", image: "/assets/6-animal.webp" },
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
                <RandomVocab />
                <div className="home-card-container">
                  {cardData.map((card) => (
                    <div className="home-card" key={card.id}>
                      <div className="home-card-inner">
                        {/* Front side */}
                        <div className="home-card-front">
                          <span className="badge">{card.card_back_txt}</span>
                          <img src={card.image} alt={card.category} />
                        </div>
                        {/* Back side */}
                        <div className="home-card-back">
                          <div className="level-text">{card.card_back_txt}</div>
                          <div className="count-text">{card.count}</div>
                        </div>
                      </div>
                      {/* Footer */}
                      <div className="home-card-footer">
                        <Link
                          to={`/showcat/${card.category}`} // Updated to use /showcat/:category style
                          className="home-card-button read-button"
                        >
                          <i className="fas fa-book-open"></i> ฝึกอ่าน
                        </Link>
                        <Link
                          to={`/allvocabcat/${card.category}`} // Redirect to Allvocabcat with the selected category
                          className="home-card-button review-button"
                        >
                          <i className="fas fa-list-alt"></i> ทั้งหมด
                        </Link>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
          {/* Other Routes */}
          <Route path="/showcat/:categoryName" element={<Showcat />} />
          <Route path="/allvocab" element={<Allvocab />} />
          <Route path="/allvocabcat/:categoryName" element={<Allvocabcat />} /> {/* Add dynamic route for Allvocabcat */}
          <Route path="/search" element={<Search />} />
          <Route path="/randomVocab" element={<RandomVocab />} />
          <Route path="/Vocabulary" element={<Vocabulary />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
