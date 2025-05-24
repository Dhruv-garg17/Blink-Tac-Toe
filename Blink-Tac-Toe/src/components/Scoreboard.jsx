const ScoreBoard = ({ scores }) => {
  return (
    <div>
      <h3>Score</h3>
      <p>Player 1: {scores[1]}</p>
      <p>Player 2: {scores[2]}</p>
    </div>
  );
};

export default ScoreBoard;
