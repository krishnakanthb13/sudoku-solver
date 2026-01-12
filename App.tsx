import React, { useState, useEffect, useCallback } from 'react';
import { Grid, SudokuSize, Difficulty } from './types';
import { createEmptyGrid, solveSudoku, validateBoard, generateSudoku } from './services/sudokuSolver';
import SudokuCell from './components/SudokuCell';
import HistoryModal, { HistoryItem } from './components/HistoryModal';
import GeneratorModal from './components/GeneratorModal';
import { Play, Trash2, CheckCircle2, AlertCircle, Moon, Sun, Timer, Grid3X3, History, Sparkles } from 'lucide-react';

const HISTORY_STORAGE_KEY = 'sudoku-solver-history-v2'; // Bumped version for new schema

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [size, setSize] = useState<SudokuSize>(9);

  // Grid state
  const [grid, setGrid] = useState<Grid>(createEmptyGrid(9));
  const [initialCells, setInitialCells] = useState<Set<string>>(new Set());

  // Status state
  const [status, setStatus] = useState<'idle' | 'solved' | 'unsolvable'>('idle');
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [solveDuration, setSolveDuration] = useState<number | null>(null);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Initialize Theme and History on Mount
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme !== 'light';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    // Load History
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Basic validation to ensure schema matches
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  // Theme Toggle Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Validation Effect
  useEffect(() => {
    if (grid.length !== size) return;
    const conflictList = validateBoard(grid, size);
    const conflictSet = new Set(conflictList.map(c => `${c.row}-${c.col}`));
    setConflicts(conflictSet);
  }, [grid, size]);

  const addToHistory = (duration: number, solvedGrid: Grid) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      duration: duration,
      size: size,
      gridSnapshot: solvedGrid.map(row => [...row]) // Deep copy for snapshot
    };
    const updatedHistory = [...history, newItem];
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    if (window.confirm("Load this historical result? Current board will be replaced.")) {
      // Restore state from snapshot
      setSize(item.size);
      setGrid(item.gridSnapshot); // Assuming snapshot is valid
      setInitialCells(new Set()); // History views are static/solved results, treating as calculated
      setStatus('solved');
      setSolveDuration(item.duration);
      setIsHistoryOpen(false);
    }
  };

  const resetBoard = (s: SudokuSize) => {
    setGrid(createEmptyGrid(s));
    setInitialCells(new Set());
    setStatus('idle');
    setConflicts(new Set());
    setSolveDuration(null);
  };

  const handleSizeChange = (newSize: SudokuSize) => {
    if (newSize === size) return;
    setSize(newSize);
    resetBoard(newSize);
  };

  const handleClearBoard = () => {
    // Explicit simple confirm
    if (window.confirm("Clear board? This will remove all numbers.")) {
      resetBoard(size);
    }
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    if (status === 'solved') {
      setStatus('idle');
      setSolveDuration(null);
    }

    const numVal = value === '' ? 0 : parseInt(value, 10);
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = numVal;
    setGrid(newGrid);

    const key = `${row}-${col}`;
    const newInitialCells = new Set(initialCells);
    if (numVal !== 0) {
      newInitialCells.add(key);
    } else {
      newInitialCells.delete(key);
    }
    setInitialCells(newInitialCells);
  };

  const handleGenerate = (newSize: SudokuSize, difficulty: Difficulty) => {
    setSize(newSize); // This might look redundant if we reset next, but ensures correct size for grid
    const newBoard = generateSudoku(newSize, difficulty);
    setGrid(newBoard);

    // Calculate initial fixed cells
    const initial = new Set<string>();
    for (let r = 0; r < newSize; r++) {
      for (let c = 0; c < newSize; c++) {
        if (newBoard[r][c] !== 0) {
          initial.add(`${r}-${c}`);
        }
      }
    }
    setInitialCells(initial);
    setStatus('idle');
    setConflicts(new Set());
    setSolveDuration(null);
  };

  const handleSolve = useCallback(async () => {
    if (conflicts.size > 0) {
      alert("Please fix the conflicts on the board before solving.");
      return;
    }
    if (grid.length !== size) return;

    // Small delay to allow UI render update before heavy calculation
    await new Promise(resolve => setTimeout(resolve, 50));

    const startTime = performance.now();
    const solvedGrid = solveSudoku(grid, size);
    const endTime = performance.now();

    if (solvedGrid) {
      setGrid(solvedGrid);
      setStatus('solved');
      const duration = endTime - startTime;
      setSolveDuration(duration);
      addToHistory(duration, solvedGrid);
    } else {
      setStatus('unsolvable');
      setSolveDuration(null);
    }
  }, [grid, size, conflicts, history]);

  const isCellInitial = (row: number, col: number) => {
    return initialCells.has(`${row}-${col}`);
  };

  const formatTime = (ms: number) => {
    if (ms < 1) return `${(ms * 1000).toFixed(0)} µs`;
    return `${ms.toFixed(2)} ms`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 transition-colors duration-300">

      {/* Top Bar */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-md hover:scale-105 transition-transform"
          aria-label="View History"
          title="Execution History"
        >
          <History size={20} />
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-md hover:scale-105 transition-transform"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onRestoreHistory={handleRestoreHistory}
      />

      <GeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerate={handleGenerate}
      />

      {/* Header */}
      <header className="mb-8 text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center justify-center gap-3">
          <Grid3X3 className="text-blue-600 dark:text-blue-500" size={40} />
          Sudoku Master
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          The ultimate tool for solving and validating Sudoku puzzles. Supports 6x6 and 9x9 grids with real-time conflict detection and an lightning-fast offline solving engine.
        </p>
      </header>

      {/* Controls Container */}
      <div className="w-full max-w-2xl flex flex-col gap-6 mb-8">

        {/* Main Actions Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row gap-5 items-center justify-between">

          {/* Size Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Size</span>
            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => handleSizeChange(6)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${size === 6 ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                6x6
              </button>
              <button
                onClick={() => handleSizeChange(9)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${size === 9 ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                9x9
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsGeneratorOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 font-semibold rounded-xl transition-colors"
              title="Generate New Puzzle"
            >
              <Sparkles size={18} />
              <span>New</span>
            </button>
            {/* Clear Board - Always available */}
            <button
              type="button"
              onClick={handleClearBoard}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
              title="Clear Entire Board"
            >
              <Trash2 size={18} />
              <span>Clear Board</span>
            </button>

            {/* Solve Button */}
            <button
              type="button"
              onClick={handleSolve}
              disabled={status === 'solved'}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 font-bold rounded-xl transition-all shadow-md text-white min-w-[140px]
                      ${status === 'solved'
                  ? 'bg-green-500 dark:bg-green-600 cursor-default ring-4 ring-green-500/20'
                  : 'bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95'}
                  `}
            >
              {status === 'solved' ? (
                <><CheckCircle2 size={18} /> Solved</>
              ) : (
                <><Play size={18} fill="currentColor" /> Solve</>
              )}
            </button>
          </div>
        </div>

        {/* Stats / Info Row */}
        {(status !== 'idle' || conflicts.size > 0) && (
          <div className="flex justify-center animate-in fade-in slide-in-from-top-4 duration-300">
            {status === 'solved' && solveDuration !== null && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-green-200 dark:border-green-800">
                <Timer size={16} />
                Solved in <span className="font-bold">{formatTime(solveDuration)}</span>
              </div>
            )}

            {status === 'unsolvable' && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-red-200 dark:border-red-800">
                <AlertCircle size={16} />
                Unsolvable Configuration
              </div>
            )}

            {status === 'idle' && conflicts.size > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-orange-200 dark:border-orange-800">
                <AlertCircle size={16} />
                {conflicts.size} Conflicts Detected
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid Container */}
      <div
        key={`grid-${size}-${status}`}
        className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        style={{ width: 'fit-content' }}
      >
        <div
          className="grid border-4 border-slate-800 dark:border-slate-700 bg-slate-300 dark:bg-slate-700"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            width: size === 9 ? 'min(90vw, 450px)' : 'min(90vw, 300px)',
            height: size === 9 ? 'min(90vw, 450px)' : 'min(90vw, 300px)',
            gap: '2px' // Thicker grid lines
          }}
        >
          {grid.map((row, rowIndex) => (
            row.map((cellValue, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="relative bg-white dark:bg-slate-900 h-full w-full">
                <SudokuCell
                  row={rowIndex}
                  col={colIndex}
                  value={cellValue}
                  size={size}
                  onChange={handleCellChange}
                  isInitial={isCellInitial(rowIndex, colIndex)}
                  isError={conflicts.has(`${rowIndex}-${colIndex}`)}
                  disabled={status === 'solved' && !isCellInitial(rowIndex, colIndex)}
                />
              </div>
            ))
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-400/80">
          Enter numbers to validate. Clear board to start over.
        </p>
      </div>

    </div>
  );
};

export default App;