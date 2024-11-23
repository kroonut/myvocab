import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../config.json';
import './Allvocab.css';

const Allvocabcat = () => {
  const { categoryName } = useParams(); // Get categoryName from the URL
  const navigate = useNavigate(); // For navigating between categories
  const [vocabList, setVocabList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Load vocabulary data for the selected category
  const loadVocabData = async (fileName) => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${fileName}`);
      if (!response.ok) throw new Error("Failed to load vocabulary data.");
      const data = await response.json();
      setVocabList(data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error loading vocabulary data:", error);
      setErrorMessage("ไม่สามารถโหลดคำศัพท์ได้");
    }
  };

  // Update the selected category and load data whenever categoryName changes
  useEffect(() => {
    const category = config.categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (category) {
      setSelectedCategory(category);
      loadVocabData(category.fileName);
    } else {
      setErrorMessage("ไม่พบหมวดหมู่");
    }
  }, [categoryName]);

  // Handle dropdown category change
  const handleCategoryChange = (event) => {
    const newCategoryName = event.target.value;
    navigate(`/allvocabcat/${newCategoryName}`); // Navigate to the new category
  };

  const playAudio = (audioFile) => {
    if (selectedCategory) {
      const audioPath = `${process.env.PUBLIC_URL}/wav/${selectedCategory.audioFolder}/${audioFile}`;
      const audio = new Audio(audioPath);
      audio.play().catch((error) => console.error("Error playing audio:", error));
    }
  };

  return (
    <div className="container-fluid allvocabcss">
      <h1 className="page-title text-center">
        รายการคำศัพท์ - {selectedCategory ? selectedCategory.displayName : "หมวดหมู่ไม่พบ"}
      </h1>

      {errorMessage ? (
        <p className="text-center text-danger">{errorMessage}</p>
      ) : (
        <>
          {/* Category selection */}
          <div className="d-flex justify-content-center mb-4">
            <select
              className="form-select w-25"
              value={selectedCategory?.name || ""}
              onChange={handleCategoryChange}
            >
              {config.categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.displayName} {/* Display name in Thai */}
                </option>
              ))}
            </select>
          </div>

          {/* Vocabulary Cards */}
          <div className="vocab-card-container">
            {vocabList.map((item, index) => (
              <div className="vocab-card" key={index}>
                <span className="top-left-badge">{selectedCategory.displayName}</span>
                <span className="top-right-badge">{index + 1}</span>
                <div className="vocab-card-body">
                  <h2 className="vocab-card-title">{item.word}</h2>
                  <p className="vocab-card-text">{item.translation}</p>
                  <button
                    className="vocab-card-button btn btn-primary"
                    onClick={() => playAudio(item.audioFile)}
                  >
                    <i className="fas fa-volume-up"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Allvocabcat;
