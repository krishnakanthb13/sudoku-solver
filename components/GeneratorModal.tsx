import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { SudokuSize, Difficulty } from '../types';

interface GeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (size: SudokuSize, difficulty: Difficulty) => void;
    defaultSize?: SudokuSize;
}

const GeneratorModal: React.FC<GeneratorModalProps> = ({
    isOpen,
    onClose,
    onGenerate,
    defaultSize = 6
}) => {
    const [size, setSize] = React.useState<SudokuSize>(defaultSize);
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

    // Scroll Lock (consistent with HistoryModal)
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    React.useEffect(() => {
        if (isOpen) {
            setSize(defaultSize);
        }
    }, [isOpen, defaultSize]);

    if (!isOpen) return null;

    const handleGenerate = () => {
        onGenerate(size, difficulty);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Sparkles className="text-purple-600 dark:text-purple-500" />
                        Generate Random Puzzle
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Size Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Grid Size</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setSize(6)}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${size === 6 ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                            >
                                <div className="grid grid-cols-2 gap-0.5 p-1">
                                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                                </div>
                                <span className="font-bold">6x6</span>
                            </button>
                            <button
                                onClick={() => setSize(9)}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${size === 9 ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                            >
                                <div className="grid grid-cols-3 gap-0.5 p-1">
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                </div>
                                <span className="font-bold">9x9</span>
                            </button>
                        </div>
                    </div>

                    {/* Difficulty Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Difficulty</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`
                                        py-2 px-3 rounded-lg text-sm font-medium transition-all border
                                        ${difficulty === level
                                            ? 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500 dark:border-fuchsia-500 ring-1 ring-fuchsia-500'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                        }
                                    `}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium pt-2 min-h-[1.5em]">
                            {difficulty === 'Easy' ? 'Abundant clues for a quick solve.' :
                                difficulty === 'Medium' ? 'Fewer starting numbers, more logic required.' :
                                    'Maximum empty cells for Sudoku pros.'}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={handleGenerate}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Sparkles size={20} />
                        Generate Puzzle
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GeneratorModal;
