//app.js
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Vocabulary from './components/Vocabulary';
import Showcat from './components/Showcat';
import Allvocab from './components/Allvocab';
import Allvocabcat from './components/Allvocabcat';
import Search from './components/Search';
import RandomVocab from './components/RandomVocab';
import config from './config.json'; // Import config.json
import './index.css';

function App() {
  return (
    <div id="root">
      <Navbar />
      <div className="container-fluid">
        <Routes>
          {/* Homepage */}
          <Route
            path="/"
            element={
              <div className="home-page text-center">
                <RandomVocab />
                <div className="home-card-container">
                  {config.categories.map((category) => (
                    <div className="home-card" key={category.name}>
                      <div className="home-card-inner">
                        {/* Front Side */}
                        <div className="home-card-front">
                          <span className="badge">{category.card_back_txt}</span>
                          <img src={category.image} alt={category.name} />
                        </div>
                        {/* Back Side */}
                        <div className="home-card-back">
                          <div className="level-text">{category.card_back_txt}</div>
                          <div className="count-text">{category.count}</div>
                        </div>
                      </div>
                      {/* Footer */}
                      <div className="home-card-footer">
                        <Link
                          to={`/showcat/${category.name}`} // Dynamic link to Showcat
                          className="home-card-button read-button"
                        >
                          <i className="fas fa-book-open"></i> ฝึกอ่าน
                        </Link>
                        <Link
                          to={`/allvocabcat/${category.name}`} // Dynamic link to Allvocabcat
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
          {/* Routes for Other Pages */}
          <Route path="/showcat/:categoryName" element={<Showcat />} />
          <Route path="/allvocab" element={<Allvocab />} />
          <Route path="/allvocabcat/:categoryName" element={<Allvocabcat />} />
          <Route path="/search" element={<Search />} />
          <Route path="/randomVocab" element={<RandomVocab />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
