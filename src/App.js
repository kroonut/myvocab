import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import Footer component
import Vocabulary from './components/Vocabulary';
import Showcat from './components/Showcat';
import Allvocab from './components/Allvocab';
import Allvocabcat from './components/Allvocabcat';
import Search from './components/Search';
import RandomVocab from './components/RandomVocab';
import CategoriesList from './components/CategoriesList';
import VocabCardCat from './components/VocabCardCat'; // Import VocabCardCat
import VocabQuizGame from './components/VocabQuizGame';
import Manual from './components/Manual';

function App() {
  return (
    <div id="root">
      <Navbar />
      <div className="container-fluid">
        <Routes>
          <Route
            path="/"
            element={
              <div className="home-page text-center">
                <RandomVocab />             
                <VocabCardCat /> {/* Use VocabCardCat */}
                <CategoriesList /> 

              </div>
            }
          />
          <Route path="/showcat/:categoryName" element={<Showcat />} />
          <Route path="/allvocab" element={<Allvocab />} />
          <Route path="/allvocabcat/:categoryName" element={<Allvocabcat />} />
          <Route path="/search" element={<Search />} />
          <Route path="/randomVocab" element={<RandomVocab />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/CategoriesList" element={<CategoriesList />} />
          <Route path="/VocabQuizGame" element={<VocabQuizGame />} />
          <Route path="/Manual" element={<Manual />} />
        </Routes>
      </div>
      <Footer /> {/* Add Footer here */}
    </div>
  );
}

export default App;
