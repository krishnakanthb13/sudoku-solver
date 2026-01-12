# Design Philosophy

Welcome to **Sudoku Solver**! This document outlines the rationale behind the project, the problems it solves, and the principles that guided its development.

## 🎯 Problem Statement
Sudoku puzzles can be challenging to solve and even more challenging to validate manually. Traditional paper-based Sudoku lacks real-time feedback, making it easy to commit errors that are only discovered much later. Additionally, many online solvers are either too complex or lack a clean, distraction-free environment.

## 💡 Why This Solution?
This Sudoku Solver was built to bridge the gap between a pure solver and a playable game. By combining a high-performance **backtracking algorithm** with a modern **React-based UI**, it provides:
- **Immediate Feedback**: Instant conflict detection.
- **Accessibility**: Support for multiple grid sizes (6x6 and 9x9).
- **Educational Value**: A clear implementation of a classic constraint satisfaction algorithm.

## 🎨 Design Principles
1. **Simplicity Over Complexity**: A clean, "premium" interface that focuses on the grid.
2. **Lightning Speed**: Algorithm performance optimized for sub-millisecond solving.
3. **No Placeholders**: Every feature, from the hint system to history logging, is fully functional and persists across sessions.
4. **Offline First**: All logic runs in the browser—no backend required.

## 👥 Target Users
- **Sudoku Enthusiasts**: Players looking for a fast, reliable tool to play or solve puzzles.
- **Students & Developers**: Those looking for a production-grade example of a backtracking algorithm and React/TypeScript integration.

---

## Technical Details
For developers who want to dive into the codebase:

[Open Code Documentation](./CODE_DOCUMENTATION.md)


## Features

### 1. Interactive Grid
- **Input**: Click any cell and type a number (1-9 for 9x9 grids).
- **Validation**: The app immediately highlights invalid moves. If you place a number that already exists in the same row, column, or box, it will be flagged.

### 2. Auto-Solver
- **Solve Button**: Stuck on a puzzle? Click "Solve" to instantly fill the grid with the correct solution.
- **Performance**: The solver uses advanced algorithms to crack even the hardest puzzles in milliseconds.

### 3. Hint Feature
- **Hint Button**: Need a nudge? Click the "Hint" button to reveal one correct cell from the solution.
- **How it Works**: The app solves the puzzle in the background and fills in the first empty cell for you.

### 4. Random Generator
- **New Game Button**: Click the "New" button (sparkle icon) to open the generator selection.
- **Difficulty Selection**: 
    - **Easy**: More clues for a straightforward solve.
    - **Medium**: A balanced challenge.
    - **Hard**: Minimal clues for veteran players.
- **Size Selection**: Choose between **6x6** or **9x9** using the radio-style buttons.
- **Instant Generation**: The app builds a valid, solvable board instantly based on your choices.

### 5. Solved History Logs
- **Tracking**: Every time you solve a puzzle, it's saved to your local history with professional precision ($\mu s$, ms, s).
- **Reverse Chronological Sorting**: The logs are automatically sorted to show your latest achievements at the top of the list.
- **Individual Deletion**: You can now remove specific entries from your history using the ⛔ button.
- **Restore**: Replay past solutions directly on the board.
- **Export**: Save your complete Solved History Logs to a `sudoku_solver_logs.txt` file.

### 6. Customization
- **Sizes**: Switch between standard **9x9** and easier **6x6** grids.
- **Dynamic Rules**: The "How to Play" section updates automatically based on the selected grid size to show rules for 3x3 or 2x3 regions.
- **Themes**: Toggle between Light and Dark modes.
- **Brand**: Look for our custom Sudoku Solver favicon in your browser tab!

---
[Open Code Documentation](./CODE_DOCUMENTATION.md)

