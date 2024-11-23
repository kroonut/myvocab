import React, { useEffect, useState } from 'react';
import config from '../config.json';
import './Allvocab.css';

function Allvocab() {
  const [vocabList, setVocabList] = useState([]); // All vocab data across categories
  const [selectedCategory, setSelectedCategory] = useState(config.categories[0]); // Current selected category

  // Load vocab data based on selected category
  const loadVocabData = async (fileName) => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${fileName}`);
      const data = await response.json();
      setVocabList(data);
    } catch (error) {
      console.error("Error loading vocabulary data:", error);
    }
  };

  useEffect(() => {
    loadVocabData(selectedCategory.fileName);
  }, [selectedCategory]); // Load data whenever category changes

  const handleCategoryChange = (event) => {
    const categoryName = event.target.value;
    const category = config.categories.find((cat) => cat.name === categoryName);
    setSelectedCategory(category); // Update selected category
  };

  const playAudio = (audioFile) => {
    const audio = new Audio(`${process.env.PUBLIC_URL}/wav/${selectedCategory.audioFolder}/${audioFile}`);
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  return (
    <div className="container-fluid allvocabcss">
      <h1 className="page-title text-center">คำศัพท์ทั้งหมด</h1>

      {/* Category Dropdown */}
      <div className="d-flex justify-content-center align-items-center mb-4">
        <label htmlFor="vocabDropdown" className="form-label me-2 mb-0">
          เลือกหมวดหมู่:
        </label>
        <select
          className="form-select"
          style={{ width: '150px' }}
          value={selectedCategory.name}
          onChange={handleCategoryChange}
        >
          {config.categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.displayName} {/* Show category in Thai */}
            </option>
          ))}
        </select>
      </div>

      {/* Vocabulary Cards */}
      <div className="vocab-card-container">
        {vocabList.map((item, index) => (
          <div className="vocab-card" key={index}>
            {/* Category Badge */}
            <span className="top-left-badge">{selectedCategory.displayName}</span>
            {/* Index Badge */}
            <span className="top-right-badge">{index + 1}</span>

            <div className="vocab-card-body">
              <h2 className="vocab-card-title">{item.word}</h2>
              <p className="vocab-card-text">{item.translation}</p>
              <button
                className="vocab-card-button btn btn-primary"
                onClick={() => playAudio(item.audioFile)}
                aria-label="Play audio"
              >
                <i className="fas fa-volume-up"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Allvocab;
