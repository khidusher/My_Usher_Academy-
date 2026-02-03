
import React from 'react';
import { UserProgress } from '../types.ts';
import Logo from './Logo.tsx';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProgress;
  onNavigate: (view: 'map' | 'plan' | 'profile') => void;
  onLogout?: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onNavigate, onLogout, darkMode, toggleDarkMode, isMusicPlaying, toggleMusic }) => {
  const levelName = user.xp < 200 ? 'Beginner' : user.xp < 500 ? 'Explorer' : 'Champion';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 hidden md:flex flex-col">
        <div className="mb-10">
          <Logo size="md" darkMode={darkMode} />
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => onNavigate('map')} className="w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-3 font-semibold transition-colors group">
            <span className="group-hover:scale-110 transition-transform">🗺️</span> 
            <span className="text-slate-700 dark:text-slate-300">Quest Map</span>
          </button>
          <button onClick={() => onNavigate('plan')} className="w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-3 font-semibold transition-colors group">
            <span className="group-hover:scale-110 transition-transform">📅</span> 
            <span className="text-slate-700 dark:text-slate-300">Daily Plan</span>
          </button>
          <button onClick={() => onNavigate('profile')} className="w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-3 font-semibold transition-colors group">
            <span className="group-hover:scale-110 transition-transform">👤</span> 
            <span className="text-slate-700 dark:text-slate-300">My Profile</span>
          </button>
          
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button 
              onClick={toggleDarkMode} 
              className="w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-3 font-semibold transition-colors group"
            >
              <span className="group-hover:scale-110 transition-transform">{darkMode ? '☀️' : '🌙'}</span> 
              <span className="text-slate-700 dark:text-slate-300">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button 
              onClick={toggleMusic} 
              className="w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-3 font-semibold transition-colors group"
            >
              <span className={`group-hover:scale-110 transition-transform ${isMusicPlaying ? 'animate-pulse text-blue-500' : ''}`}>
                {isMusicPlaying ? '🔊' : '🔇'}
              </span> 
              <span className="text-slate-700 dark:text-slate-300">{isMusicPlaying ? 'Mute Music' : 'Play Music'}</span>
            </button>
            <button onClick={onLogout} className="w-full text-left p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-3 font-semibold transition-colors group text-red-600 mt-2 border border-transparent hover:border-red-100 dark:hover:border-red-900">
              <span className="group-hover:scale-110 transition-transform">🚪</span> 
              <span>Logout</span>
            </button>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{user.avatar}</span>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight">{user.name}</p>
              <p className="text-[10px] text-[#1e73ff] dark:text-blue-400 font-black uppercase tracking-widest">{levelName}</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-[#1e73ff] h-full" style={{ width: `${Math.min(100, (user.xp % 500) / 5)}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase font-bold tracking-widest">{user.xp} XP TOTAL</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-0 z-50">
        <Logo size="sm" darkMode={darkMode} />
        <div className="flex gap-4 items-center">
          <button onClick={toggleMusic} className={`text-xl p-2 ${isMusicPlaying ? 'animate-pulse' : ''}`}>{isMusicPlaying ? '🔊' : '🔇'}</button>
          <button onClick={toggleDarkMode} className="text-xl p-2">{darkMode ? '☀️' : '🌙'}</button>
          <span className="text-sm font-bold text-orange-500">🔥 {user.streak}</span>
          <button onClick={() => onNavigate('profile')} className="text-xl">{user.avatar}</button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        {children}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 fixed bottom-0 left-0 right-0 flex justify-around items-center z-50">
        <button onClick={() => onNavigate('map')} className="flex flex-col items-center gap-1">
          <span className="text-xl">🗺️</span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Map</span>
        </button>
        <button onClick={() => onNavigate('plan')} className="flex flex-col items-center gap-1">
          <span className="text-xl">📅</span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Plan</span>
        </button>
        <button onClick={() => onNavigate('profile')} className="flex flex-col items-center gap-1">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;