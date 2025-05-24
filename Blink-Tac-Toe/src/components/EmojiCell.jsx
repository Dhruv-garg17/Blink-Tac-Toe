const EmojiCell = ({ value, onClick, animationClass }) => {
  return (
    <div className="emoji-cell" onClick={onClick}>
      {value ? (
        <span className={`emoji ${animationClass || ""}`}>
          {value.emoji}
        </span>
      ) : null}
    </div>
  );
};

export default EmojiCell;
