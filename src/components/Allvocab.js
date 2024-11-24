import React, { useEffect, useState } from 'react';
import config from '../config.json';
import '../styles/Allvocab.css';

function Allvocab() {
  const [vocabList, setVocabList] = useState([]); // Vocabulary data for the current category
  const [selectedCategory, setSelectedCategory] = useState(config.categories[0]); // Currently selected category
  const [totalVocabCount, setTotalVocabCount] = useState(0); // Total vocabulary count

  // Function to calculate the total vocabulary count
  const calculateTotalVocabCount = async () => {
    let total = 0;
    for (const category of config.categories) {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${category.fileName}`);
        const data = await response.json();
        total += data.length; // Add the length of each category's data
      } catch (error) {
        console.error(`Error loading data for category ${category.name}:`, error);
      }
    }
    setTotalVocabCount(total); // Update the total count
  };

  // Load vocabulary data for the selected category
  const loadVocabData = async (fileName) => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${fileName}`);
      const data = await response.json();
      setVocabList(data);
    } catch (error) {
      console.error("Error loading vocabulary data:", error);
    }
  };

  // Initial load and update on category change
  useEffect(() => {
    calculateTotalVocabCount(); // Calculate the total vocabulary count
    loadVocabData(selectedCategory.fileName); // Load data for the initially selected category
  }, []);

  // Update data when a new category is selected
  useEffect(() => {
    loadVocabData(selectedCategory.fileName);
  }, [selectedCategory]);

  // Handle category selection change
  const handleCategoryChange = (event) => {
    const categoryName = event.target.value;
    const category = config.categories.find((cat) => cat.name === categoryName);
    setSelectedCategory(category);
  };

  // Function to play audio
  const playAudio = (audioFile) => {
    const audio = new Audio(`${process.env.PUBLIC_URL}/wav/${selectedCategory.audioFolder}/${audioFile}`);
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  return (
    <div className="container-fluid allvocabcss">
      <h1 className="text-center">
        คำศัพท์ทั้งหมด{" "}
        <span style={{ color: "blue" }}>{config.categories.length}</span> หมวดหมู่ จำนวน{" "}
        <span style={{ color: "blue" }}>{totalVocabCount}</span> คำ
      </h1>

      {/* Category Dropdown */}
      <div className="header-section">
        <label htmlFor="vocabDropdown">เลือกหมวดหมู่:</label>
        <select
          className="form-select"
          style={{ width: '150px', display: 'inline-block', marginRight: '10px' }}
          value={selectedCategory.name}
          onChange={handleCategoryChange}
        >
          {config.categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.displayName}
            </option>
          ))}
        </select>

        {/* Display word count for selected category */}
        <span className="ms-1" >
          {vocabList.length} คำ
        </span>
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
