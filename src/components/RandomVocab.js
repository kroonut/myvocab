import React, { useState, useEffect, useRef } from 'react';
import config from '../config.json';
import './RandomVocab.css';

function RandomVocab() {
  const [randomVocabWord, setRandomVocabWord] = useState(null);
  const [isRandomAuto, setIsRandomAuto] = useState(false);
  const [randomIntervalId, setRandomIntervalId] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to control button disabling

  // ใช้ useRef เพื่อเก็บ Audio ที่กำลังเล่นอยู่
  const currentAudioRef = useRef(null);

  // Fetches a random word from the vocabulary list
  const randomVocabFetchWord = async () => {
    const category = config.categories[Math.floor(Math.random() * config.categories.length)];
    const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${category.fileName}`);
    const data = await response.json();
    const word = data[Math.floor(Math.random() * data.length)];
    setRandomVocabWord({ ...word, category });
  };

  // Handle playing the audio for the current word
  const randomVocabPlayAudio = (word) => {
    if (!word) return;

    // หยุดเสียงที่กำลังเล่นอยู่ก่อน
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    const audio = new Audio(`${process.env.PUBLIC_URL}/wav/${word.category.audioFolder}/${word.audioFile}`);
    currentAudioRef.current = audio;
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  // Handle next button click
  const randomVocabHandleNextClick = () => {
    randomVocabFetchWord(); // Fetch a new random word
  };

  // Handle auto random toggle
  const randomVocabToggleAutoRandom = () => {
    if (isRandomAuto) {
      // หยุด auto random
      clearInterval(randomIntervalId);
      setIsRandomAuto(false);
      setIsButtonDisabled(false); // เปิดใช้งานปุ่มหลังจากหยุด auto random
    } else {
      // เริ่ม auto random
      const id = setInterval(() => {
        randomVocabFetchWord(); // Fetch a new word every 3 seconds
      }, 3000); // Change word every 3 seconds
      setIsRandomAuto(true);
      setRandomIntervalId(id);
      setIsButtonDisabled(true); // ปิดใช้งานปุ่มในโหมด auto random
    }
  };

  // Fetch the first word on page load
  useEffect(() => {
    randomVocabFetchWord();
    return () => {
      if (randomIntervalId) {
        clearInterval(randomIntervalId);
      }
    };
  }, [randomIntervalId]);

  // Ensure audio is played after random word is fetched
  useEffect(() => {
    if (randomVocabWord) {
      randomVocabPlayAudio(randomVocabWord); // Play audio after new word is fetched
    }
  }, [randomVocabWord]);

  return (
    <div className="random-vocab-container">
      <div className="random-vocab-content">
        <span className="vocab-word">{randomVocabWord?.word}</span>
        <span className="vocab-translation">{randomVocabWord?.translation}</span>
      </div>
      <div className="button-group">
        {/* Speaker Button */}
        <button 
          className="speaker-button" 
          onClick={() => randomVocabPlayAudio(randomVocabWord)} 
          disabled={isButtonDisabled} // ปิดการใช้งานปุ่มเมื่ออยู่ในโหมด auto random
        >
          <i className="fas fa-volume-up"></i>
        </button>
        {/* Next Button */}
        <button 
          className="next-button" 
          onClick={randomVocabHandleNextClick} 
          disabled={isButtonDisabled} // ปิดการใช้งานปุ่มเมื่ออยู่ในโหมด auto random
        >
          <i className="fas fa-forward"></i>
        </button>
        {/* Play/Stop Button */}
        <button 
          className={`play-button ${isRandomAuto ? 'active' : ''}`} 
          onClick={randomVocabToggleAutoRandom}
        >
          <i className={isRandomAuto ? "fas fa-stop" : "fas fa-play"}></i>
        </button>
      </div>
    </div>
  );
}

export default RandomVocab;
