
import React, { useState } from 'react';
import { LevelQuiz, QuizQuestion } from '../types.ts';

interface QuizViewProps {
  quiz: LevelQuiz;
  onPass: (score: number) => void;
  onFail: (score: number) => void;
  onBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, onPass, onFail, onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = quiz.questions[currentIdx];

  const handleNext = () => {
    if (selectedIdx === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
    
    setShowExplanation(true);
  };

  const proceedToNext = () => {
    setShowExplanation(false);
    setSelectedIdx(null);
    
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const finishQuiz = () => {
    const finalScore = score + (selectedIdx === currentQuestion.correctIndex ? 1 : 0);
    if (finalScore >= 6) {
      onPass(finalScore);
    } else {
      onFail(finalScore);
    }
  };

  if (isFinished) {
    const finalScore = score;
    const passed = finalScore >= 6;

    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center animate-in zoom-in duration-500">
        <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center text-6xl mb-8 shadow-2xl border-4 ${passed ? 'bg-green-500 border-green-200' : 'bg-red-500 border-red-200'}`}>
          {passed ? '🏆' : '📚'}
        </div>
        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4">{passed ? 'Champion Performance!' : 'Keep Studying, Chale!'}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xl mb-10">
          You scored <span className={`font-black text-2xl ${passed ? 'text-green-600' : 'text-red-600'}`}>{finalScore} / 10</span>.
          {passed 
            ? "You've earned your way to the next level!" 
            : "To become a Python Champion, you need at least 6 points. Review the lessons and try again!"}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={passed ? onBack : () => window.location.reload()} 
            className={`px-10 py-4 rounded-2xl font-black text-white shadow-lg transition-transform active:scale-95 ${passed ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}
          >
            {passed ? 'PROCEED TO MAP' : 'RETAKE LEVEL'}
          </button>
          {!passed && (
            <button onClick={onBack} className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700">
              BACK TO MAP
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-sm font-bold text-slate-400 dark:text-slate-600 hover:text-slate-800 dark:hover:text-white transition-colors">← Exit Quiz</button>
        <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Question {currentIdx + 1} of 10</span>
        </div>
        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(currentIdx / 10) * 100}%` }}></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8 leading-tight">{currentQuestion.question}</h3>
        
        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              disabled={showExplanation}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full p-6 rounded-2xl text-left font-bold transition-all border-2 flex items-center justify-between group
                ${selectedIdx === idx ? 'border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400' : 'border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800'}
                ${showExplanation && idx === currentQuestion.correctIndex ? 'border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400' : ''}
                ${showExplanation && selectedIdx === idx && idx !== currentQuestion.correctIndex ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400' : ''}
              `}
            >
              <span>{option}</span>
              {showExplanation && idx === currentQuestion.correctIndex && <span className="text-xl">✅</span>}
              {showExplanation && selectedIdx === idx && idx !== currentQuestion.correctIndex && <span className="text-xl">❌</span>}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="mt-8 p-6 bg-slate-900 dark:bg-slate-950 rounded-[2rem] text-white animate-in slide-in-from-bottom-4 border border-slate-700 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-2">Mentor Kofi's Explanation</p>
            <p className="font-medium text-lg italic">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          {!showExplanation ? (
            <button
              disabled={selectedIdx === null}
              onClick={handleNext}
              className="px-10 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              SUBMIT ANSWER
            </button>
          ) : (
            <button
              onClick={currentIdx < quiz.questions.length - 1 ? proceedToNext : finishQuiz}
              className="px-10 py-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-500 transition-all active:scale-95 flex items-center gap-2"
            >
              {currentIdx < quiz.questions.length - 1 ? 'NEXT QUESTION →' : 'SEE RESULTS'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;