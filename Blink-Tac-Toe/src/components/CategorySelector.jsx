const emojiSets = {
  Animals: ["🐶", "🐱", "🐵", "🐰"],
  Food: ["🍕", "🍟", "🍔", "🍩"],
  Sports: ["⚽️", "🏀", "🏈", "🎾"],
};

const CategorySelector = ({ categories, onSelect, onStart }) => {
  return (
    <div>
      <h2>Select Categories</h2>
      {[1, 2].map((player) => (
        <div key={player}>
          <p>Player {player}</p>
          {Object.entries(emojiSets).map(([name, emojis]) => (
            <button
              key={name}
              onClick={() => onSelect(player, emojis)}
              disabled={
                JSON.stringify(categories[1]) === JSON.stringify(emojis) ||
                JSON.stringify(categories[2]) === JSON.stringify(emojis)
              }
            >
              {name}: {emojis.join(" ")}
            </button>
          ))}
        </div>
      ))}
      <button onClick={onStart} disabled={!categories[1] || !categories[2]}>
        Start Game
      </button>
    </div>
  );
};

export default CategorySelector;
