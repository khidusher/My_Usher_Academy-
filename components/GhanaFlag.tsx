
import React from 'react';

const GhanaFlag: React.FC<{ size?: string; className?: string }> = ({ size = "w-6 h-4", className = "" }) => {
  return (
    <div className={`${size} ${className} inline-block relative shadow-sm border border-black/10 overflow-hidden rounded-sm`}>
      <svg viewBox="0 0 450 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="450" height="100" fill="#EF3340" />
        <rect y="100" width="450" height="100" fill="#FFD100" />
        <rect y="200" width="450" height="100" fill="#009739" />
        <path d="M225 108l14.4 44.3h46.6l-37.7 27.4 14.4 44.3-37.7-27.4-37.7 27.4 14.4-44.3-37.7-27.4h46.6z" fill="#000" />
      </svg>
    </div>
  );
};

export default GhanaFlag;
