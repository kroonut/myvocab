// VocabQuizGame.jsx
import React, { useState, useEffect } from 'react';
import config from '../config.json';
import './VocabQuizGame.css';

const VocabQuizGame = () => {
  const [selectedCategory, setSelectedCategory] = useState(config.categories[0]);
  const [numQuestions, setNumQuestions] = useState(10); // Default number of questions
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [vocabList, setVocabList] = useState([]);
  const [playerName, setPlayerName] = useState(''); // To store the player's name
  const [isGameStarted, setIsGameStarted] = useState(false); // To check if the game has started

  const loadVocabData = async (fileName) => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${fileName}`);
      const data = await response.json();
      setVocabList(data);
      generateQuizQuestions(data, numQuestions);
    } catch (error) {
      console.error('Error loading vocabulary data:', error);
    }
  };

  const generateQuizQuestions = (vocabList, num) => {
    const shuffled = [...vocabList].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, num);

    const questions = selected.map((vocab, index) => {
      const wrongAnswers = vocabList
        .filter((item) => item.word !== vocab.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [...wrongAnswers, vocab].sort(() => 0.5 - Math.random());
      return {
        question: index < 5 ? vocab.translation : vocab.word,
        correctAnswer: index < 5 ? vocab.word : vocab.translation,
        audioFile: vocab.audioFile,
        folder: vocab.folder,
        options: options.map((item) =>
          index < 5 ? item.word : item.translation
        ),
      };
    });

    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizFinished(false);
  };

  const handleCategoryChange = (e) => {
    const category = config.categories.find((cat) => cat.name === e.target.value);
    if (category) {
      setSelectedCategory(category);
      loadVocabData(category.fileName);
    }
  };

  const handleNumQuestionsChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumQuestions(num);
    generateQuizQuestions(vocabList, num); // Regenerate questions based on new count
  };

  const playAudio = (audioFile, folder) => {
    const audioPath = `${process.env.PUBLIC_URL}/wav/${folder}/${audioFile}`;
    const audio = new Audio(audioPath);
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  };

  const handleOptionClick = (selectedOption) => {
    if (quizQuestions[currentQuestionIndex].correctAnswer === selectedOption) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

  const startGame = () => {
    if (playerName.trim() !== '') {
      setIsGameStarted(true);
      loadVocabData(selectedCategory.fileName);
    } else {
      alert('กรุณากรอกชื่อก่อนเริ่มเกม'); // "Please enter your name before starting the game"
    }
  };

  useEffect(() => {
    if (isGameStarted) {
      loadVocabData(selectedCategory.fileName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  if (!isGameStarted) {
    return (
      <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
        <h1 className="mb-4">Welcome to Vocab Quiz Game</h1>
        <div className="mb-3 text-center">
          <label htmlFor="playerNameInput" className="form-label">
            กรอกชื่อของคุณ:
          </label>
          <input
            type="text"
            id="playerNameInput"
            className="form-control name-input"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <button className="btn btn-primary" onClick={startGame}>
          เริ่มเกม
        </button>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      {/* Dropdowns Section */}
      <div className="dropdowns-container text-center mb-4">
        <div className="d-inline-block me-3">
          <label htmlFor="categoryDropdown" className="form-label">
            เลือกประเภท:
          </label>
          <select
            id="categoryDropdown"
            className="form-select d-inline-block"
            style={{ width: '150px' }}
            onChange={handleCategoryChange}
            value={selectedCategory.name}
          >
            {config.categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.card_back_txt}
              </option>
            ))}
          </select>
        </div>
        <div className="d-inline-block">
          <label htmlFor="numQuestionsDropdown" className="form-label">
            จำนวนข้อ:
          </label>
          <select
            id="numQuestionsDropdown"
            className="form-select d-inline-block"
            style={{ width: '150px' }}
            onChange={handleNumQuestionsChange}
            value={numQuestions}
          >
            {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="card text-center w-100" style={{ maxWidth: '800px' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className="player-name">Player: {playerName}</span>
          <span className="question-number">
            ข้อ {currentQuestionIndex + 1}/{quizQuestions.length}
          </span>
          <span className="player-points">คะแนน: {score}/{quizQuestions.length}</span>
        </div>
        <div className="card-body">
          {!isQuizFinished ? (
            quizQuestions.length > 0 && (
              <div>
                <h1 className="card-title question">
                  {quizQuestions[currentQuestionIndex]?.question} = __________
                </h1>
                <div className="quiz-options">
                  {quizQuestions[currentQuestionIndex]?.options.map((option, index) => (
                    <div key={index} className="option-row">
                      <button
                        className="btn btn-primary quiz-option"
                        onClick={() => handleOptionClick(option)}
                      >
                        <h2>
                          <span className="option-label">
                            {String.fromCharCode(97 + index)}. {/* a, b, c, d */}
                          </span>
                          {option}
                        </h2>
                      </button>
                      <i
                        className="fas fa-volume-up audio-icon-right"
                        onClick={(e) => {
                          e.stopPropagation();
                          const vocab = vocabList.find((item) =>
                            item.translation === option || item.word === option
                          );
                          if (vocab) {
                            playAudio(vocab.audioFile, vocab.folder);
                          }
                        }}
                        title="Play Audio"
                      ></i>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div>
              <h2 className="card-title">ผลคะแนน: {score}/{quizQuestions.length}</h2>
              <button
                className="btn btn-success"
                onClick={() => loadVocabData(selectedCategory.fileName)}
              >
                เริ่มเกมใหม่
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabQuizGame;
