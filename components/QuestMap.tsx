
import React, { useMemo } from 'react';
import { Lesson, UserProgress, LevelQuiz } from '../types.ts';
import GhanaFlag from './GhanaFlag.tsx';

interface QuestMapProps {
  lessons: Lesson[];
  quizzes: LevelQuiz[];
  user: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
  onSelectQuiz: (quiz: LevelQuiz) => void;
}

const QuestMap: React.FC<QuestMapProps> = ({ lessons, quizzes, user, onSelectLesson, onSelectQuiz }) => {
  // Optimization: Memoize regions list
  const regions = useMemo(() => Array.from(new Set(lessons.map(l => l.region))), [lessons]);

  // Optimization: Memoize the last lesson lookup
  const lastLesson = useMemo(() => 
    lessons.find(l => l.id === user.lastActiveLessonId), 
    [lessons, user.lastActiveLessonId]
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4 leading-tight flex items-center justify-center gap-3">
          The Python Champion's Journey <GhanaFlag />
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-8">Master the code, lead the way at USHERS ACADEMY. Pass quizzes to advance to new regions!</p>
        
        {lastLesson && !user.completedLessons.includes(lastLesson.id) && (
          <div className="bg-slate-900 dark:bg-slate-800 text-white p-6 rounded-[2.5rem] inline-flex items-center gap-6 shadow-2xl border-4 border-slate-800 dark:border-slate-700 animate-in zoom-in duration-500">
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Last Active Quest</p>
              <h4 className="text-lg font-black">{lastLesson.title}</h4>
            </div>
            <button 
              onClick={() => onSelectLesson(lastLesson)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 transition-all active:scale-95"
            >
              CONTINUE LEARNING 🚀
            </button>
          </div>
        )}
      </div>

      <div className="space-y-20 pb-20">
        {regions.map((region, idx) => {
          const regionLessons = lessons.filter(l => l.region === region);
          const regionQuiz = quizzes.find(q => q.levelId === region);
          const isPreviousLevelQuizDone = idx === 0 || user.completedQuizzes.includes(regions[idx-1]);
          const areAllLessonsDone = regionLessons.every(l => user.completedLessons.includes(l.id));
          const isQuizUnlocked = areAllLessonsDone && isPreviousLevelQuizDone;
          const isQuizPassed = user.completedQuizzes.includes(region);
          
          const completedCount = regionLessons.filter(l => user.completedLessons.includes(l.id)).length;
          const progressPercent = Math.round((completedCount / regionLessons.length) * 100);

          return (
            <div key={region} className={`relative transition-all duration-500 ${!isPreviousLevelQuizDone ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
                <div className="flex items-center gap-4 flex-1">
                  <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-[0.4em] bg-white dark:bg-slate-900 px-6 py-2 border-2 border-slate-100 dark:border-slate-800 rounded-full whitespace-nowrap">
                    Level {idx + 1}: {region.split(': ')[1] || region}
                  </h3>
                  <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
                </div>
                
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border-2 border-slate-50 dark:border-slate-800 self-start md:self-auto">
                   <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500" style={{ width: `${progressPercent}%` }}></div>
                   </div>
                   <span className="text-[10px] font-black text-slate-400 dark:text-slate-600">{progressPercent}%</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8 items-center">
                {regionLessons.map((lesson) => {
                  const lessonIndex = regionLessons.indexOf(lesson);
                  const isCompleted = user.completedLessons.includes(lesson.id);
                  const isInProgress = !isCompleted && user.lastActiveLessonId === lesson.id;
                  const isUnlocked = lessonIndex === 0 || user.completedLessons.includes(regionLessons[lessonIndex - 1]?.id);

                  return (
                    <button
                      key={lesson.id}
                      disabled={!isUnlocked}
                      onClick={() => onSelectLesson(lesson)}
                      className={`
                        relative group flex flex-col items-center transition-all duration-300 transform active:scale-90
                        ${isUnlocked ? 'cursor-pointer hover:-translate-y-3' : 'cursor-not-allowed opacity-40'}
                      `}
                    >
                      <div className={`
                        w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl shadow-xl border-4 transition-all relative
                        ${isCompleted 
                          ? 'bg-blue-600 border-blue-200 text-white rotate-6' 
                          : isInProgress
                            ? 'bg-orange-50 dark:bg-orange-950 border-orange-500 text-orange-600 animate-pulse border-dashed'
                            : isUnlocked 
                              ? 'bg-white dark:bg-slate-800 border-blue-500 animate-bounce-subtle' 
                              : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'}
                      `}>
                        {isCompleted ? '⭐' : isInProgress ? '👨🏾‍💻' : isUnlocked ? '🐍' : '🔒'}
                        {isInProgress && (
                           <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900 animate-ping"></div>
                        )}
                      </div>
                      <p className={`mt-4 font-black text-[11px] uppercase tracking-wider text-center max-w-[120px] leading-tight ${isUnlocked ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-700'}`}>
                        {lesson.title}
                      </p>
                    </button>
                  );
                })}

                {regionQuiz && (
                  <button
                    disabled={!isQuizUnlocked}
                    onClick={() => onSelectQuiz(regionQuiz)}
                    className={`
                      relative group flex flex-col items-center transition-all duration-300 transform active:scale-110
                      ${isQuizUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}
                    `}
                  >
                    <div className={`
                      w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-2xl border-8 transition-all
                      ${isQuizPassed 
                        ? 'bg-blue-700 border-blue-200 text-white' 
                        : isQuizUnlocked 
                          ? 'bg-orange-500 border-orange-200 text-white animate-pulse' 
                          : 'bg-slate-800 border-slate-700 text-slate-500'}
                    `}>
                      {isQuizPassed ? '🏆' : '⚔️'}
                    </div>
                    <p className={`mt-4 font-black text-[11px] uppercase tracking-wider text-center max-w-[120px] leading-tight ${isQuizUnlocked ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500 dark:text-slate-700'}`}>
                      {isQuizPassed ? 'CHAMPIONSHIP PASSED' : 'LEVEL QUIZ'}
                    </p>
                    {isQuizUnlocked && !isQuizPassed && (
                      <span className="absolute -top-3 -right-3 bg-red-600 text-[10px] px-3 py-1.5 rounded-xl text-white font-black shadow-lg animate-bounce">
                        BOSS LEVEL!
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestMap;