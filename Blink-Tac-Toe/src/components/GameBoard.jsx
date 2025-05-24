import { useState } from "react";
import "./GameBoard.css";
import { checkWinner } from "../utils/helpers";
import EmojiCell from "./EmojiCell";
import HelpModal from "./HelpModal"; 

const GameBoard = ({ categories, onRestart }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(1);
  const [moves, setMoves] = useState({ 1: [], 2: [] });
  const [winner, setWinner] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const getRandomEmoji = (player) => {
    const playerEmojis = categories[player] || ["❓"];

    // Emojis already used by this player on the board
    const usedEmojis = board
      .filter((cell) => cell && cell.player === player)
      .map((cell) => cell.emoji);

    // Filter out used emojis so we pick a fresh one
    const availableEmojis = playerEmojis.filter((e) => !usedEmojis.includes(e));

    // Fallback: if all emojis are used, allow reuse
    const emojiSet = availableEmojis.length > 0 ? availableEmojis : playerEmojis;

    return emojiSet[Math.floor(Math.random() * emojiSet.length)];
  };

  const handleClick = (index) => {
    if (winner || board[index]) return;

    const emoji = getRandomEmoji(turn);
    const currentMoves = [...moves[turn]];
    const newBoard = [...board];

    // Handle vanishing emoji (on 4th move)
    if (currentMoves.length === 3) {
      const [oldest] = currentMoves;
      if (oldest.index === index) return; // Cannot reuse vanished cell

      newBoard[oldest.index] = null; // Remove oldest emoji
      currentMoves.shift(); // Remove from moves
    }

    // Place new emoji
    newBoard[index] = { player: turn, emoji };
    currentMoves.push({ index, emoji });

    // Apply updates
    setBoard(newBoard);
    setMoves((prev) => ({ ...prev, [turn]: currentMoves }));

    // Check for winner
    const indices = currentMoves.map((m) => m.index);
    if (checkWinner(indices)) {
      setWinner(turn);
    } else {
      setTurn(turn === 1 ? 2 : 1);
    }
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setTurn(1);
    setMoves({ 1: [], 2: [] });
    setWinner(null);
  };

  return (
    <div className="game-container">
      <h2 className="status">
        {winner ? `🎉 Player ${winner} Wins!` : `Player ${turn}'s Turn`}
      </h2>

      <div className="board">
        {board.map((cell, i) => (
          <EmojiCell key={i} value={cell} onClick={() => handleClick(i)} />
        ))}
      </div>

      <div className="controls">
        {winner && (
          <button onClick={resetBoard} className="reset-button">
            Play Again
          </button>
        )}
        <button onClick={onRestart} className="restart-button">
          Change Emoji Categories
        </button>
        <button onClick={() => setShowHelp(true)} className="helper-button">
          Help ❓
        </button>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      
    </div>
  );
};

export default GameBoard;
