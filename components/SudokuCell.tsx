import React from 'react';
import { SudokuSize } from '../types';

interface SudokuCellProps {
  row: number;
  col: number;
  value: number;
  size: SudokuSize;
  onChange: (row: number, col: number, value: string) => void;
  isInitial: boolean;
  isError: boolean;
  disabled: boolean;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  row,
  col,
  value,
  size,
  onChange,
  isInitial,
  isError,
  disabled
}) => {
  // Border logic for visual subgrids
  const getBorderClasses = () => {
    let classes = '';
    
    // Thick borders for boxes
    // Increased to border-r-4 and border-b-4 to distinguish from the 2px grid gap
    if (size === 9) {
      if ((col + 1) % 3 === 0 && col !== 8) classes += ' border-r-4 border-r-slate-800 dark:border-r-slate-500';
      if ((row + 1) % 3 === 0 && row !== 8) classes += ' border-b-4 border-b-slate-800 dark:border-b-slate-500';
    } else {
      // 6x6 (3 wide, 2 high)
      if ((col + 1) % 3 === 0 && col !== 5) classes += ' border-r-4 border-r-slate-800 dark:border-r-slate-500';
      if ((row + 1) % 2 === 0 && row !== 5) classes += ' border-b-4 border-b-slate-800 dark:border-b-slate-500';
    }
    
    return classes;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^[1-9]$/.test(val)) {
       if (val !== '' && parseInt(val) > size) return;
       onChange(row, col, val);
    }
  };

  return (
    <div className={`w-full h-full relative ${getBorderClasses()}`}>
      <input
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value === 0 ? '' : value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-full h-full text-center text-xl md:text-2xl outline-none transition-all duration-200
          ${isInitial 
            ? 'font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800' 
            : 'text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'}
          ${isError ? '!bg-red-100 dark:!bg-red-900/40 !text-red-600 dark:!text-red-300' : ''}
          ${disabled && !isInitial ? 'cursor-default' : 'cursor-text focus:bg-blue-50 dark:focus:bg-blue-900/20'}
          ${!disabled && !isInitial ? 'hover:bg-slate-50 dark:hover:bg-slate-800/30' : ''}
        `}
      />
    </div>
  );
};

export default SudokuCell;