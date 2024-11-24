import React, { useEffect, useState } from 'react';
import config from '../config.json';
import '../styles/Allvocab.css';

// Function to highlight vowels in red
const highlightVowels = (text) => {
  return text.split('').map((char, index) => {
    if (/[AEIOUaeiou]/.test(char)) { // Check if the character is a vowel
      return (
        <span key={index} style={{ color: 'red' }}>
          {char}
        </span>
      );
    }
    return char; // Return non-vowel characters unchanged
  });
};

function Allvocab() {
  const [vocabList, setVocabList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(config.categories[0]);
  const [totalVocabCount, setTotalVocabCount] = useState(0);

  const calculateTotalVocabCount = async () => {
    try {
      const total = await Promise.all(
        config.categories.map(async (category) => {
          const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${category.fileName}`);
          const data = await response.json();
          return data.length;
        })
      ).then((counts) => counts.reduce((acc, count) => acc + count, 0));
      setTotalVocabCount(total);
    } catch (error) {
      console.error("Error calculating total vocabulary count:", error);
    }
  };

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
    calculateTotalVocabCount();
    loadVocabData(selectedCategory.fileName);
  }, []);

  useEffect(() => {
    loadVocabData(selectedCategory.fileName);
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    const categoryName = event.target.value;
    const category = config.categories.find((cat) => cat.name === categoryName);
    setSelectedCategory(category);
  };

  const playAudio = (audioFile) => {
    const audio = new Audio(`${process.env.PUBLIC_URL}/wav/${selectedCategory.audioFolder}/${audioFile}`);
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  return (
    <div className="container-fluid allvocabcss">
      <h1 className="title">
        คำศัพท์ทั้งหมด{" "}
        <span className="highlight-number">{config.categories.length}</span> หมวดหมู่
        <br /><br />
        จำนวน{" "}
        <span className="highlight-number">{totalVocabCount}</span> คำ
      </h1>

      {/* Category Dropdown */}
      <div className="header-section">
        <label htmlFor="vocabDropdown">เลือกหมวดหมู่:</label>
        <select
          className="form-select dropdown-select"
          value={selectedCategory.name}
          onChange={handleCategoryChange}
        >
          {config.categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.displayName}
            </option>
          ))}
        </select>
        <span className="category-count">{vocabList.length} คำ</span>
      </div>

      {/* Vocabulary Cards */}
      <div className="vocab-card-container">
        {vocabList.map((item, index) => (
          <div className="vocab-card" key={index}>
            <span className="top-left-badge">{selectedCategory.displayName}</span>
            <span className="top-right-badge">{index + 1}</span>
            <div className="vocab-card-body">
              <h2 className="vocab-card-title">{highlightVowels(item.word)}</h2>
              <p className="vocab-card-text">{highlightVowels(item.translation)}</p>
              <button
                className="vocab-card-button"
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
