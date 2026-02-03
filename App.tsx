
import React, { useState, useEffect } from 'react';
import { UserProgress, Lesson, Badge, LevelQuiz } from './types.ts';
import { LESSONS, BADGES, QUIZZES } from './constants.tsx';
import Layout from './components/Layout.tsx';
import QuestMap from './components/QuestMap.tsx';
import Editor from './components/Editor.tsx';
import Onboarding from './components/Onboarding.tsx';
import QuizView from './components/QuizView.tsx';
import Logo from './components/Logo.tsx';
import DailyPlanView from './components/DailyPlanView.tsx';
import PianoMelody from './components/PianoMelody.tsx';
import { initPyodide } from './services/pyodideService.ts';

const INITIAL_USER: UserProgress = {
  name: '',
  avatar: '🧑🏾‍💻',
  xp: 0,
  level: 1,
  streak: 1,
  lastActive: new Date().toISOString(),
  completedLessons: [],
  completedQuizzes: [],
  badges: [],
  autosaveCode: {},
  dailyGoal: 1,
  todayCompletedCount: 0
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('ushers_academy_user');
    const parsed = saved ? JSON.parse(saved) : INITIAL_USER;
    
    // Check for day reset
    const lastDate = new Date(parsed.lastActive).toDateString();
    const todayDate = new Date().toDateString();
    
    if (lastDate !== todayDate) {
      parsed.todayCompletedCount = 0;
      parsed.lastActive = new Date().toISOString();
    }
    
    return parsed;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('ushers_dark_mode');
    return saved ? JSON.parse(saved) : true;
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(() => {
    const saved = localStorage.getItem('ushers_music_pref');
    return saved ? JSON.parse(saved) : false;
  });

  // Automatically authenticate if we have a saved user
  const [isAuthenticated, setIsAuthenticated] = useState(!!user.name);
  const [currentView, setCurrentView] = useState<'map' | 'lesson' | 'plan' | 'profile' | 'quiz'>('map');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<LevelQuiz | null>(null);
  const [isPyodideLoaded, setIsPyodideLoaded] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (user.name) {
      localStorage.setItem('ushers_academy_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ushers_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('ushers_music_pref', JSON.stringify(isMusicPlaying));
  }, [isMusicPlaying]);

  useEffect(() => {
    if (isAuthenticated && user.lastActiveLessonId) {
      setShowWelcomeBack(true);
      const timer = setTimeout(() => setShowWelcomeBack(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user.lastActiveLessonId]);

  useEffect(() => {
    let attempts = 0;
    const checkPyodide = setInterval(async () => {
      attempts++;
      if ((window as any).loadPyodide) {
        try {
          // Pre-warm Pyodide environment
          await initPyodide();
          setIsPyodideLoaded(true);
          clearInterval(checkPyodide);
        } catch (err) {
          console.error("Pyodide Init Error:", err);
          if (attempts > 20) setLoadError(true);
        }
      } else if (attempts > 40) { // Approx 20 seconds
        setLoadError(true);
        clearInterval(checkPyodide);
      }
    }, 500);
    return () => clearInterval(checkPyodide);
  }, []);

  const handleOnboardingComplete = (userData: Partial<UserProgress>) => {
    setUser(prev => ({ ...prev, ...userData, lastActive: new Date().toISOString() }));
    setIsAuthenticated(true);
    setIsMusicPlaying(true); 
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setUser(prev => ({ ...prev, lastActiveLessonId: lesson.id }));
    setCurrentView('lesson');
  };

  const handleCodeChange = (newCode: string) => {
    if (activeLesson) {
      setUser(prev => ({
        ...prev,
        autosaveCode: {
          ...prev.autosaveCode,
          [activeLesson.id]: newCode
        }
      }));
    }
  };

  const handleSelectQuiz = (quiz: LevelQuiz) => {
    setActiveQuiz(quiz);
    setCurrentView('quiz');
  };

  const handleLessonSuccess = () => {
    if (!activeLesson) return;

    const isFirstTime = !user.completedLessons.includes(activeLesson.id);
    setUser(prev => ({
      ...prev,
      xp: isFirstTime ? prev.xp + activeLesson.xp : prev.xp,
      completedLessons: isFirstTime ? [...prev.completedLessons, activeLesson.id] : prev.completedLessons,
      todayCompletedCount: prev.todayCompletedCount + 1,
      lastActive: new Date().toISOString()
    }));
    
    setTimeout(() => {
      setCurrentView('map');
      setActiveLesson(null);
    }, 2000);
  };

  const handleQuizPass = (score: number) => {
    if (!activeQuiz) return;
    const isFirstTime = !user.completedQuizzes.includes(activeQuiz.levelId);
    if (isFirstTime) {
      setUser(prev => ({
        ...prev,
        xp: prev.xp + 200, 
        completedQuizzes: [...prev.completedQuizzes, activeQuiz.levelId],
        level: prev.level + 1
      }));
    }
    setCurrentView('map');
    setActiveQuiz(null);
  };

  const updateGoal = (newGoal: number) => {
    setUser(prev => ({ ...prev, dailyGoal: newGoal }));
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMusic = () => setIsMusicPlaying(!isMusicPlaying);

  if (!isPyodideLoaded) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-8 text-center transition-colors duration-500">
        <Logo size="xl" className="mb-12 animate-pulse" />
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {loadError ? "Connection Trouble" : "Initializing USHERS ACADEMY..."}
          </h1>
          <p className="text-slate-400 dark:text-slate-500 max-w-sm mx-auto font-medium italic">
            {loadError 
              ? "Chale, the network is slow or the workspace failed to load. Try refreshing your browser."
              : "\"Chale, we are setting up your Python workspace. Please wait a moment.\""}
          </p>
        </div>
        {!loadError ? (
          <div className="mt-12 w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-[#1e73ff] animate-pulse w-3/4 shadow-[0_0_15px_rgba(30,115,255,0.4)]"></div>
          </div>
        ) : (
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 transition-all"
          >
            REFRESH PAGE 🔄
          </button>
        )}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <PianoMelody isPlaying={isMusicPlaying} />
        <Onboarding 
          onComplete={handleOnboardingComplete} 
          existingUser={user.name ? user : undefined} 
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          isMusicPlaying={isMusicPlaying}
          toggleMusic={toggleMusic}
        />
      </>
    );
  }

  return (
    <Layout 
      user={user} 
      onNavigate={setCurrentView} 
      onLogout={() => {
        setIsAuthenticated(false);
        // We don't clear the user, just log out
      }} 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode}
      isMusicPlaying={isMusicPlaying}
      toggleMusic={toggleMusic}
    >
      <PianoMelody isPlaying={isMusicPlaying} />
      {showWelcomeBack && user.lastActiveLessonId && (
        <div className="fixed bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="bg-slate-900 dark:bg-slate-800 text-white p-5 rounded-[2rem] shadow-2xl border border-slate-700 dark:border-slate-600 flex items-center gap-5">
            <span className="text-2xl">👋</span>
            <div className="flex-1 mr-4">
              <p className="font-bold text-sm">Welcome back, {user.name}!</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Continue your last quest?</p>
            </div>
            <button 
              onClick={() => {
                const lesson = LESSONS.find(l => l.id === user.lastActiveLessonId);
                if (lesson) handleSelectLesson(lesson);
                setShowWelcomeBack(false);
              }}
              className="bg-[#1e73ff] hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95"
            >
              RESUME 🚀
            </button>
            <button onClick={() => setShowWelcomeBack(false)} className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}

      {currentView === 'map' && (
        <QuestMap 
          lessons={LESSONS} 
          user={user} 
          onSelectLesson={handleSelectLesson} 
          onSelectQuiz={handleSelectQuiz}
          quizzes={QUIZZES}
        />
      )}

      {currentView === 'quiz' && activeQuiz && (
        <QuizView 
          quiz={activeQuiz} 
          onPass={handleQuizPass} 
          onFail={() => setCurrentView('map')} 
          onBack={() => setCurrentView('map')}
        />
      )}

      {currentView === 'plan' && (
        <DailyPlanView user={user} onUpdateGoal={updateGoal} onSelectLesson={handleSelectLesson} />
      )}

      {currentView === 'lesson' && activeLesson && (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 py-4 h-[calc(100vh-140px)]">
          <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
            <button 
              onClick={() => setCurrentView('map')}
              className="text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-[#1e73ff] transition-colors flex items-center gap-2 mb-4 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Map
            </button>
            
            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-[#1e73ff] dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {activeLesson.region}
                </span>
              </div>
              
              <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-6 leading-tight tracking-tight">{activeLesson.title}</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none mb-10">
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {activeLesson.concept}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 mb-8 relative group overflow-hidden">
                <pre className="text-lg font-mono text-[#1e73ff] dark:text-blue-400 bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-white dark:border-slate-800">
                  {activeLesson.example}
                </pre>
              </div>

              <div className="p-8 bg-orange-50 dark:bg-orange-950/20 border-4 border-orange-100 dark:border-orange-900/30 rounded-[2.5rem] shadow-inner">
                <h4 className="text-xs font-black text-orange-800 dark:text-orange-400 uppercase tracking-[0.2em] mb-3">Active Quest</h4>
                <p className="text-orange-900 dark:text-orange-200 text-xl font-bold leading-tight">{activeLesson.challenge}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 lg:h-full min-h-[500px]">
            <Editor 
              initialCode={user.autosaveCode[activeLesson.id] || activeLesson.initialCode}
              onSuccess={handleLessonSuccess}
              onCodeChange={handleCodeChange}
              challenge={activeLesson.challenge}
              testCases={activeLesson.testCases}
              userName={user.name}
              solution={activeLesson.solution}
            />
          </div>
        </div>
      )}

      {currentView === 'profile' && (
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-center gap-16 border border-slate-100 dark:border-slate-800">
            <div className="relative group">
              <div className="text-9xl bg-slate-50 dark:bg-slate-800 w-52 h-52 rounded-[3.5rem] flex items-center justify-center shadow-inner border-4 border-white dark:border-slate-700 transition-transform group-hover:rotate-12 duration-500">
                {user.avatar}
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#1e73ff] text-white font-black px-6 py-3 rounded-2xl text-2xl shadow-xl border-4 border-white dark:border-slate-900">
                Lv. {user.level}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-6xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{user.name}</h2>
              <p className="text-[#1e73ff] dark:text-blue-400 font-black uppercase tracking-[0.4em] mb-10 text-sm">Official Python Champion</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-[2.5rem] border-2 border-orange-100 dark:border-orange-900/30 text-center shadow-sm">
                  <p className="text-[10px] font-black text-orange-400 dark:text-orange-600 uppercase tracking-widest mb-1">STREAK</p>
                  <p className="text-4xl font-black text-orange-600 dark:text-orange-500">🔥 {user.streak}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-[2.5rem] border-2 border-blue-100 dark:border-blue-900/30 text-center shadow-sm">
                  <p className="text-[10px] font-black text-blue-400 dark:text-blue-600 uppercase tracking-widest mb-1">TOTAL XP</p>
                  <p className="text-4xl font-black text-[#1e73ff] dark:text-blue-400">✨ {user.xp}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-700 text-center shadow-sm col-span-2 md:col-span-1">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">GOAL</p>
                  <p className="text-4xl font-black text-slate-600 dark:text-slate-400">🎯 {user.dailyGoal}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-5">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 p-1 shadow-inner">
                  <div className="bg-[#1e73ff] dark:bg-blue-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(30,115,255,0.3)]" style={{ width: `${(user.completedLessons.length / LESSONS.length) * 100}%` }}></div>
                </div>
                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex justify-between">
                  <span>Journey Progress</span>
                  <span>{Math.round((user.completedLessons.length / LESSONS.length) * 100)}% Complete</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;