import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../config.json'; // Import configuration
import './VocabCardCat.css'; // Import separate CSS for styling

const VocabCardCat = () => {
  const [wordCounts, setWordCounts] = useState({});

  // Fetch word counts dynamically
  useEffect(() => {
    const fetchWordCounts = async () => {
      const counts = {};
      for (const category of config.categories) {
        try {
          const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${category.fileName}`);
          const data = await response.json();
          counts[category.name] = data.length; // Count words in the file
        } catch (error) {
          console.error(`Error loading data for ${category.name}:`, error);
        }
      }
      setWordCounts(counts);
    };

    fetchWordCounts();
  }, []);

  return (
    <div className="home-card-container">
      {config.categories.map((category) => (
        <div className="home-card" key={category.name}>
          <div className="home-card-inner">
            {/* Front Side */}
            <div className="home-card-front">
              <span className="badge">{category.displayName}</span> {/* Use displayName */}
              <img src={category.image} alt={category.name} />
            </div>
            {/* Back Side */}
            <div className="home-card-back">
              <Link to={`/showcat/${category.name}`} className="level-button">
                <button className="btn btn-primary">
                  {category.displayName}
                </button>
              </Link>
              <div className="count-text">
                {wordCounts[category.name] || "Loading..."} คำ
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="home-card-footer">
            <Link
              to={`/showcat/${category.name}`} // Link to Showcat
              className="home-card-button read-button"
            >
              <i className="fas fa-book-open"></i> ฝึกอ่าน
            </Link>
            <Link
              to={`/allvocabcat/${category.name}`} // Link to Allvocabcat
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
