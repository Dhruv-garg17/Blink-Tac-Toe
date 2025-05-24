import { useState, useRef, useEffect } from "react";
import "./GameBoard.css";
import { checkWinner } from "../utils/helpers";
import EmojiCell from "./EmojiCell";
import HelpModal from "./HelpModal";

const TURN_TIME_LIMIT = 10;

const animationClasses = [
  "emoji-animate-bounce",
  "emoji-animate-spin",
  "emoji-animate-shake",
];

const getEmptyIndices = (board) =>
  board.map((c, i) => (c === null ? i : null)).filter((i) => i !== null);

const getBlockingMove = (board, player) => {
  const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const combo of WINNING_COMBOS) {
    const marks = combo.map((i) => board[i]?.player);
    const playerCount = marks.filter((p) => p === player).length;
    const emptyCount = marks.filter((p) => p == null).length;

    if (playerCount === 2 && emptyCount === 1) {
      const emptyIndex = combo.find((i) => board[i] === null);
      if (emptyIndex !== undefined && emptyIndex !== null) return emptyIndex;
    }
  }
  return null;
};

const minimaxMove = (boardState, aiPlayer, depth = 3) => {
  const scores = { 2: 10, 1: -10, tie: 0 };

  const getWinnerForBoard = (boardCheck) => {
    const WINNING_COMBOS = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const combo of WINNING_COMBOS) {
      const marks = combo.map(i => boardCheck[i]?.player);
      if (marks.every(p => p === 2)) return 2;
      if (marks.every(p => p === 1)) return 1;
    }
    if (boardCheck.every(cell => cell !== null)) return 'tie';
    return null;
  };

  const getEmptySpots = (boardCheck) =>
    boardCheck.map((c, i) => (c === null ? i : null)).filter((i) => i !== null);

  const minimax = (boardCheck, player, currentDepth) => {
    const result = getWinnerForBoard(boardCheck);
    if (result !== null) return scores[result];
    if (currentDepth === 0) return 0;

    const emptySpots = getEmptySpots(boardCheck);

    if (player === aiPlayer) {
      let maxEval = -Infinity;
      for (const idx of emptySpots) {
        const newBoard = [...boardCheck];
        newBoard[idx] = { player };
        const evalScore = minimax(newBoard, 3 - player, currentDepth - 1);
        maxEval = Math.max(maxEval, evalScore);
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const idx of emptySpots) {
        const newBoard = [...boardCheck];
        newBoard[idx] = { player };
        const evalScore = minimax(newBoard, 3 - player, currentDepth - 1);
        minEval = Math.min(minEval, evalScore);
      }
      return minEval;
    }
  };

  let bestScore = -Infinity;
  let bestMove = null;
  for (const idx of getEmptyIndices(boardState)) {
    const newBoard = [...boardState];
    newBoard[idx] = { player: aiPlayer };
    const score = minimax(newBoard, 3 - aiPlayer, depth - 1);
    if (score > bestScore) {
      bestScore = score;
      bestMove = idx;
    }
  }
  return bestMove;
};

const GameBoard = ({ categories, onRestart, singlePlayerMode }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(1);
  const [moves, setMoves] = useState({ 1: [], 2: [] });
  const [winner, setWinner] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TURN_TIME_LIMIT);
  const [lastPlacedIndex, setLastPlacedIndex] = useState(null);
  const [lastAnimation, setLastAnimation] = useState(null);

  const clickSoundRef = useRef(new Audio("/click-sound.mp3"));
  const winSoundRef = useRef(new Audio("/win-sound.mp3"));

  const getRandomEmoji = (player) => {
    const playerEmojis = categories[player] || ["🤖"];
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

  const placeMove = (index, player) => {
    if (winner || board[index]) return false;

    const emoji = getRandomEmoji(player);
    const currentMoves = [...moves[player]];
    const newBoard = [...board];

    // If player already has 3 moves, remove the oldest one (Blink Tic Tac Toe rule)
    if (currentMoves.length === 3) {
      const [oldest] = currentMoves;
      newBoard[oldest.index] = null;
      currentMoves.shift();
    }

    newBoard[index] = { player, emoji };
    currentMoves.push({ index, emoji });

    setBoard(newBoard);
    setMoves((prev) => ({ ...prev, [player]: currentMoves }));
    setLastPlacedIndex(index);
    setLastAnimation(getRandomAnimation());

    const indices = currentMoves.map((m) => m.index);
    if (checkWinner(indices)) {
      setWinner(player);
      winSoundRef.current.currentTime = 0;
      winSoundRef.current.play();
    } else {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
      setTurn(player === 1 ? 2 : 1);
      setTimeLeft(TURN_TIME_LIMIT);
    }
    return true;
  };

  const makeAIMove = () => {
    if (winner) return;

    const emptyIndices = getEmptyIndices(board);
    if (emptyIndices.length === 0) return;

    let moveIndex;


    const blockIndex = getBlockingMove(board, 1);
    if (blockIndex !== null) {
      moveIndex = blockIndex;
    } else {
      moveIndex = minimaxMove(board, 2);
      if (moveIndex === null) {
        moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    }

    placeMove(moveIndex, 2);
  };

  const handleClick = (index) => {
    if (winner || board[index]) return;

    // In single player mode, ignore clicks if it's AI's turn
    if (singlePlayerMode && turn === 2) return;

    placeMove(index, turn);
  };

  // AI Move on turn change
  useEffect(() => {
    if (winner) return;
    if (singlePlayerMode && turn === 2) {
      const aiTimeout = setTimeout(() => {
        makeAIMove();
      }, 700);
      return () => clearTimeout(aiTimeout);
    }
  }, [turn, singlePlayerMode, winner, board]);

  // Timer countdown and timeout logic
  useEffect(() => {
    if (winner) return;
    if (singlePlayerMode && turn === 2) return;

    if (timeLeft <= 0) {
      if (!singlePlayerMode) {
        const emptyIndices = getEmptyIndices(board);
        if (emptyIndices.length > 0) {
          const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          placeMove(randomIndex, turn);
        }
        setTurn(turn === 1 ? 2 : 1);
        setTimeLeft(TURN_TIME_LIMIT);
      } else {
        setTurn(2);
        setTimeLeft(TURN_TIME_LIMIT);
      }
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, turn, winner, singlePlayerMode, board]);

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setTurn(1);
    setMoves({ 1: [], 2: [] });
    setWinner(null);
    setTimeLeft(TURN_TIME_LIMIT);
    setLastPlacedIndex(null);
    setLastAnimation(null);
  };

  return (
    <div className="game-container">
      <h2 className="status">
        {winner
          ? `🎉 Player ${winner} Wins!`
          : `Player ${turn}'s Turn (${timeLeft}s left)`}
      </h2>

      <div className={`board ${singlePlayerMode && turn === 2 ? "disabled" : ""}`}>
        {board.map((cell, i) => (
          <EmojiCell
            key={i}
            value={cell}
            onClick={() => handleClick(i)}
            animationClass={i === lastPlacedIndex ? lastAnimation : ""}
          />
        ))}
        {singlePlayerMode && turn === 2 && (
          <div className="overlay">AI is thinking...</div>
        )}
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
