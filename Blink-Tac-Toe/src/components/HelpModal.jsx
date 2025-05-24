import "./HelpModal.css";

const HelpModal = ({ onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>How to Play</h2>
        <ul>
          <li>Each player picks an emoji category before starting.</li>
          <li>Players take turns placing emojis on the 3x3 board.</li>
          <li>Each player can have only 3 emojis on the board at a time.</li>
          <li>When placing a 4th, the oldest one vanishes — you can't reuse that cell immediately.</li>
          <li>Form a line of 3 emojis to win — horizontally, vertically, or diagonally!</li>
        </ul>
        <button onClick={onClose} className="got-it">Got it!</button>
      </div>
    </div>
  );
};

export default HelpModal;
