import React from 'react';
import { Link } from 'react-router-dom';
import config from '../config.json'; // Import configuration

const VocabCardCat = () => {
  return (
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
  );
};

export default VocabCardCat;
