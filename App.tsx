import React, { useState, useEffect, useCallback } from 'react';
import { Grid, SudokuSize, Difficulty } from './types';
import { createEmptyGrid, solveSudoku, validateBoard, generateSudoku } from './services/sudokuSolver';
import SudokuCell from './components/SudokuCell';
import HistoryModal, { HistoryItem } from './components/HistoryModal';
import GeneratorModal from './components/GeneratorModal';
import { Play, Trash2, CheckCircle, AlertCircle, Moon, Sun, Timer, Grid3X3, History, Sparkles, RotateCcw, HelpCircle, Info } from 'lucide-react';

const HISTORY_STORAGE_KEY = 'sudoku-solver-history-v2'; // Bumped version for new schema

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage or fallback to system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [size, setSize] = useState<SudokuSize>(9);

  // Grid state
  const [grid, setGrid] = useState<Grid>(createEmptyGrid(9));
  const [initialCells, setInitialCells] = useState<Set<string>>(new Set());

  // Status state
  const [status, setStatus] = useState<'idle' | 'solved' | 'unsolvable'>('idle');
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [solveDuration, setSolveDuration] = useState<number | null>(null);
  const [isBoardSolvable, setIsBoardSolvable] = useState(true);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Initialize History on Mount
  useEffect(() => {
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

  // Dynamic Solvability Check
  useEffect(() => {
    const timer = setTimeout(() => {
      const solution = solveSudoku(grid, size);
      setIsBoardSolvable(!!solution);
    }, 100);
    return () => clearTimeout(timer);
  }, [grid, size]);

  const addToHistory = (duration: number, solvedGrid: Grid) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      duration: duration,
      size: size,
      gridSnapshot: solvedGrid.map(row => [...row]) // Deep copy for snapshot
    };
    const updatedHistory = [newItem, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  const handleHistoryEntryDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this entry?")) {
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    }
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

  const handleHint = () => {
    if (conflicts.size > 0) {
      alert("Please fix conflicts before getting a hint.");
      return;
    }
    const solution = solveSudoku(grid, size);
    if (!solution) {
      alert("This puzzle seems unsolvable.");
      return;
    }

    // Find first empty cell and fill it from solution
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === 0) {
          handleCellChange(r, c, solution[r][c].toString());
          return;
        }
      }
    }
    alert("Board is already complete!");
  };

  const isCellInitial = (row: number, col: number) => {
    return initialCells.has(`${row}-${col}`);
  };

  const formatTime = (ms: number) => {
    if (ms < 0.001) return "< 1 μs";
    if (ms < 1) return `${Math.round(ms * 1000)} μs`;
    if (ms < 1000) return `${ms.toFixed(2)} ms`;
    return `${(ms / 1000).toFixed(3)} s`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col items-center py-8 px-4 transition-colors duration-200 relative">

      {/* Top Bar - Keeping styles consistent */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          aria-label="View History"
          title="Execution History"
        >
          <History size={20} />
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
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
        onDeleteEntry={handleHistoryEntryDelete}
      />

      <GeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerate={handleGenerate}
        defaultSize={size}
      />

      {/* Header */}
      <header className="relative backdrop-blur-md bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-white/10 shadow-xl rounded-2xl p-6 mb-6 text-center max-w-2xl w-full mx-auto">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 mb-3">
            <Grid3X3 className="text-blue-600 dark:text-blue-500 w-10 h-10" />
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">
              Sudoku Solver
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            The ultimate tool for solving and validating Sudoku puzzles.
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center items-start">

        {/* Left Column: Board */}
        <div className="flex-1 w-full flex flex-col items-center max-w-[500px] mx-auto lg:mx-0">
          {status === 'solved' && solveDuration !== null && (
            <div className="w-full mb-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2 animate-in fade-in text-sm">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <p>
                <span className="font-semibold">Solved</span> in {formatTime(solveDuration)}
              </p>
            </div>
          )}
          <div
            key={`grid-${size}-${status}`}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            style={{ width: 'fit-content' }}
          >
            <div
              className="grid border-4 border-slate-800 dark:border-slate-700 bg-slate-300 dark:bg-slate-700"
              style={{
                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                width: size === 9 ? 'min(90vw, 500px)' : 'min(90vw, 330px)',
                height: size === 9 ? 'min(90vw, 500px)' : 'min(90vw, 330px)',
                gap: '2px'
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
        </div>

        {/* Right Column: Controls */}
        <div className="w-full max-w-[500px] lg:max-w-none lg:w-96 flex flex-col gap-4 mx-auto lg:mx-0">

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Play className="w-5 h-5" /> Game Controls
            </h2>



            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSolve}
                disabled={status === 'solved'}
                className={`col-span-2 flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg transition-all shadow-sm
                  ${status === 'solved'
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]'
                  }`}
              >
                {status === 'solved' ? <><CheckCircle className="w-5 h-5" /> Solved</> : <><Sparkles className="w-5 h-5" /> Auto Solve</>}
              </button>

              <button
                onClick={() => setIsGeneratorOpen(true)}
                className="flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-200 py-3 px-4 rounded-lg font-medium transition-colors border border-purple-200 dark:border-purple-800/50 active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5" /> New
              </button>

              <button
                onClick={handleClearBoard}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 px-4 rounded-lg font-medium transition-colors border border-slate-200 dark:border-slate-700 active:scale-[0.98]"
              >
                <RotateCcw className="w-5 h-5" /> Reset
              </button>
            </div>

            {/* Hint Button (Standardized placement) */}
            <button
              onClick={handleHint}
              disabled={status === 'solved'}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 py-3 px-4 rounded-lg font-medium transition-colors border border-amber-200 dark:border-amber-800/50 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <HelpCircle className="w-5 h-5" /> Hint
            </button>

            {/* Status Display moved inside card */}
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center animate-in fade-in">
              {conflicts.size > 0 ? (
                <span className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center justify-center gap-2 animate-pulse">
                  <Info className="w-4 h-4" /> {conflicts.size} conflicts detected!
                </span>
              ) : !isBoardSolvable ? (
                <span className="text-orange-600 dark:text-orange-400 text-sm font-medium flex items-center justify-center gap-2">
                  <Info className="w-4 h-4" /> Board Layout is Unsolvable
                </span>
              ) : status === 'solved' ? (
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Solved
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Board is valid
                </span>
              )}
            </div>

            {/* Size Selector (Moved below Status Display) */}
            <div className="flex items-center justify-between mt-3 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 pl-2">Grid Size</span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleSizeChange(6)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${size === 6 ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  6x6
                </button>
                <button
                  onClick={() => handleSizeChange(9)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${size === 9 ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  9x9
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 text-center">
            <p>Enter numbers to validate. Clear board to start over.</p>
          </div>

        </div>
      </div>

      <footer className="mt-8 mb-6 text-center space-y-6 max-w-2xl mx-auto px-4">
        <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-center gap-2">
            How to Play
          </h3>
          <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
            {size === 9 ? (
              <>
                <li>Fill every row, column, and 3x3 region with numbers 1 to 9.</li>
                <li>No number can repeat within the same row, column, or region.</li>
              </>
            ) : (
              <>
                <li>Fill every row, column, and 2x3 region with numbers 1 to 6.</li>
                <li>No number can repeat within the same row, column, or region.</li>
              </>
            )}
          </ul>
        </div>
        <div className="text-slate-400 dark:text-slate-500 text-xs font-medium animate-pulse footer-glow-green">
          Built with 🧠, ☕ and 🤖 AI by Krishna Kanth B
        </div>
      </footer>

    </div>
  );
};

export default App;