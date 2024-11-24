// src/components/Vocabulary.js
import React, { useState, useEffect } from 'react';
import config from '../config.json';
import './Vocabulary.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function Vocabulary() {
  const [currentVocab, setCurrentVocab] = useState(0);
  const [vocabList, setVocabList] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(config.categories[0].audioFolder);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [delay, setDelay] = useState(3);
  const [trackRange, setTrackRange] = useState([0, 4]);

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
    loadVocabData(config.categories[0].fileName);
  }, []);

  const playAudio = (audioFile, folder = currentFolder) => {
    if (!audioFile) return;
    const audio = new Audio(`${process.env.PUBLIC_URL}/wav/${folder}/${audioFile}`);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  const handleSelectChange = (event) => {
    const selectedCategory = config.categories.find(
      (category) => category.name === event.target.value
    );
    if (selectedCategory) {
      setCurrentFolder(selectedCategory.audioFolder);
      loadVocabData(selectedCategory.fileName);
      setCurrentVocab(0);
      setTrackRange([0, 4]);
    }
    stopAutoPlay();
  };

  const toggleAutoPlay = () => {
    if (isAutoPlay) {
      stopAutoPlay();
    } else {
      const id = setInterval(goToNext, delay * 1000);
      setIntervalId(id);
      setIsAutoPlay(true);
    }
  };

  const stopAutoPlay = () => {
    clearInterval(intervalId);
    setIsAutoPlay(false);
    setIntervalId(null);
  };

  const handleDelayChange = (event) => {
    const newDelay = Math.max(0, Number(event.target.value));
    setDelay(newDelay);

    if (isAutoPlay) {
      stopAutoPlay();
      const id = setInterval(goToNext, newDelay * 1000);
      setIntervalId(id);
    }
  };

  const goToNext = () => {
    setCurrentVocab((prev) => {
      const newIndex = prev < trackRange[1] ? prev + 1 : trackRange[0];
      playAudio(vocabList[newIndex].audioFile, currentFolder);
      return newIndex;
    });
  };

  const goToPrevious = () => {
    setCurrentVocab((prev) => {
      const newIndex = prev > trackRange[0] ? prev - 1 : trackRange[1];
      playAudio(vocabList[newIndex].audioFile, currentFolder);
      return newIndex;
    });
  };

  const handleRangeChange = (event) => {
    const rangeValue = event.target.value.split('-').map(num => parseInt(num.trim(), 10) - 1);
    if (
      rangeValue.length === 2 &&
      !isNaN(rangeValue[0]) &&
      !isNaN(rangeValue[1]) &&
      rangeValue[0] >= 0 &&
      rangeValue[1] < vocabList.length &&
      rangeValue[0] <= rangeValue[1]
    ) {
      setTrackRange(rangeValue);
      setCurrentVocab(rangeValue[0]);
    } else {
      alert("กรุณาระบุช่วงคำที่ถูกต้อง เช่น 1-10");
    }
  };

  return (

<div className="container my-5" style={{ maxWidth: '300px' }}>
  <h1 className="text-center">Vocabulary List</h1>

  <form>
    {/* Row 1: หมวดหมู่ */}
    <div className="row justify-content-center mb-3">
      <div className="col text-center">
        <div className="form-group">
          <label htmlFor="vocabDropdown" className="form-label">หมวดหมู่:</label>
          <select 
            id="vocabDropdown" 
            className="form-select mx-auto" 
            style={{ width: '100px' }} 
            onChange={handleSelectChange}
          >
            {config.categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    {/* Row 2: เวลา(วินาที) and ช่วงคำ */}
    <div className="row justify-content-center">
      {/* Column 1: เวลา(วินาที) */}
      <div className="col text-center">
        <div className="form-group">
          <label htmlFor="delayInput" className="form-label">เวลา(วินาที):</label>
          <input
            type="number"
            id="delayInput"
            className="form-control mx-auto"
            style={{ width: '80px' }}
            value={delay}
            onChange={handleDelayChange}
            min="0"
            step="0.5"
          />
        </div>
      </div>

      {/* Column 2: ช่วงคำ */}
      <div className="col text-center">
        <div className="form-group">
          <label htmlFor="trackRangeInput" className="form-label">ช่วงคำ:</label>
          <input
            type="text"
            id="trackRangeInput"
            className="form-control mx-auto"
            style={{ width: '80px' }}
            placeholder="เช่น 1-10"
            defaultValue="1-5"
            onBlur={handleRangeChange}
          />
        </div>
      </div>
    </div>
  </form>

















  







      <div className="text-center">
        <div className="card h-100 shadow-sm position-relative">
          <div className="position-absolute top-0 start-0 m-2">
            <span className="badge bg-secondary">{currentFolder === 'p1' ? 'ชั้น ป.1' : 'ชั้น ป.2'}</span>
          </div>
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-info">{currentVocab + 1}/{vocabList.length}</span>
          </div>
          
          <div className="card-body">
            <h1 className="card-title">{vocabList[currentVocab]?.word}</h1>
            <h2 className="card-subtitle mb-3 text-muted">{vocabList[currentVocab]?.translation}</h2>
          </div>
        </div>

        
        {/* Vocabulary component with small buttons that don’t stretch to text width */}
        <div className="d-flex justify-content-center mt-3">
  <div className="btn-group btn-group-sm" role="group">
    <button className="btn btn-secondary" onClick={() => setCurrentVocab(trackRange[0])}>
      <i className="fas fa-angle-double-left"></i> {/* Icon for "First" */}
    </button>
    
    <button className="btn btn-secondary" onClick={goToPrevious}>
      <i className="fas fa-angle-left"></i> {/* Icon for "Previous" */}
    </button>
    
    <button
      className="btn btn-secondary"
      onClick={() => playAudio(vocabList[currentVocab].audioFile, currentFolder)}
    >
      <i className="fas fa-play"></i> {/* Icon for "Play" */}
    </button>
    
    <button className="btn btn-secondary" onClick={goToNext}>
      <i className="fas fa-angle-right"></i> {/* Icon for "Next" */}
    </button>
    
    <button className="btn btn-secondary" onClick={() => setCurrentVocab(trackRange[1])}>
      <i className="fas fa-angle-double-right"></i> {/* Icon for "Last" */}
    </button>
    
    <button
      className={`btn ${isAutoPlay ? "btn-danger" : "btn-success"}`}
      onClick={toggleAutoPlay}
      aria-label="Toggle Auto Play"
    >
      <i className={`fas ${isAutoPlay ? "fa-stop" : "fa-play-circle"}`}></i> {/* Icon for "Auto Play"/"Stop" */}
    </button>
  </div>
</div>







      </div>
    </div>
  );
}

export default Vocabulary;
