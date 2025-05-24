import { useState } from "react";
import CategorySelector from "./components/CategorySelector";
import GameBoard from "./components/GameBoard";
import "./App.css";

const App = () => {
  const [categories, setCategories] = useState({ 1: null, 2: null });
  const [gameStarted, setGameStarted] = useState(false);
  const [singlePlayerMode, setSinglePlayerMode] = useState(null); // null, true or false

  const handleModeSelect = (mode) => {
    setSinglePlayerMode(mode);
    setCategories({ 1: null, 2: null }); // reset categories when mode changes
    setGameStarted(false);
  };

  const handleCategorySelect = (player, category) => {
    setCategories((prev) => ({ ...prev, [player]: category }));
  };

  const handleStartGame = () => {
    if (singlePlayerMode) {
      // single player only needs Player 1 category
      if (categories[1]) {
        setGameStarted(true);
      } else {
        alert("Player 1 must select a category!");
      }
    } else {
      // two player needs both categories
      if (categories[1] && categories[2]) {
        setGameStarted(true);
      } else {
        alert("Both players must select a category!");
      }
    }
  };

  const resetGame = () => {
    setCategories({ 1: null, 2: null });
    setGameStarted(false);
    setSinglePlayerMode(null);
  };

  return (
    <div className="app">
      <h1 className="title">Blink Tac Toe</h1>

      {!singlePlayerMode && singlePlayerMode !== false ? (
        <div>
          <h2>Select Mode</h2>
          <button onClick={() => handleModeSelect(true)} className="Single-player">Single Player (vs AI)</button>
          <button onClick={() => handleModeSelect(false)} className="multi-player">Two Player</button>
        </div>
      ) : !gameStarted ? (
        <CategorySelector
          categories={categories}
          onSelect={handleCategorySelect}
          onStart={handleStartGame}
          singlePlayerMode={singlePlayerMode}
        />
      ) : (
        <GameBoard
          categories={categories}
          onRestart={resetGame}
          singlePlayerMode={singlePlayerMode}
        />
      )}
    </div>
  );
};

export default App;
