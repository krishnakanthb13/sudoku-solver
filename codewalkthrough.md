# Code Walkthrough

This document provides a technical overview of the codebase. It describes what each file does, making it easier for developers to understand and modify the project.

## Directory Structure

### Root Directory
- **index.html**
  - **Purpose**: The main entry point of the web application.
  - **Key Features**:
    - Loads **Tailwind CSS** via a CDN (Content Delivery Network) for styling.
    - Sets up global styles (fonts, input handling).
    - Contains the `<div id="root">` where the React application attaches itself.

- **index.tsx**
  - **Purpose**: The JavaScript entry point for React.
  - **Functionality**: Finds the root element in `index.html` and renders the main `<App />` component into it.

- **App.tsx**
  - **Purpose**: The heart of the application. It acts as the "Main Controller".
  - **Key Concepts**:
    - **State Management**: Uses `useState` to keep track of the grid numbers, game status (solved/idle), and theme (dark/light).
    - **Effect Hooks**: Uses `useEffect` to save history to local storage and update the theme automatically.
    - **Layout**: detailed JSX structure that defines the visual look of the header, controls, and grid.

- **types.ts**
  - **Purpose**: A dictionary for TypeScript.
  - **Functionality**: Defines what a "Grid" looks like (array of numbers) and what a "SudokuSize" can be (6 or 9). This helps catch errors while coding.

- **vite.config.ts**
  - **Purpose**: Configuration for the build tool (Vite).
  - **Functionality**: Tells Vite how to process React code and handle TypeScript files.

- **run_app.bat**
  - **Purpose**: A helper script for Windows users.
  - **Functionality**: Automatically installs dependencies (if missing) and starts the development server with a single double-click.

### /components
*Reusable UI building blocks.*

- **SudokuCell.tsx**
  - **Purpose**: Represents a single square in the Sudoku grid.
  - **Functionality**:
    - Handles user input (typing numbers).
    - Displays visual cues: Blue for user input, Black for initial numbers, Red for errors.

- **HistoryModal.tsx**
  - **Purpose**: A pop-up window showing past solved games.
  - **Functionality**:
    - Reads the history list passed from `App.tsx`.
    - Allows the user to restore an old board or clear the history log.

### /services
*Pure logic and algorithms (no UI).*

- **sudokuSolver.ts**
  - **Purpose**: The brain of the application.
  - **Key Algorithms**:
    - **Backtracking**: A trial-and-error method. It tries a number, moves to the next cell. If it gets stuck, it "backtracks" (goes back) and tries a different number.
    - **Validation**: Checks if a move is valid (unique in row, column, and 3x3 box).
