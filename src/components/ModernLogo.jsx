import React from 'react';

const ModernLogo = ({ size = 'default', showText = true, className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-10 h-10',
    large: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    small: 'text-lg',
    default: 'text-2xl',
    large: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Modern Simple Logo Icon */}
      <div className={`${sizeClasses[size]} relative group`}>
        {/* Clean circular background */}
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
          {/* Simple geometric icon - Abstract boxes/inventory */}
          <div className="relative w-2/3 h-2/3 flex items-center justify-center">
            {/* Three stacked rectangles representing inventory/stock */}
            <div className="relative">
              {/* Bottom rectangle */}
              <div className="w-4 h-2 bg-white rounded-sm opacity-90"></div>
              {/* Middle rectangle */}
              <div className="w-3 h-2 bg-white rounded-sm opacity-75 absolute -top-1.5 left-0.5"></div>
              {/* Top rectangle */}
              <div className="w-2 h-2 bg-white rounded-sm opacity-60 absolute -top-3 left-1"></div>
            </div>
          </div>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-slate-600 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
      </div>

      {/* Clean Logo Text */}
      {showText && (
        <span className={`font-semibold text-slate-800 ${textSizeClasses[size]} group-hover:text-slate-700 transition-colors duration-300`}>
          Restocker
        </span>
      )}
    </div>
  );
};

export default ModernLogo;
