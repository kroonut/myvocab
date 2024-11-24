// src/components/Vocabulary.js
import React, { useState, useEffect } from 'react';
import p1 from '../vocab-data/p1';
import p2 from '../vocab-data/p2';
import './Vocabulary.css';

function Vocabulary() {
  const [currentVocab, setCurrentVocab] = useState(0);
  const [vocabList, setVocabList] = useState(p1);
  const [currentFolder, setCurrentFolder] = useState('p1');
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [delay, setDelay] = useState(3);
  const [trackRange, setTrackRange] = useState([0, 4]); // เริ่มต้นที่ช่วงคำ 1-5

  const playAudio = (fileName, folder = 'p1') => {
    if (!fileName) return;
    const audio = new Audio(`${process.env.PUBLIC_URL}/wav/${folder}/${fileName}`);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      alert("ไม่สามารถเล่นไฟล์เสียงได้");
    });
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "p1") {
      setVocabList(p1);
      setCurrentFolder('p1');
      setCurrentVocab(0);
      setTrackRange([0, 4]); // รีเซ็ตช่วงคำเป็น 1-5
    } else if (selectedValue === "p2") {
      setVocabList(p2);
      setCurrentFolder('p2');
      setCurrentVocab(0);
      setTrackRange([0, 4]);
    }
    stopAutoPlay();
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

  const goToPrevious = () => {
    setCurrentVocab((prev) => {
      const newIndex = prev > trackRange[0] ? prev - 1 : trackRange[1];
      playAudio(vocabList[newIndex][2], currentFolder);
      return newIndex;
    });
  };

  const goToNext = () => {
    setCurrentVocab((prev) => {
      const newIndex = prev < trackRange[1] ? prev + 1 : trackRange[0];
      playAudio(vocabList[newIndex][2], currentFolder);
      return newIndex;
    });
  };

  const goToFirst = () => {
    setCurrentVocab(trackRange[0]);
    playAudio(vocabList[trackRange[0]][2], currentFolder);
  };

  const goToLast = () => {
    setCurrentVocab(trackRange[1]);
    playAudio(vocabList[trackRange[1]][2], currentFolder);
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

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, [intervalId]);

  return (
    <div className="container">
      <h1 className="d-flex justify-content-center align-items-center">Vocabulary List</h1>
      
      <div className="d-flex justify-content-center align-items-center mb-4 gap-3">
        <div className="d-flex flex-column" style={{ width: '150px' }}>
          <label htmlFor="vocabDropdown" className="form-label">หมวดหมู่:</label>
          <select id="vocabDropdown" className="form-select" onChange={handleSelectChange}>
            <option value="p1">1.ชั้น ป.1</option>
            <option value="p2">2.ชั้น ป.2</option>
          </select>
        </div>

        <div className="d-flex flex-column" style={{ width: '100px' }}>
          <label htmlFor="delayInput" className="form-label">เวลา(วินาที):</label>
          <input
            type="number"
            id="delayInput"
            className="form-control"
            value={delay}
            onChange={handleDelayChange}
            min="0"
            step="0.5"
          />
        </div>

        <div className="d-flex flex-column" style={{ width: '100px' }}>
          <label htmlFor="trackRangeInput" className="form-label">ช่วงคำ:</label>
          <input
            type="text"
            id="trackRangeInput"
            className="form-control"
            placeholder="เช่น 1-10"
            defaultValue="1-5"
            onBlur={handleRangeChange}
          />
        </div>
      </div>

      <div className="text-center">
        <div className="card h-100 shadow-sm position-relative">
          {/* แสดงประเภทคำศัพท์ที่มุมบนซ้ายของการ์ด */}
          <div className="position-absolute top-0 start-0 m-2">
            <span className="badge bg-secondary">{currentFolder === 'p1' ? 'ชั้น ป.1' : 'ชั้น ป.2'}</span>
          </div>
          
          {/* ย้ายลำดับไปมุมขวาบน */}
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-info">{currentVocab + 1}/{vocabList.length}</span>
          </div>
          
          <div className="card-body">
            <h1 className="card-title">{vocabList[currentVocab][0]}</h1>
            <h2 className="card-subtitle mb-3 text-muted">{vocabList[currentVocab][1]}</h2>
          </div>
        </div>

        <div className="mt-3">
          <button className="btn btn-secondary me-2" onClick={goToFirst}>
            <i className="fas fa-angle-double-left"></i>
          </button>
          <button className="btn btn-secondary me-3" onClick={goToPrevious}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <button className="btn btn-primary" onClick={() => playAudio(vocabList[currentVocab][2], currentFolder)}>
            <i className="fas fa-volume-up"></i>
          </button>
          <button className="btn btn-secondary ms-3" onClick={goToNext}>
            <i className="fas fa-arrow-right"></i>
          </button>
          <button className="btn btn-secondary ms-2" onClick={goToLast}>
            <i className="fas fa-angle-double-right"></i>
          </button>
          <button
            className={`btn ${isAutoPlay ? "btn-danger" : "btn-success"} ms-2`}
            onClick={toggleAutoPlay}
            aria-label="Toggle Auto Play"
          >
            <i className={`fas ${isAutoPlay ? "fa-stop" : "fa-play"}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Vocabulary;
