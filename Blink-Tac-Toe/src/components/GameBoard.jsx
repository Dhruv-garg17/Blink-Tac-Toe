import { useState, useRef, useEffect } from "react";
import "./GameBoard.css";
import { checkWinner } from "../utils/helpers";
import EmojiCell from "./EmojiCell";
import HelpModal from "./HelpModal";

const TURN_TIME_LIMIT = 10; // seconds

const animationClasses = [
  "emoji-animate-bounce",
  "emoji-animate-spin",
  "emoji-animate-shake",
];

const GameBoard = ({ categories, onRestart }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(1);
  const [moves, setMoves] = useState({ 1: [], 2: [] });
  const [winner, setWinner] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TURN_TIME_LIMIT);

  // Track last placed cell and its animation class
  const [lastPlacedIndex, setLastPlacedIndex] = useState(null);
  const [lastAnimation, setLastAnimation] = useState(null);

  const clickSoundRef = useRef(new Audio("/click-sound.mp3"));
  const winSoundRef = useRef(new Audio("/win-sound.mp3"));

  const getRandomEmoji = (player) => {
    const playerEmojis = categories[player] || ["❓"];
    const usedEmojis = board
      .filter((cell) => cell && cell.player === player)
      .map((cell) => cell.emoji);
    const availableEmojis = playerEmojis.filter(
      (e) => !usedEmojis.includes(e)
    );
    const emojiSet = availableEmojis.length > 0 ? availableEmojis : playerEmojis;
    return emojiSet[Math.floor(Math.random() * emojiSet.length)];
  };

  const getRandomAnimation = () => {
    return animationClasses[
      Math.floor(Math.random() * animationClasses.length)
    ];
  };

  // Function to place emoji automatically on a random empty cell
  const autoPlayMove = () => {
    if (winner) return;

    const emptyIndices = board
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx) => idx !== null);

    if (emptyIndices.length === 0) return;

    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    const emoji = getRandomEmoji(turn);
    const currentMoves = [...moves[turn]];
    const newBoard = [...board];

    if (currentMoves.length === 3) {
      const [oldest] = currentMoves;
      newBoard[oldest.index] = null;
      currentMoves.shift();
    }

    newBoard[randomIndex] = { player: turn, emoji };
    currentMoves.push({ index: randomIndex, emoji });

    setBoard(newBoard);
    setMoves((prev) => ({ ...prev, [turn]: currentMoves }));

    setLastPlacedIndex(randomIndex);
    setLastAnimation(getRandomAnimation());

    const indices = currentMoves.map((m) => m.index);
    if (checkWinner(indices)) {
      setWinner(turn);
      winSoundRef.current.currentTime = 0;
      winSoundRef.current.play();
    } else {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
      setTurn(turn === 1 ? 2 : 1);
    }
  };

  const handleClick = (index) => {
    if (winner || board[index]) return;

    const emoji = getRandomEmoji(turn);
    const currentMoves = [...moves[turn]];
    const newBoard = [...board];

    if (currentMoves.length === 3) {
      const [oldest] = currentMoves;
      if (oldest.index === index) return;
      newBoard[oldest.index] = null;
      currentMoves.shift();
    }

    newBoard[index] = { player: turn, emoji };
    currentMoves.push({ index, emoji });

    setBoard(newBoard);
    setMoves((prev) => ({ ...prev, [turn]: currentMoves }));

    setLastPlacedIndex(index);
    setLastAnimation(getRandomAnimation());

    const indices = currentMoves.map((m) => m.index);
    if (checkWinner(indices)) {
      setWinner(turn);
      winSoundRef.current.currentTime = 0;
      winSoundRef.current.play();
    } else {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
      setTurn(turn === 1 ? 2 : 1);
      setTimeLeft(TURN_TIME_LIMIT);
    }
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setTurn(1);
    setMoves({ 1: [], 2: [] });
    setWinner(null);
    setTimeLeft(TURN_TIME_LIMIT);
    setLastPlacedIndex(null);
    setLastAnimation(null);
  };

  // Timer effect
  useEffect(() => {
    if (winner) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          autoPlayMove();
          return TURN_TIME_LIMIT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [turn, winner, board]);

  return (
    <div className="game-container">
      <h2 className="status">
        {winner
          ? `🎉 Player ${winner} Wins!`
          : `Player ${turn}'s Turn (${timeLeft}s left)`}
      </h2>

      <div className="board">
        {board.map((cell, i) => (
          <EmojiCell
            key={i}
            value={cell}
            onClick={() => handleClick(i)}
            animationClass={i === lastPlacedIndex ? lastAnimation : ""}
          />
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
