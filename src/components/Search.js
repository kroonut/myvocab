import React, { useEffect, useState } from 'react';
import config from '../config.json';
import '../styles/Search.css';

const Search = () => {
  const [allVocabList, setAllVocabList] = useState([]); // All vocab data across categories
  const [filteredVocabList, setFilteredVocabList] = useState([]); // Filtered results for search
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Load all vocabulary data on component mount
  useEffect(() => {
    const loadAllVocabData = async () => {
      setIsLoading(true);
      let combinedData = [];
      for (const category of config.categories) {
        try {
          const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${category.fileName}`);
          const data = await response.json();

          // Add category-specific information (name and audio folder) to each vocab item
          const categoryData = data.map(item => ({
            ...item,
            categoryName: category.displayName,
            audioFolder: category.audioFolder,
          }));

          combinedData = [...combinedData, ...categoryData];
        } catch (error) {
          console.error(`Error loading vocabulary data for ${category.name}:`, error);
        }
      }
      setAllVocabList(combinedData);
      setIsLoading(false);
    };

    loadAllVocabData();
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter the vocabulary list based on both English (word) and Thai (translation)
    const filteredList = query
      ? allVocabList.filter(item =>
        item.word.toLowerCase().includes(query) ||
        item.translation.toLowerCase().includes(query)
      )
      : [];

    setFilteredVocabList(filteredList);
  };

  const playAudio = (audioFile, audioFolder) => {
    const audio = new Audio(`${process.env.PUBLIC_URL}/wav/${audioFolder}/${audioFile}`);
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  // Highlight vowels in the text
  const highlightVowels = (text) => {
    return text.split('').map((char, index) => {
      if (/[AEIOUaeiou]/.test(char)) {
        return (
          <span key={index} className="highlight-vowel">
            {char}
          </span>
        );
      }
      return char;
    });
  };

  return (
    <div className="searchvocabcss">
      <h1 className="title">ค้นหาคำศัพท์</h1>

      {/* Search Input */}
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="ค้นหา"
          className="form-control search-input"
        />
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Vocabulary Cards */}
      {!isLoading && filteredVocabList.length > 0 && (
        <div className="allvocab-card-container">
          {filteredVocabList.map((item, index) => (
            <div className="allvocab-card" key={index}>
              {/* Category Badge */}
              <span className="level-badge">{item.categoryName}</span>
              {/* Index Badge */}
              <span className="index-badge">{index + 1}</span>

              <div className="allvocab-card-body">
                <h5 className="allvocab-card-title">{highlightVowels(item.word)}</h5>
                <p className="allvocab-card-text">{highlightVowels(item.translation)}</p>
                <button
                  className="allvocab-card-button btn btn-primary"
                  onClick={() => playAudio(item.audioFile, item.audioFolder)}
                  aria-label="Play audio"
                >
                  <i className="fas fa-volume-up"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display message if there are no search results */}
      {!isLoading && searchQuery && filteredVocabList.length === 0 && (
        <p className="text-center">ไม่พบคำศัพท์ที่ค้นหา</p>
      )}
    </div>
  );
};

export default Search;
