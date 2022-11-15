//CSS
import './App.css';
//Hook
import { useCallback, useEffect, useState } from 'react';
//Data
import { wordsList } from './data/words';
//Component
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessQty = 3;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessdLetters, setGuessdLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guess, setGuess] = useState(guessQty);
  const [score, setScore] = useState(50);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = 
      categories[Math.floor(Math.random() * Object.keys(categories).length)]
    console.log(category);

    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word);

    return { word, category };
  },[words]);

  const startGame = useCallback(() => {

    clearLetterStates();
    const { word, category } = pickWordAndCategory();

    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verificarEscrita = (letter) => {
    const normalizedLetter = letter.toLowerCase();
    if (guessdLetters.includes(normalizedLetter) || 
        wrongLetters.includes(normalizedLetter)      
    ) { 
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessdLetters((actualGuessLetters) => [
        ...actualGuessLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);

      setGuess((actualGuess) => actualGuess -1)
    }
  };

  const clearLetterStates = () => {
    setGuessdLetters([]);
    setWrongLetters([]);
  }

  useEffect(() => {
    if (guess <=0) {
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guess])

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    if(guessdLetters.length === uniqueLetters.length) {
      setScore((actualScore) => (actualScore += 100));

      startGame();
    }
  }, [guessdLetters, letters, startGame]);
  
  const retry = () => {
    setScore(0);
    setGuess(guessQty);
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && 
        <Game 
          verificarEscrita={verificarEscrita} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters}
          guessdLetters={guessdLetters}
          wrongLetters={wrongLetters}
          guess={guess}
          score={score}
        />
      }
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
