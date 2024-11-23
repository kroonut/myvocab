// Vocabulary.js

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import config from '../config.json';
import '../styles/Vocabulary.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Vocabulary = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [vocabList, setVocabList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(config.categories[0]);
  const [delay, setDelay] = useState(3);
  const [range, setRange] = useState("1-5");
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(4);

  const loadVocabData = useCallback(async (fileName) => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${fileName}`);
      const data = await response.json();
      setVocabList(data);
      setCurrentWordIndex(0);
      stopAutoPlay();
      setRange("1-5");
      setRangeStart(0);
      setRangeEnd(4);
    } catch (error) {
      console.error("Error loading vocabulary data:", error);
    }
  }, [selectedCategory.fileName]);

  useEffect(() => {
    loadVocabData(selectedCategory.fileName);
  }, [selectedCategory, loadVocabData]);

  const handleCategoryChange = (e) => {
    const category = config.categories.find(cat => cat.name === e.target.value);
    if (category) {
      setSelectedCategory(category);
      setCurrentWordIndex(0);
      stopAutoPlay();
    }
  };

  const playAudio = useCallback(() => {
    const currentWord = vocabList[currentWordIndex];
    if (currentWord && currentWord.audioFile && currentWord.folder) {
      const audioPath = `${process.env.PUBLIC_URL}/wav/${currentWord.folder}/${currentWord.audioFile}`;
      const audio = new Audio(audioPath);
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }, [currentWordIndex, vocabList]);

  useEffect(() => {
    if (!isAutoPlay) {
      playAudio();
    }
  }, [currentWordIndex, playAudio, isAutoPlay]);

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
      setCurrentWordIndex(rangeStart); // Start from the rangeStart
      playAudio();

      // Set interval to cycle through words in the range and play the corresponding audio
      const id = setInterval(() => {
        setCurrentWordIndex((prevIndex) => {
          const nextIndex = prevIndex < rangeEnd ? prevIndex + 1 : rangeStart;
          return nextIndex;
        });
      }, delay * 1000); // Delay between words

      setIntervalId(id);
    }
    setIsAutoPlay(!isAutoPlay);
  };

  const handleRangeChange = (e) => {
    const rangeValue = e.target.value.trim();
    setRange(rangeValue);

    if (/^\d+$/.test(rangeValue)) {
      const index = parseInt(rangeValue, 10) - 1;
      if (index >= 0 && index < vocabList.length) {
        setRangeStart(index);
        setRangeEnd(index);
        setCurrentWordIndex(index);
        playAudio();
      }
    } else {
      const [start, end] = rangeValue.split('-').map(num => parseInt(num.trim(), 10) - 1);
      if (!isNaN(start) && !isNaN(end) && start >= 0 && end < vocabList.length && start <= end) {
        setRangeStart(start);
        setRangeEnd(end);
        setCurrentWordIndex(start);
      }
    }
  };

  const goToPrevious = () => {
    setCurrentWordIndex((prevIndex) => prevIndex > 0 ? prevIndex - 1 : 0);
  };

  const goToNext = () => {
    setCurrentWordIndex((prevIndex) => prevIndex < vocabList.length - 1 ? prevIndex + 1 : vocabList.length - 1);
  };

  const goToFirst = () => {
    setCurrentWordIndex(0);
  };

  const goToLast = () => {
    setCurrentWordIndex(vocabList.length - 1);
  };

  const handleDelayChange = (e) => {
    setDelay(Number(e.target.value));
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
    if (isAutoPlay) {
      playAudio(); // Play the audio every time `currentWordIndex` changes during AutoPlay
    }
  }, [currentWordIndex, isAutoPlay, playAudio]);

  return (
    <div className="container-fluid">
      <h1 className="vocab-title">หมวดหมู่: {selectedCategory.displayName}</h1>

      <div className="header-section">
        <label htmlFor="vocabDropdown">เลือกหมวดหมู่:</label>
        <select
          id="vocabDropdown"
          className="form-select d-inline-block"
          style={{ width: '150px' }}
          onChange={handleCategoryChange}
          value={selectedCategory.name}
        >
          {config.categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.displayName} {/* แสดงชื่อหมวดหมู่ภาษาไทย */}
            </option>
          ))}
        </select>

        <span>No. {currentWordIndex + 1}/{vocabList.length}</span>
      </div>

      <div className="vocab-display-container">
        <div className="vocab-card mb-4 shadow-sm">
          <div className="card-body">
            <h1 className="vocab-word">
              {highlightedWord}
            </h1>
            <h2 className="vocab-translation">{vocabList[currentWordIndex]?.translation}</h2>
          </div>
        </div>
      </div>

      <div className="controls">
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
    </div>
  );
};

export default Vocabulary;
