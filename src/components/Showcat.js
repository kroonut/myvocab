import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config.json';
import '../styles/Vocabulary.css';

const Showcat = () => {
  const { categoryName } = useParams();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [vocabList, setVocabList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [delay, setDelay] = useState(3);
  const [range, setRange] = useState("1-5");
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [previousIndex, setPreviousIndex] = useState(null);

  // Load Vocabulary Data
  const loadVocabData = useCallback(async (fileName) => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${fileName}`);
      if (!response.ok) throw new Error('Failed to load vocabulary data.');
      const data = await response.json();
      setVocabList(data);
      setCurrentWordIndex(0); // Reset index
    } catch (error) {
      console.error('Error loading vocabulary data:', error);
    }
  }, []);

  // Set Category and Load Data
  useEffect(() => {
    const category = config.categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (category) {
      setSelectedCategory(category);
      loadVocabData(category.fileName);
    }
  }, [categoryName, loadVocabData]);

  // Play Audio for Current Word
  const playAudio = useCallback(() => {
    const currentWord = vocabList[currentWordIndex];
    if (currentWord?.audioFile && selectedCategory) {
      const audioPath = `${process.env.PUBLIC_URL}/wav/${selectedCategory.audioFolder}/${currentWord.audioFile}`;
      const audio = new Audio(audioPath);

      audio
        .play()
        .then(() => console.log(`Playing: ${currentWord.word}`))
        .catch((error) => console.error('Error playing audio:', error));
    }
  }, [currentWordIndex, vocabList, selectedCategory]);

  // Stop Autoplay
  const stopAutoPlay = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsAutoPlay(false);
  };

  // Toggle Autoplay with Range Validation
  const toggleAutoPlay = () => {
    if (isAutoPlay) {
      stopAutoPlay();
    } else {
      // ตรวจสอบและจัดการรูปแบบช่วงคำ
      let start, end;
      const rangeParts = range.split('-').map((num) => parseInt(num.trim(), 10) - 1);

      if (rangeParts.length === 1) {
        // กรณีคำเดียว เช่น "1"
        start = end = rangeParts[0];
      } else if (rangeParts.length === 2) {
        // กรณีช่วงคำ เช่น "1-5"
        [start, end] = rangeParts;
      } else {
        alert('รูปแบบช่วงคำไม่ถูกต้อง');
        return;
      }

      // ตรวจสอบความถูกต้องของค่า start และ end
      if (
        isNaN(start) ||
        isNaN(end) ||
        start < 0 ||
        end >= vocabList.length ||
        start > end
      ) {
        alert('ช่วงคำไม่ถูกต้อง');
        return;
      }

      // ตั้งค่าดัชนีเริ่มต้นและเล่นคำแรกทันที
      setCurrentWordIndex(start);
      playAudio();

      // เริ่ม autoplay
      const id = setInterval(() => {
        if (start === end) {
          playAudio(); // เล่นคำเดิมซ้ำในกรณีคำเดียว
        } else {
          setCurrentWordIndex((prevIndex) => {
            const nextIndex = prevIndex < end ? prevIndex + 1 : start;
            return nextIndex;
          });
        }
      }, delay * 1000);

      setIntervalId(id);
      setIsAutoPlay(true);
    }
  };

  // Sync Audio Playback with Index Change
  useEffect(() => {
    if (previousIndex !== currentWordIndex) {
      playAudio();
      setPreviousIndex(currentWordIndex);
    }
  }, [currentWordIndex, playAudio, previousIndex]);

  // Navigate to Specific Index
  const goToIndex = (index) => {
    if (index >= 0 && index < vocabList.length) {
      setCurrentWordIndex(index);
    }
  };

  const handleRangeChange = (e) => {
    const rangeValue = e.target.value.trim();
    setRange(rangeValue);

    const [start] = rangeValue.split('-').map((num) => parseInt(num.trim(), 10) - 1);
    if (!isNaN(start) && start >= 0 && start < vocabList.length) {
      goToIndex(start);
    }
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
    return () => stopAutoPlay();
  }, []);

  return (
    <div className="container-fluid">
      <h1 className="vocab-title">หมวดหมู่ : {''}
      {selectedCategory?.displayName || categoryName}
      </h1>

      {/* Header Section */}
      <div className="header-section">
        <label htmlFor="vocabDropdown">เลือกหมวดหมู่:</label>
        <select
          id="vocabDropdown"
          className="form-select d-inline-block"
          onChange={(e) => {
            const category = config.categories.find(cat => cat.name === e.target.value);
            setSelectedCategory(category);
            loadVocabData(category.fileName);
          }}
          value={selectedCategory?.name || ""}
        >
          {config.categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.displayName}
            </option>
          ))}
        </select>
        <span>คำที่ {currentWordIndex + 1}/{vocabList.length}</span>
      </div>

      {vocabList.length === 0 ? (
        <p className="text-center">ไม่พบคำศัพท์ในหมวดหมู่นี้</p>
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

          {/* Controls */}
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

            {/* Navigation Buttons */}
            <div className="button-controls">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => goToIndex(0)}
              >
                <i className="fas fa-angle-double-left"></i>
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() =>
                  goToIndex(currentWordIndex > 0 ? currentWordIndex - 1 : vocabList.length - 1)
                }
              >
                <i className="fas fa-angle-left"></i>
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() =>
                  goToIndex(currentWordIndex < vocabList.length - 1 ? currentWordIndex + 1 : 0)
                }
              >
                <i className="fas fa-angle-right"></i>
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => goToIndex(vocabList.length - 1)}
              >
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
