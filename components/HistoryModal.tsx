import React from 'react';
import { X, Trash2, Calendar, Clock, Timer, Eye, Save } from 'lucide-react';
import { SudokuSize, Grid } from '../types';

export interface HistoryItem {
  id: string;
  timestamp: number;
  duration: number;
  size: SudokuSize;
  gridSnapshot: Grid;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onRestoreHistory: (item: HistoryItem) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRestoreHistory
}) => {
  if (!isOpen) return null;

  const handleSaveLogs = async () => {
    let logContent = "Sudoku Solver - Execution History Logs\n";
    logContent += "=======================================\n\n";

    history.slice().reverse().forEach((item, index) => {
      const date = new Date(item.timestamp);
      logContent += `Entry #${history.length - index}\n`;
      logContent += `Time: ${date.toLocaleString()}\n`;
      logContent += `Grid Size: ${item.size}x${item.size}\n`;
      logContent += `Solve Duration: ${item.duration < 1 ? (item.duration * 1000).toFixed(0) + ' µs' : item.duration.toFixed(2) + ' ms'}\n`;

      logContent += `Board:\n`;
      item.gridSnapshot.forEach(row => {
        logContent += `  ${row.map(cell => cell === 0 ? '.' : cell).join(' ')}\n`;
      });

      logContent += `\n---------------------------------------\n\n`;
    });

    const blob = new Blob([logContent], { type: 'text/plain' });

    // Use File System Access API if available
    try {
      // @ts-ignore - window.showSaveFilePicker is not yet in all TS lib definitions
      if (window.showSaveFilePicker) {
        // @ts-ignore
        const handle = await window.showSaveFilePicker({
          suggestedName: 'sudoku_solver_logs.txt',
          types: [{
            description: 'Text Files',
            accept: { 'text/plain': ['.txt'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      }
    } catch (err: any) {
      // User cancelled or other error, fallback to default download if not a cancellation
      if (err.name !== 'AbortError') {
        console.error('File Save Error:', err);
      } else {
        return; // User cancelled, do nothing
      }
    }

    // Fallback for browsers without File System Access API
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sudoku_solver_logs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete all history logs?")) {
      onClearHistory();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock className="text-blue-600 dark:text-blue-500" />
            Execution History
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
              <Calendar size={48} className="mb-3 opacity-20" />
              <p>No puzzles solved yet.</p>
            </div>
          ) : (
            history.slice().reverse().map((item) => (
              <button
                key={item.id}
                onClick={() => onRestoreHistory(item)}
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between group hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all text-left"
                title="Click to view this board"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded text-[10px]">
                      {item.size}x{item.size}
                    </span>
                    <span>Solved</span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {new Date(item.timestamp).toLocaleDateString()} <span className="text-slate-400 px-1">•</span> {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-mono font-medium bg-green-50 dark:bg-green-900/10 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-900/20">
                    <Timer size={14} />
                    {item.duration < 1
                      ? `${(item.duration * 1000).toFixed(0)}µs`
                      : `${item.duration.toFixed(2)}ms`}
                  </div>
                  <Eye size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl flex gap-3">
            <button
              onClick={handleSaveLogs}
              className="flex-1 py-2.5 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors text-sm font-semibold"
            >
              <Save size={16} />
              Save Logs
            </button>
            <button
              onClick={handleClearClick}
              className="flex-1 py-2.5 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-sm font-semibold"
            >
              <Trash2 size={16} />
              Clear History Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;