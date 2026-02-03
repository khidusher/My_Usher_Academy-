
import React from 'react';
import { UserProgress, Lesson } from '../types.ts';
import { LESSONS } from '../constants.tsx';

interface DailyPlanViewProps {
  user: UserProgress;
  onUpdateGoal: (newGoal: number) => void;
  onSelectLesson: (lesson: Lesson) => void;
}

const DailyPlanView: React.FC<DailyPlanViewProps> = ({ user, onUpdateGoal, onSelectLesson }) => {
  const progressPercent = Math.min(100, Math.round((user.todayCompletedCount / user.dailyGoal) * 100));
  
  // Find next unfinished lesson
  const nextLesson = LESSONS.find(l => !user.completedLessons.includes(l.id)) || LESSONS[0];
  
  const getMotivationalMessage = () => {
    if (user.todayCompletedCount === 0) return "Akwaaba! Let's start with just one lesson today. You can do it!";
    if (user.todayCompletedCount < user.dailyGoal) return "You're doing great kraa! Just a bit more to reach your goal.";
    return "Ei Champion! You've crushed your goal for today. Master performance! 🏆";
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Today's Mission 🧭</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">"Small steps lead to big wins, Chale."</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * progressPercent) / 100} strokeLinecap="round" className="text-[#1e73ff] transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800 dark:text-white">{progressPercent}%</span>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase">DONE</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4">Daily Goal Progress</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-6 leading-relaxed italic">
                {getMotivationalMessage()}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                   <p className="text-[10px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-widest mb-1">COMPLETED</p>
                   <p className="text-2xl font-black text-[#1e73ff]">{user.todayCompletedCount} / {user.dailyGoal}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Quest */}
          <div className="bg-[#1a1b26] p-10 rounded-[3.5rem] shadow-2xl border border-slate-800 text-white group overflow-hidden relative">
            <div className="absolute -top-10 -right-10 text-9xl opacity-5 transition-transform group-hover:rotate-12 group-hover:scale-110">🐍</div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Recommended Next Quest</p>
              <h4 className="text-3xl font-black mb-4 tracking-tight">{nextLesson.title}</h4>
              <p className="text-slate-400 mb-8 font-medium leading-relaxed max-w-md">{nextLesson.description}</p>
              <button 
                onClick={() => onSelectLesson(nextLesson)}
                className="bg-[#1e73ff] hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 flex items-center gap-3"
              >
                RESUME LEARNING <span className="text-lg">🚀</span>
              </button>
            </div>
          </div>
        </div>

        {/* Adjust Goal Card */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 tracking-tight">Adjust My Pace</h3>
            <div className="space-y-4">
              {[1, 2, 3, 5].map((g) => (
                <button
                  key={g}
                  onClick={() => onUpdateGoal(g)}
                  className={`w-full p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${
                    user.dailyGoal === g 
                    ? 'border-[#1e73ff] bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-md' 
                    : 'border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <span className={`font-black text-lg ${user.dailyGoal === g ? 'text-[#1e73ff]' : 'text-slate-400'}`}>{g} Lesson{g > 1 ? 's' : ''}</span>
                  {user.dailyGoal === g && <span className="text-xl">🎯</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Did You Know?</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
              Learning just 15 minutes a day can make you a pro in months. Don't rush kraa!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; export default DailyPlanView;