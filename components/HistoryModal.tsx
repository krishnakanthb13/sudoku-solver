import React from 'react';
import { X, Trash2, Calendar, Clock, Timer, Eye, Download, History, CircleX } from 'lucide-react';
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
  onDeleteEntry: (id: string, e: React.MouseEvent) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRestoreHistory,
  onDeleteEntry
}) => {
  // Scroll Lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const formatDuration = (ms: number) => {
    if (ms < 0.001) return "< 1 μs";
    if (ms < 1) return `${Math.round(ms * 1000)} μs`;
    if (ms < 1000) return `${ms.toFixed(2)} ms`;
    return `${(ms / 1000).toFixed(3)} s`;
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  const handleSaveLogs = async () => {
    let logContent = "Sudoku Solver - Execution History Logs\n";
    logContent += "=======================================\n\n";

    // Sort history by timestamp descending (New -> Old)
    const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

    sortedHistory.slice(0, 100).forEach((item) => {
      logContent += `Time: ${new Date(item.timestamp).toLocaleString()}\n`;
      logContent += `Grid Size: ${item.size}x${item.size}\n`;
      logContent += `Solve Duration: ${formatDuration(item.duration)}\n`;

      logContent += `Board:\n`;
      item.gridSnapshot.forEach(row => {
        logContent += `  ${row.map(cell => cell === 0 ? '.' : cell).join(' ')}\n`;
      });

      logContent += `\n---------------------------------------\n\n`;
    });

    const blob = new Blob([logContent], { type: 'text/plain' });

    try {
      if ((window as any).showSaveFilePicker) {
        const handle = await (window as any).showSaveFilePicker({
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
      if (err.name !== 'AbortError') {
        console.error('File Save Error:', err);
      } else {
        return;
      }
    }

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overscroll-y-contain"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 rounded-t-xl z-10">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" /> Solved History Logs
          </h2>
          <div className="flex gap-2">
            {history.length > 0 && (
              <>
                <button
                  onClick={handleSaveLogs}
                  className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Save Logs"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleClearClick}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Clear History"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 flex-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
              <History size={48} className="mb-3 opacity-20" />
              <p className="text-sm">No puzzles solved yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Sort history by timestamp descending (New -> Old) before mapping */}
              {[...history].sort((a, b) => b.timestamp - a.timestamp).slice(0, 100).map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all content-visibility-auto contain-intrinsic-size-[88px]"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {item.size}x{item.size}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatTime(item.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Solved in:</span>
                      <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
                        {formatDuration(item.duration)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRestoreHistory(item)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button
                      onClick={(e) => onDeleteEntry(item.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete Entry"
                    >
                      <CircleX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default HistoryModal;