# Code Documentation

This document provides a technical overview of the **Sudoku Solver** architecture, core methods, and data flow.

## 🎯 Project Strategy
The primary goal of the recent updates was to transform the Sudoku Solver from a purely analytical tool into a playable game. By providing a random generator, the application becomes a self-contained Sudoku playground.

**Key Objectives:**
- **Enhance Playability**: Allow users to engage with new challenges instantly.
- **Customizable Challenge**: Cater to both beginners and experts with Easy, Medium, and Hard modes.
- **Flexible Grid Sizes**: Support 6x6 and 9x9 grids for varied session lengths.
- **Professional Branding**: Custom favicon and refined UI for a polished product feel.

## 📂 Directory Structure

### Root Directory
- **index.html**
  - **Purpose**: The main entry point of the web application.
  - **Key Features**:
    - Loads **Tailwind CSS** via a CDN for styling.
    - Sets up global styles and includes the **favicon.svg** from the `public` folder.
    - Contains the `<div id="root">` for the React application.

- **index.tsx**
  - **Purpose**: The JavaScript entry point for React.
  - **Functionality**: Finds the root element in `index.html` and renders the main `<App />` component.

- **App.tsx**
  - **Purpose**: The heart of the application acting as the "Main Controller".
  - **Key Concepts**:
    - **State Management**: Tracks the grid, game status, conflicts, and the "Solved History Logs" list.
    - **Dynamic Content**: Monitors the current grid size to update the "How to Play" instructions in real-time.
    - **History Management**: Implements `handleHistoryEntryDelete` to manage individual solve records.
    - **Reverse Chronological Order**: Ensures that the newest solves are always displayed at the top of the history modal.
    - **Integration**: Coordinates the logic between the Sudoku engine and UI components.
    - **Handlers**: `handleGenerate` takes modal output, calls the generation engine, and updates the board.
    - **Hint System**: `handleHint` solves the puzzle silently and fills the first empty cell, providing a helpful nudge without revealing the full solution.

- **types.ts**
  - **Purpose**: Centralized type definitions.
  - **Functionality**: Defines `Grid`, `SudokuSize`, `Difficulty`, and other interfaces used across the app.

- **vite.config.ts**
  - **Purpose**: Configuration for the Vite build tool.

- **run_app.bat**
  - **Purpose**: Helper script to install dependencies and start the dev server for Windows users.

### /components
*Reusable UI building blocks.*

- **SudokuCell.tsx**
  - **Purpose**: Represents a single square in the grid.
  - **Functionality**: Handles input and displays visual cues (Blue for user input, Black for initial clues, Red for errors).

- **HistoryModal.tsx**
  - **Purpose**: Pop-up for viewing and restoring past solved games.
  - **UX Enhancement**: Implements scroll lock to prevent body scrolling while modal is open.

- **GeneratorModal.tsx**
  - **Purpose**: User selection pop-up for creating new puzzles.
  - **Functionality**: 
    - Manages local state for size and difficulty selection.
    - Uses modern radio-style toggles for a premium UX.
    - Implements scroll lock to prevent body scrolling while modal is open.

### /services
*Pure logic and algorithms.*

- **sudokuSolver.ts**
  - **Purpose**: The "brain" of the app.
  - **Key Logic**:
    - **Backtracking**: Used both for solving user puzzles and generating new ones.
    - **`solveSudokuRandom`**: A variation of the solver that shuffles possible numbers (1-9) to ensure unique boards every time.
        1. Generates a full valid board.
        2. "Digs holes" by removing numbers based on difficulty (Easy: ~43 clues, Medium: ~35 clues, Hard: ~27 clues for 9x9).

---

## 🏗️ Architecture Overview
The application follows a standard **React Component Architecture** combined with a stateless **Service Layer** for mathematical logic.

### Data Flow
1. **User Interaction**: User types a number into `SudokuCell`.
2. **State Transition**: `App.tsx` updates the `grid` state.
3. **Validation**: `App.tsx` calls validation logic to check for conflicts ($row, col, box$).
4. **Solver Engine**: When "Solve" is clicked, the `grid` is passed to `sudokuSolver.ts` which returns a completed grid or null.
5. **Persistence**: Solve history is saved to `localStorage` and synchronized with the `records` state.

## 🛠️ Core Methods
| Method | Description | Location |
| :--- | :--- | :--- |
| `isValid` | Checks if a number can be placed in a cell (Row/Col/Box check). | `sudokuSolver.ts` |
| `solveSudoku` | Main backtracking engine for solving puzzles. | `sudokuSolver.ts` |
| `generateSudoku`| Creates a new puzzle by solving a random board and removing cells. | `sudokuSolver.ts` |
| `handleHistoryEntryDelete` | Manages the deletion of solve logs from state and storage. | `App.tsx` |

## 📦 Dependencies
- **React 18**: UI Library.
- **TypeScript**: Static typing for robustness.
- **Lucide React**: Iconography.
- **LocalStorage API**: For persistent history and theme settings.

---

## 🏗️ How the Solver and Generator Work

### 🔍 The Solver (Simple Terms)
The solver works like a very patient player. It picks an empty square, tries a number, and if it doesn't break any rules, it moves to the next square. If it eventually finds it can't place any number in a square, it realizes it made a mistake earlier, goes back to the previous square, and tries a different number. This "Backtracking" continues until the whole board is filled correctly.

### 🎲 The Generator (Simple Terms)
To create a new puzzle, the app first uses the solver to build a perfectly finished board from scratch using random numbers. Once it has a completed board, it begins "digging holes" by removing numbers one by one. For an **Easy** puzzle, it leaves many numbers; for a **Hard** puzzle, it removes almost everything, leaving just enough for you to solve it!
- **Ensuring Uniqueness**: The search engine uses a Fisher-Yates shuffle on the numbers 1-9 during the "Full Solve" phase, which combined with random cell removal, ensures that the same puzzle is virtually never generated twice.

---
[Return to Design Philosophy](./DESIGN_PHILOSOPHY.md)


---
*Last updated: January 2026*
