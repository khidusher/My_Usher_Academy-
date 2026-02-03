
import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  darkMode?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false, size = 'md', darkMode = false }) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-[12px]', gap: 'gap-2' },
    md: { icon: 'w-12 h-12', text: 'text-[18px]', gap: 'gap-3' },
    lg: { icon: 'w-24 h-24', text: 'text-[34px]', gap: 'gap-4' },
    xl: { icon: 'w-36 h-36', text: 'text-[52px]', gap: 'gap-6' },
  };

  const currentSize = sizeMap[size];
  const brandBlue = "#1e73ff";
  const strokeColor = darkMode ? "white" : "black";

  return (
    <div className={`flex items-center ${currentSize.gap} ${className} select-none`}>
      {/* Modern Computer and Book Icon */}
      <div className={`${currentSize.icon} shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Computer Monitor */}
          <rect 
            x="20" 
            y="15" 
            width="60" 
            height="42" 
            rx="4" 
            stroke={strokeColor} 
            strokeWidth="6" 
            fill={darkMode ? "#1e293b" : "white"}
          />
          <rect 
            x="26" 
            y="21" 
            width="48" 
            height="30" 
            rx="1" 
            fill={brandBlue} 
          />
          {/* Monitor Stand */}
          <path 
            d="M42 57 L38 68 H62 L58 57" 
            fill={strokeColor} 
          />
          
          {/* Open Book underneath */}
          <path 
            d="M10 82 C10 76 30 76 50 82 C70 76 90 76 90 82 V92 C90 86 70 86 50 92 C30 86 10 86 10 92 Z" 
            fill={darkMode ? "#1e293b" : "white"} 
            stroke={strokeColor} 
            strokeWidth="5" 
            strokeLinejoin="round"
          />
          <line 
            x1="50" 
            y1="82" 
            x2="50" 
            y2="92" 
            stroke={strokeColor} 
            strokeWidth="4" 
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography (Maintaining Consistency) */}
      {!iconOnly && (
        <div className="flex flex-col leading-[0.9] justify-center pt-1">
          <span className={`${currentSize.text} font-black text-[#1e73ff] dark:text-blue-400 uppercase tracking-tighter`}>
            USHERS
          </span>
          <span className={`${currentSize.text} font-black text-[#1e73ff] dark:text-blue-400 uppercase tracking-tighter`}>
            ACADEMY
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
