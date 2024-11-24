// src/components/Vocabulary.js
import React, { useState, useEffect } from 'react';
import config from '../config.json';
import '../styles/Vocabulary.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Vocabulary = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [vocabList, setVocabList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(config.categories[0]);
  const [delay, setDelay] = useState(3); // autoplay delay in seconds
  const [range, setRange] = useState("1-5");
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    loadVocabData(selectedCategory.fileName);
  }, [selectedCategory]);

  const loadVocabData = async (fileName) => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${fileName}`);
      const data = await response.json();
      setVocabList(data);
      setCurrentWordIndex(0);
    } catch (error) {
      console.error("Error loading vocabulary data:", error);
    }
  };

  const handleCategoryChange = (e) => {
    const category = config.categories.find(cat => cat.name === e.target.value);
    if (category) {
      setSelectedCategory(category);
      stopAutoPlay(); // Stop autoplay when changing categories
    }
  };

  const playAudio = () => {
    const currentWord = vocabList[currentWordIndex];
    if (currentWord && currentWord.audioFile && currentWord.folder) {
      const audioPath = `${process.env.PUBLIC_URL}/wav/${currentWord.folder}/${currentWord.audioFile}`;
      console.log("Playing audio from path:", audioPath);

      const audio = new Audio(audioPath);
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    } else {
      console.log("No audio file or folder specified for this vocabulary word.");
    }
  };

  const goToPrevious = () => {
    setCurrentWordIndex((prevIndex) => {
        const newIndex = prevIndex > 0 ? prevIndex - 1 : vocabList.length - 1;
        playAudio(); // Play audio for the new index
        return newIndex;
    });
  };

  const goToNext = () => {
    setCurrentWordIndex((prevIndex) => {
        const newIndex = prevIndex < vocabList.length - 1 ? prevIndex + 1 : 0;
        playAudio(); // Play audio for the new index
        return newIndex;
    });
  };

  const handleDelayChange = (e) => {
    setDelay(Number(e.target.value));
  };

  const handleRangeChange = (e) => {
    setRange(e.target.value);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlay) {
      stopAutoPlay();
    } else {
      const [start, end] = range.split('-').map(num => parseInt(num.trim(), 10) - 1);
      const id = setInterval(() => {
        setCurrentWordIndex((prevIndex) => {
          const nextIndex = prevIndex < end ? prevIndex + 1 : start;
          playAudio();
          return nextIndex;
        });
      }, delay * 1000);
      setIntervalId(id);
      setIsAutoPlay(true);
    }
  };

  const stopAutoPlay = () => {
    clearInterval(intervalId);
    setIsAutoPlay(false);
    setIntervalId(null);
  };

  useEffect(() => {
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [intervalId]);

  return (
    <div className="container my-5 text-center">
      <h1>Vocabulary List</h1>

      <div className="header-section">
        <label htmlFor="vocabDropdown">เลือกหมวดหมู่:</label>
        <select
          id="vocabDropdown"
          className="form-select d-inline-block"
          onChange={handleCategoryChange}
          value={selectedCategory.name}
          style={{ width: '120px' }}
        >
          {config.categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <span className="mx-3">ชั้น {selectedCategory.name}</span>
        <span>No. {currentWordIndex + 1}/{vocabList.length}</span>
      </div>

      {/* Main Vocabulary Display Section */}
      <div className="vocab-display mb-4">
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#FF0000' }}>
          {vocabList[currentWordIndex]?.word[0]}
          <span style={{ color: '#000' }}>{vocabList[currentWordIndex]?.word.slice(1)}</span>
        </h1>
        <h2 style={{ fontSize: '2rem' }}>{vocabList[currentWordIndex]?.translation}</h2>
      </div>

      {/* Controls Section */}
      <div className="controls d-flex justify-content-center mt-3 gap-2">
        <div>
          <label>เวลา (วินาที):</label>
          <input
            type="number"
            value={delay}
            onChange={handleDelayChange}
            className="form-control d-inline-block"
            style={{ width: '60px' }}
            min="1"
          />
        </div>
        <div>
          <label>ช่วงคำ:</label>
          <input
            type="text"
            value={range}
            onChange={handleRangeChange}
            className="form-control d-inline-block"
            style={{ width: '60px' }}
            placeholder="1-5"
          />
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={goToPrevious}>
          <i className="fas fa-angle-left"></i>
        </button>
        <button className="btn btn-outline-primary btn-sm" onClick={goToNext}>
          <i className="fas fa-angle-right"></i>
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
  );
};

export default Vocabulary;
