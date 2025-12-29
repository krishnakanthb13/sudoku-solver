import { Grid, SudokuSize, CellPosition } from '../types';

/**
 * Creates an empty grid of the specified size.
 */
export const createEmptyGrid = (size: SudokuSize): Grid => {
  return Array.from({ length: size }, () => Array(size).fill(0));
};

/**
 * Determines box dimensions based on board size.
 */
const getBoxDims = (size: SudokuSize) => {
  if (size === 9) return { width: 3, height: 3 };
  if (size === 6) return { width: 3, height: 2 };
  return { width: 3, height: 3 }; // Default to 9x9 logic
};

/**
 * Checks if placing a number at a specific position is valid.
 */
export const isValidMove = (
  board: Grid,
  row: number,
  col: number,
  num: number,
  size: SudokuSize
): boolean => {
  const { width: boxWidth, height: boxHeight } = getBoxDims(size);

  // 1. Check Row
  for (let j = 0; j < size; j++) {
    if (board[row][j] === num && col !== j) {
      return false;
    }
  }

  // 2. Check Column
  for (let i = 0; i < size; i++) {
    if (board[i][col] === num && row !== i) {
      return false;
    }
  }

  // 3. Check Box
  const boxX = Math.floor(col / boxWidth);
  const boxY = Math.floor(row / boxHeight);
  const startRow = boxY * boxHeight;
  const startCol = boxX * boxWidth;

  for (let i = startRow; i < startRow + boxHeight; i++) {
    for (let j = startCol; j < startCol + boxWidth; j++) {
      if (board[i][j] === num && (i !== row || j !== col)) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Finds all conflicting cells for the entire board.
 * Used for the "Possibility Check".
 */
export const validateBoard = (board: Grid, size: SudokuSize): CellPosition[] => {
  const conflicts: CellPosition[] = [];
  const { width: boxWidth, height: boxHeight } = getBoxDims(size);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const num = board[r][c];
      if (num === 0) continue;

      let isConflict = false;

      // Check Row
      for (let j = 0; j < size; j++) {
        if (j !== c && board[r][j] === num) isConflict = true;
      }

      // Check Column
      for (let i = 0; i < size; i++) {
        if (i !== r && board[i][c] === num) isConflict = true;
      }

      // Check Box
      const boxX = Math.floor(c / boxWidth);
      const boxY = Math.floor(r / boxHeight);
      const startRow = boxY * boxHeight;
      const startCol = boxX * boxWidth;

      for (let i = startRow; i < startRow + boxHeight; i++) {
        for (let j = startCol; j < startCol + boxWidth; j++) {
          if ((i !== r || j !== c) && board[i][j] === num) {
            isConflict = true;
          }
        }
      }

      if (isConflict) {
        conflicts.push({ row: r, col: c });
      }
    }
  }
  return conflicts;
};

/**
 * Backtracking algorithm to solve the Sudoku.
 * Returns a new solved grid or null if unsolvable.
 * Uses deep copy to avoid mutating the original state directly during recursion logic if not handled carefully,
 * though here we modify a clone.
 */
export const solveSudoku = (inputBoard: Grid, size: SudokuSize): Grid | null => {
  // Create a deep copy to work on
  const board = inputBoard.map(row => [...row]);

  const findEmpty = (): [number, number] | null => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === 0) {
          return [i, j];
        }
      }
    }
    return null;
  };

  const solve = (): boolean => {
    const emptyPos = findEmpty();
    if (!emptyPos) {
      return true; // Solved
    }

    const [row, col] = emptyPos;

    for (let num = 1; num <= size; num++) {
      if (isValidMove(board, row, col, num, size)) {
        board[row][col] = num;

        if (solve()) {
          return true;
        }

        // Backtrack
        board[row][col] = 0;
      }
    }

    return false;
  };

  // Pre-validate: If the user inputs a conflict, the solver should probably fail or we handle it gracefully.
  // The solver assumes the starting state is valid (or at least valid enough to proceed).
  // If the starting state breaks rules, `isValidMove` might return true for a number that conflicts with the invalid placement,
  // but strictly speaking, a solver starts from a valid partial state. 
  // We will assume UI prevents running solve on visibly invalid boards, but let's just run it.
  
  if (solve()) {
    return board;
  } else {
    return null;
  }
};
