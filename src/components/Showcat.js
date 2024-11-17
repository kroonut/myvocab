import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config.json';
import './Vocabulary.css'; // Reuse Vocabulary.css for styling

const Showcat = () => {
  const { categoryName } = useParams();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [vocabList, setVocabList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [delay, setDelay] = useState(3);
  const [range, setRange] = useState("1-5");
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const loadVocabData = useCallback(async (fileName) => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${fileName}`);
      if (!response.ok) throw new Error('Failed to load vocabulary data.');
      const data = await response.json();
      setVocabList(data);
      setCurrentWordIndex(0);
    } catch (error) {
      console.error('Error loading vocabulary data:', error);
    }
  }, []);

  useEffect(() => {
    const category = config.categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (category) {
      setSelectedCategory(category);
      loadVocabData(category.fileName);
    }
  }, [categoryName, loadVocabData]);

  const handleCategoryChange = (e) => {
    const category = config.categories.find(cat => cat.name === e.target.value);
    if (category) {
      setSelectedCategory(category);
      loadVocabData(category.fileName);
    }
  };

  const playAudio = useCallback(() => {
    const currentWord = vocabList[currentWordIndex];
    if (currentWord && currentWord.audioFile && selectedCategory) {
      const audioPath = `${process.env.PUBLIC_URL}/wav/${selectedCategory.audioFolder}/${currentWord.audioFile}`;
      const audio = new Audio(audioPath);
      audio.play().catch((error) => console.error('Error playing audio:', error));
    }
  }, [currentWordIndex, vocabList, selectedCategory]);

  const stopAutoPlay = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsAutoPlay(false);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlay) {
      stopAutoPlay();
    } else {
      playAudio();
      const id = setInterval(() => {
        setCurrentWordIndex((prevIndex) =>
          prevIndex < vocabList.length - 1 ? prevIndex + 1 : 0
        );
      }, delay * 1000);
      setIntervalId(id);
      setIsAutoPlay(true);
    }
  };

  const handleRangeChange = (e) => {
    const rangeValue = e.target.value.trim();
    setRange(rangeValue);

    if (/^\d+$/.test(rangeValue)) {
      const index = parseInt(rangeValue, 10) - 1;
      if (index >= 0 && index < vocabList.length) {
        setCurrentWordIndex(index);
      }
    } else {
      const [start, end] = rangeValue.split('-').map((num) => parseInt(num.trim(), 10) - 1);
      if (!isNaN(start) && !isNaN(end) && start >= 0 && end < vocabList.length && start <= end) {
        setCurrentWordIndex(start);
      }
    }
  };

  const handleDelayChange = (e) => {
    setDelay(Number(e.target.value));
  };

  const goToNext = () => {
    setCurrentWordIndex((prevIndex) =>
      prevIndex < vocabList.length - 1 ? prevIndex + 1 : 0
    );
    playAudio();
  };

  const goToPrevious = () => {
    setCurrentWordIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : vocabList.length - 1
    );
    playAudio();
  };

  const goToFirst = () => {
    setCurrentWordIndex(0);
    playAudio();
  };

  const goToLast = () => {
    setCurrentWordIndex(vocabList.length - 1);
    playAudio();
  };

  const highlightVowels = (word) => {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
    return word.split('').map((char, index) =>
      vowels.includes(char) ? (
        <span key={index} style={{ color: 'red' }}>{char}</span>
      ) : (
        <span key={index}>{char}</span>
      )
    );
  };

  const highlightedWord = useMemo(
    () => highlightVowels(vocabList[currentWordIndex]?.word || ''),
    [currentWordIndex, vocabList]
  );

  useEffect(() => {
    return () => stopAutoPlay();
  }, []);

  return (
    <div className="container-fluid">
      <h1 className="vocab-title">Vocabulary List - {categoryName}</h1>

      {/* Header Section with Category Selection */}
      <div className="header-section">
        <label htmlFor="vocabDropdown">เลือกหมวดหมู่:</label>
        <select
          id="vocabDropdown"
          className="form-select d-inline-block"
          onChange={handleCategoryChange}
          value={selectedCategory?.name || ""}
        >
          {config.categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <span>No. {currentWordIndex + 1}/{vocabList.length}</span>
      </div>

      {vocabList.length === 0 ? (
        <p className="text-center">No words available for the selected category.</p>
      ) : (
        <>
          <div className="vocab-display-container">
            <div className="vocab-card mb-4 shadow-sm">
              <div className="card-body">
                <h1 className="vocab-word">{highlightedWord}</h1>
                <h2 className="vocab-translation">{vocabList[currentWordIndex]?.translation}</h2>
              </div>
            </div>
          </div>

          <div className="controls">
            {/* Input Controls for Delay and Range */}
            <div className="input-controls">
              <div>
                <label>เวลา (วินาที):</label>
                <input
                  type="number"
                  value={delay}
                  onChange={handleDelayChange}
                  className="form-control d-inline-block"
                  disabled={isAutoPlay}
                />
              </div>
              <div>
                <label>ช่วงคำ:</label>
                <input
                  type="text"
                  value={range}
                  onChange={handleRangeChange}
                  className="form-control d-inline-block"
                  placeholder="1-5"
                  disabled={isAutoPlay}
                />
              </div>
            </div>

            {/* Navigation and Playback Controls */}
            <div className="button-controls">
              <button className="btn btn-outline-primary btn-sm" onClick={goToFirst}>
                <i className="fas fa-angle-double-left"></i>
              </button>
              <button className="btn btn-outline-primary btn-sm" onClick={goToPrevious}>
                <i className="fas fa-angle-left"></i>
              </button>
              <button className="btn btn-outline-primary btn-sm" onClick={goToNext}>
                <i className="fas fa-angle-right"></i>
              </button>
              <button className="btn btn-outline-primary btn-sm" onClick={goToLast}>
                <i className="fas fa-angle-double-right"></i>
              </button>
              <button className="btn btn-outline-primary btn-sm" onClick={playAudio}>
                <i className="fas fa-volume-up"></i>
              </button>
              <button
                className={`btn ${isAutoPlay ? 'btn-danger' : 'btn-success'} btn-sm`}
                onClick={toggleAutoPlay}
              >
                <i className={`fas ${isAutoPlay ? 'fa-stop' : 'fa-play'}`}></i>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Showcat;
