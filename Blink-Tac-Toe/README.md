# 🧠 Blink Tac Toe

A fun twist on the classic Tic Tac Toe game using emojis, time-based turns, and a shrinking 3-move memory rule!

## 🚀 Features

- ✅ 2-Player local mode
- 🤖 Single-player mode with Easy, Medium (blocking), and Hard (Minimax AI) difficulties
- ⏱️ 10-second turn timer
- 🎭 Emoji categories for each player (Animals, Food, Nature, etc.)
- 🔄 Players only get 3 emojis on the board at any time — older ones disappear!
- 🎉 Winning animation with sounds
- 🧠 Help modal with game instructions
- 🎨 Animations (shake, bounce, spin) on emoji placement

---

## 🎮 How to Play

1. Select your emoji categories before starting.
2. Each player takes turns placing an emoji.
3. You only keep 3 emojis on the board — your oldest move disappears.
4. Win by aligning 3 emojis (in row, column, or diagonal) at any time.
5. If timer runs out, the move is skipped or the AI plays automatically.

---

## 🧱 Tech Stack

- React + Vite
- CSS Modules for styling and animation
- JavaScript (ES6+)
- Custom game logic for timers, AI, and memory-based rules

---

## Emoji Categories

Animals: ["🐶", "🐱", "🐵", "🐰", "🐼", "🦁", "🐸", "🐨"]
  Food: ["🍕", "🍟", "🍔", "🍩", "🍣", "🍦", "🍉", "🍫"]
  Sports: ["⚽️", "🏀", "🏈", "🎾", "⚾️", "🏐", "🥊", "🏓"]
  Faces: ["😀", "😎", "😂", "😍", "🥳", "😡", "😭", "😴"]
  Nature: ["🌲", "🌸", "🔥", "❄️", "🌈", "🌞", "🌧️", "🌻"]
  Travel: ["🚗", "✈️", "🚢", "🚀", "🗽", "🌍", "🏝️", "⛩️"]
  Objects: ["📱", "💡", "💻", "🎧", "📷", "📚", "🕹️", "⌚️"]
  Symbols: ["❤️", "💥", "💯", "✔️", "🔔", "⭐️", "❌", "⚡️"]

  ---

## 🛠️ Setup & Run Locally

1. **Clone this repo:**
   ```bash
   git clone https://github.com/yourusername/blink-tac-toe.git
   cd blink-tac-toe
