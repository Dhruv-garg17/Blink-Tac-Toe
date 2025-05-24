import { useState } from "react";
import CategorySelector from "./components/CategorySelector";
import GameBoard from "./components/GameBoard";
import "./App.css";

const App = () => {
  const [categories, setCategories] = useState({ 1: null, 2: null });
  const [gameStarted, setGameStarted] = useState(false);

  const handleCategorySelect = (player, category) => {
    setCategories((prev) => ({ ...prev, [player]: category }));
  };

  const handleStartGame = () => {
    // Ensure both players selected different non-empty categories
    if (categories[1] && categories[2]) {
      setGameStarted(true);
    } else {
      alert("Both players must select a category to start!");
    }
  };

  const resetGame = () => {
    setCategories({ 1: null, 2: null });
    setGameStarted(false);
  };

  return (
    <div className="app">
      <h1 className="title">Blink Tac Toe 🔁</h1>

      {!gameStarted ? (
        <CategorySelector
          categories={categories}
          onSelect={handleCategorySelect}
          onStart={handleStartGame}
        />
      ) : (
        <GameBoard categories={categories} onRestart={resetGame} />
      )}
    </div>
  );
};

export default App;
