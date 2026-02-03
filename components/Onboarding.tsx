
import React, { useState } from 'react';
import { UserProgress } from '../types.ts';
import Logo from './Logo.tsx';
import GhanaFlag from './GhanaFlag.tsx';

interface OnboardingProps {
  onComplete: (userData: Partial<UserProgress>) => void;
  existingUser?: UserProgress;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
}

const AVATARS = [
  '🧑🏾‍💻', '👩🏾‍💻', '👨🏾‍🏫', '👩🏾‍🏫', '👨🏾‍🎓', '👩🏾‍🎓', '👨🏾‍🔬', '👩🏾‍🔬',
  '😎', '🤓', '🤩', '🧐', '😊', '🥳', '🤔', '🦾',
  '🤴🏾', '👸🏾', '🧔🏾', '👩🏾‍🦱', '👨🏾‍🦱', '👩🏾‍🦰', '👨🏾‍🦳', '👵🏾',
  '🦸🏾‍♂️', '🦸🏾‍♀️', '🥷🏾', '🧑🏾‍🚀', '🦁', '🦅', '🐍', '🥁'
];

const GOALS = [
  { label: 'Relaxed', value: 1, icon: '☕', desc: '1 Lesson a day' },
  { label: 'Steady', value: 2, icon: '👟', desc: '2 Lessons a day' },
  { label: 'Champion', value: 3, icon: '🏆', desc: '3+ Lessons a day' },
];

const Auth: React.FC<OnboardingProps> = ({ onComplete, existingUser, darkMode, toggleDarkMode, isMusicPlaying, toggleMusic }) => {
  const [stage, setStage] = useState<'welcome' | 'auth' | 'goal'>(existingUser ? 'auth' : 'welcome');
  const [hasAgreed, setHasAgreed] = useState(false);
  const [showTCModal, setShowTCModal] = useState(false);
  const [isLogin, setIsLogin] = useState(!!existingUser);
  const [name, setName] = useState(existingUser?.name || '');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [selectedGoal, setSelectedGoal] = useState(1);
  const [error, setError] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (existingUser && existingUser.password === password) {
        onComplete(existingUser);
      } else {
        setError("Incorrect password. Please try again, Chale!");
      }
    } else {
      if (name.trim().length < 2) {
        setError("Please enter a valid Champion Name.");
        return;
      }
      if (password.length < 4) {
        setError("Security first! Password must be at least 4 characters.");
        return;
      }
      setStage('goal');
    }
  };

  const handleGoalSubmit = () => {
    onComplete({ 
      name: name.trim(), 
      password, 
      avatar: selectedAvatar, 
      dailyGoal: selectedGoal,
      todayCompletedCount: 0
    });
  };

  if (stage === 'welcome') {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 transition-colors duration-500">
        <div className="absolute top-8 right-8 flex gap-3">
           <button onClick={toggleMusic} className={`p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl shadow-sm border border-white/10 transition-all active:scale-95 ${isMusicPlaying ? 'animate-pulse' : ''}`}>
             {isMusicPlaying ? '🔊' : '🔇'}
           </button>
           <button onClick={toggleDarkMode} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl shadow-sm border border-white/10 transition-all active:scale-95">
             {darkMode ? '☀️' : '🌙'}
           </button>
        </div>

        <div className="max-w-md w-full text-center space-y-12 animate-in fade-in zoom-in duration-700">
          <div className="flex flex-col items-center space-y-4">
            <Logo size="xl" iconOnly className="animate-bounce-subtle" darkMode={true} />
            <h1 className="text-4xl font-black text-[#1e73ff] uppercase tracking-tighter drop-shadow-lg">USHERS ACADEMY</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white tracking-tight flex items-center justify-center gap-4">
              Akwaaba! <GhanaFlag size="w-10 h-7" className="shadow-xl" />
            </h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed px-4">
              Welcome to USHERS ACADEMY's premier Python learning quest. Ready to become a champion?
            </p>
          </div>

          <div className="pt-8 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <label className="flex items-center justify-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={hasAgreed}
                  onChange={(e) => setHasAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-slate-700 text-[#1e73ff] focus:ring-[#1e73ff] transition-all bg-transparent checked:bg-[#1e73ff]"
                />
                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                  I agree to the <button onClick={() => setShowTCModal(true)} className="text-[#1e73ff] underline decoration-2 underline-offset-4 hover:text-blue-400 transition-colors">Terms & Conditions</button>
                </span>
              </label>
            </div>

            <button
              disabled={!hasAgreed}
              onClick={() => setStage('auth')}
              className={`w-full py-5 rounded-2xl text-lg font-black transition-all shadow-2xl active:scale-[0.98] ${
                hasAgreed 
                ? 'bg-[#1e73ff] text-white shadow-blue-500/20 hover:bg-blue-600' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              CONTINUE 🚀
            </button>
          </div>
        </div>

        {/* T&C Modal */}
        {showTCModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/10 max-w-lg w-full rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                   Terms & Conditions <span className="text-xl">📜</span>
                </h3>
                <button 
                  onClick={() => setShowTCModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="prose prose-invert">
                <p className="text-lg text-slate-300 font-medium leading-relaxed italic">
                  "At USHERS ACADEMY, learning is a journey, not a race. Make mistakes, try again, and keep showing up — every step forward counts."
                </p>
                <p className="text-lg text-slate-300 font-medium leading-relaxed mt-4">
                  "By using this platform, you agree to learn with curiosity, consistency, and confidence. We’re here to support you as you grow your skills and unlock your potential 🚀"
                </p>
              </div>
              <button 
                onClick={() => setShowTCModal(false)}
                className="w-full mt-10 bg-[#1e73ff] text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-500/10"
              >
                I UNDERSTAND CHALE
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (stage === 'goal') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-500">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">🎯</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Set Your Daily Goal</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">"Chale, consistency is the key to mastery!"</p>
          </div>
          
          <div className="space-y-4 mb-10">
            {GOALS.map((g) => (
              <button
                key={g.value}
                onClick={() => setSelectedGoal(g.value)}
                className={`w-full p-6 rounded-3xl border-2 text-left flex items-center gap-5 transition-all ${
                  selectedGoal === g.value 
                  ? 'border-[#1e73ff] bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-lg' 
                  : 'border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:border-slate-200'
                }`}
              >
                <span className="text-4xl">{g.icon}</span>
                <div>
                  <h4 className={`font-black uppercase text-xs tracking-widest ${selectedGoal === g.value ? 'text-[#1e73ff]' : 'text-slate-400'}`}>{g.label}</h4>
                  <p className="font-bold text-slate-700 dark:text-slate-200">{g.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleGoalSubmit}
            className="w-full bg-[#1e73ff] hover:bg-blue-600 text-white font-black py-5 rounded-2xl text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-95"
          >
            START MY JOURNEY! 🌍
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-500">
      <div className="absolute top-8 right-8 flex gap-3">
         <button onClick={toggleMusic} className={`p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95 ${isMusicPlaying ? 'animate-pulse' : ''}`}>
           {isMusicPlaying ? '🔊' : '🔇'}
         </button>
         <button onClick={toggleDarkMode} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-95">
           {darkMode ? '☀️' : '🌙'}
         </button>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,115,255,0.1)] border border-slate-100 dark:border-slate-800 animate-in slide-in-from-right duration-500">
        <div className="text-center mb-10">
          <Logo size="lg" className="mx-auto mb-8" darkMode={darkMode} />
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join USHERS ACADEMY'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {isLogin ? `Resume your quest, ${name}` : 'Create your champion account.'}
          </p>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2 ml-1">Champion Name</label>
            <input
              autoFocus={!isLogin}
              type="text"
              required
              readOnly={isLogin}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ama"
              className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl focus:outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-lg placeholder:text-slate-300 dark:placeholder:text-slate-700 ${isLogin ? 'border-transparent text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'border-slate-50 dark:border-slate-800 focus:border-[#1e73ff] dark:focus:border-blue-500 hover:bg-white dark:hover:bg-slate-800/80'}`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2 ml-1">Secret Password</label>
            <input
              autoFocus={isLogin}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 focus:border-[#1e73ff] dark:focus:border-blue-500 hover:bg-white dark:hover:bg-slate-800/80 rounded-2xl focus:outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-lg placeholder:text-slate-300 dark:placeholder:text-slate-700"
            />
          </div>

          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 ml-1">Choose Your Avatar</label>
              <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-3xl h-14 rounded-2xl flex items-center justify-center transition-all border-2 ${
                      selectedAvatar === avatar 
                      ? 'bg-blue-50 dark:bg-blue-900/40 border-[#1e73ff] dark:border-blue-500 scale-105 shadow-md' 
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl text-[13px] font-black animate-pulse text-center border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#1e73ff] hover:bg-blue-600 text-white font-black py-5 rounded-2xl text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] mt-4"
          >
            {isLogin ? 'RESUME QUEST 🔑' : 'NEXT: SET GOAL 🎯'}
          </button>
        </form>
        
        <div className="mt-10 text-center border-t border-slate-50 dark:border-slate-800 pt-8">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); if(!isLogin) setName(''); }} 
            className="text-[13px] font-black text-[#1e73ff] dark:text-blue-400 hover:underline uppercase tracking-widest transition-all"
          >
            {isLogin ? 'Need a new account?' : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;