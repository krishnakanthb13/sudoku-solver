export type SudokuSize = 6 | 9;

export type Grid = number[][];

export interface CellPosition {
  row: number;
  col: number;
}

export interface ValidationResult {
  isValid: boolean;
  conflictingCells: CellPosition[];
}
