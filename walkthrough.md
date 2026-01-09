# Application Walkthrough

Welcome to **Sudoku Master**! This guide will help you understand the features of the application and how to use them effectively.

## Project Overview
Sudoku Master is a modern, web-based tool designed to help you solve, validate, and play Sudoku puzzles. It features a sleek interface with dark mode support, real-time error detection, and a powerful solving engine.

## Features

### 1. Interactive Grid
- **Input**: Click any cell and type a number (1-9 for 9x9 grids).
- **Validation**: The app immediately highlights invalid moves. If you place a number that already exists in the same row, column, or box, it will be flagged.

### 2. Auto-Solver
- **Solve Button**: Stuck on a puzzle? Click "Solve" to instantly fill the grid with the correct solution.
- **Performance**: The solver uses advanced algorithms to crack even the hardest puzzles in milliseconds.

### 3. Game History
- **Tracking**: Every time you solve a puzzle, it's saved to your local history.
- **Restore**: You can open the History menu (clock icon) to view past solutions and restore them to the board for review.
- **Export**: Save your entire history of solved puzzles to a `sudoku_solver_logs.txt` file for offline reference.

### 4. Customization
- **Sizes**: Switch between standard **9x9** and easier **6x6** grids.
- **Themes**: Toggle between Light and Dark modes for comfortable viewing at any time of day.

## Technical Details
For developers or curious users who want to understand how the code works, please check our detailed technical guide:

[Open Code Walkthrough](./codewalkthrough.md)

This technical guide covers:
- File structure explanation
- Key algorithms used (Backtracking)
- Component breakdown
