# Code Walkthrough

This document provides a technical overview of the codebase. It describes what each file does, making it easier for developers to understand and modify the project.

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

- **GeneratorModal.tsx**
  - **Purpose**: User selection pop-up for creating new puzzles.
  - **Functionality**: 
    - Manages local state for size and difficulty selection.
    - Uses modern radio-style toggles for a premium UX.

### /services
*Pure logic and algorithms.*

- **sudokuSolver.ts**
  - **Purpose**: The "brain" of the app.
  - **Key Logic**:
    - **Backtracking**: Used both for solving user puzzles and generating new ones.
    - **`solveSudokuRandom`**: A variation of the solver that shuffles possible numbers (1-9) to ensure unique boards every time.
    - **`generateSudoku`**: 
        1. Generates a full valid board.
        2. "Digs holes" by removing numbers based on difficulty (Easy: ~43 clues, Medium: ~35 clues, Hard: ~27 clues for 9x9).

---
*Last updated: January 2026*

