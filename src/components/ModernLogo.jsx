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
      {/* Modern Logo Icon - Inventory/Box Design */}
      <div className={`${sizeClasses[size]} relative group`}>
        {/* Main container with gradient background */}
        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
          {/* Inventory box icon */}
          <div className="relative w-3/4 h-3/4">
            {/* Main box */}
            <div className="absolute inset-0 bg-white rounded-lg shadow-inner">
              {/* Box lines */}
              <div className="absolute top-1 left-1 right-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              <div className="absolute top-2 left-1 right-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              <div className="absolute top-3 left-1 right-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              
              {/* Vertical lines */}
              <div className="absolute top-1 bottom-1 left-1 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              <div className="absolute top-1 bottom-1 right-1 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full"></div>
            </div>
            
            {/* Floating elements for modern effect */}
            <div className="absolute -top-1 -right-1 w-1 h-1 bg-white rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent ${textSizeClasses[size]} group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-indigo-500 transition-all duration-300`}>
          Restocker
        </span>
      )}
    </div>
  );
};

export default ModernLogo;
