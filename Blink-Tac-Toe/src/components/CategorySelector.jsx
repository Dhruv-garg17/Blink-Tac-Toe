import React from "react";
import "./CategorySelector.css";
const emojiSets = {
  Animals: ["🐶", "🐱", "🐵", "🐰", "🐼", "🦁", "🐸", "🐨"],
  Food: ["🍕", "🍟", "🍔", "🍩", "🍣", "🍦", "🍉", "🍫"],
  Sports: ["⚽️", "🏀", "🏈", "🎾", "⚾️", "🏐", "🥊", "🏓"],
  Faces: ["😀", "😎", "😂", "😍", "🥳", "😡", "😭", "😴"],
  Nature: ["🌲", "🌸", "🔥", "❄️", "🌈", "🌞", "🌧️", "🌻"],
  Travel: ["🚗", "✈️", "🚢", "🚀", "🗽", "🌍", "🏝️", "⛩️"],
  Objects: ["📱", "💡", "💻", "🎧", "📷", "📚", "🕹️", "⌚️"],
  Symbols: ["❤️", "💥", "💯", "✔️", "🔔", "⭐️", "❌", "⚡️"],
};

const CategorySelector = ({ categories, onSelect, onStart, singlePlayerMode }) => {
  return (
    <div>
      <h2 className="Select-Categories">Select Categories</h2>

      {/* Player 1 always visible */}
      <div>
        <p>Player 1</p>
        {Object.entries(emojiSets).map(([name, emojis]) => (
          <button
            key={name}
            onClick={() => onSelect(1, emojis)}
            disabled={
              JSON.stringify(categories[1]) === JSON.stringify(emojis) ||
              (!singlePlayerMode &&
                JSON.stringify(categories[2]) === JSON.stringify(emojis))
            }
          >
            {name}: {emojis.join(" ")}
          </button>
        ))}
      </div>

      {/* Player 2 only if two-player mode */}
      {!singlePlayerMode && (
        <div>
          <p>Player 2</p>
          {Object.entries(emojiSets).map(([name, emojis]) => (
            <button
              key={name}
              onClick={() => onSelect(2, emojis)}
              disabled={
                JSON.stringify(categories[2]) === JSON.stringify(emojis) ||
                JSON.stringify(categories[1]) === JSON.stringify(emojis)
              }
            >
              {name}: {emojis.join(" ")}
            </button>
          ))}
        </div>
      )}

      <button className="start-game"
        onClick={onStart}
        disabled={
          singlePlayerMode ? !categories[1] : !categories[1] || !categories[2]
        }
      >
        Start Game
      </button>
    </div>
  );
};

export default CategorySelector;
