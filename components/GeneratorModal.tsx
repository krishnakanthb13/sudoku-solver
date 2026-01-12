import React, { useState } from 'react';
import { X, Sparkles, Grid3X3, Grid2X2 } from 'lucide-react';
import { SudokuSize, Difficulty } from '../types';

interface GeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (size: SudokuSize, difficulty: Difficulty) => void;
}

const GeneratorModal: React.FC<GeneratorModalProps> = ({
    isOpen,
    onClose,
    onGenerate
}) => {
    const [size, setSize] = useState<SudokuSize>(9);
    const [difficulty, setDifficulty] = useState<Difficulty>('Easy');

    if (!isOpen) return null;

    const handleGenerate = () => {
        onGenerate(size, difficulty);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-in zoom-in-95 duration-200">

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
                                    className={`py-2 px-1 rounded-lg text-sm font-bold transition-all ${difficulty === level
                                            ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg scale-105'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
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
