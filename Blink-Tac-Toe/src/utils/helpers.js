export const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6],            // Diagonals
];

/**
 * Check if any winning pattern is fully included in the provided indices
 * @param {number[]} indices - Array of board indices marked by a player
 * @returns {boolean} - True if any winning pattern matches, else false
 */
export const checkWinner = (indices) => {
  return winPatterns.some((pattern) =>
    pattern.every((i) => indices.includes(i))
  );
};
