
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'dark', className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const glowColor = variant === 'dark' ? 'shadow-green-400/50' : 'shadow-green-300/30';

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Robot Head Base */}
      <div className="w-full h-full relative">
        {/* Main Head Shape */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 ${variant === 'light' ? 'opacity-90' : ''} shadow-xl`}>
          {/* Metallic Highlights */}
          <div className="absolute top-2 left-2 right-2 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent rounded-full opacity-60"></div>
          <div className="absolute bottom-2 left-2 right-2 h-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent rounded-full opacity-40"></div>
        </div>

        {/* Eyes Container */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {/* Left Eye */}
          <div className="relative">
            <div className="w-3 h-3 bg-black rounded-full border border-slate-600">
              <div className="absolute inset-0.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-400/80">
                {/* Eye Glow Lines */}
                <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-green-300 rounded-full opacity-80"></div>
                <div className="absolute top-1 left-0.5 right-0.5 h-0.5 bg-green-300 rounded-full opacity-60"></div>
                <div className="absolute top-1.5 left-0.5 right-0.5 h-0.5 bg-green-300 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>

          {/* Right Eye */}
          <div className="relative">
            <div className="w-3 h-3 bg-black rounded-full border border-slate-600">
              <div className="absolute inset-0.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-400/80" style={{ animationDelay: '0.1s' }}>
                {/* Eye Glow Lines */}
                <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-green-300 rounded-full opacity-80"></div>
                <div className="absolute top-1 left-0.5 right-0.5 h-0.5 bg-green-300 rounded-full opacity-60"></div>
                <div className="absolute top-1.5 left-0.5 right-0.5 h-0.5 bg-green-300 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Cables/Wires */}
        <div className="absolute -top-1 left-1 w-1 h-4 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full transform rotate-12"></div>
        <div className="absolute -top-1 left-2 w-0.5 h-3 bg-gradient-to-b from-slate-500 to-slate-700 rounded-full transform -rotate-6"></div>
        <div className="absolute -top-1 right-1 w-1 h-4 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full transform -rotate-12"></div>
        <div className="absolute -top-1 right-2 w-0.5 h-3 bg-gradient-to-b from-slate-500 to-slate-700 rounded-full transform rotate-6"></div>

        {/* Side Panels */}
        <div className="absolute left-0 top-1/4 w-1 h-1/2 bg-gradient-to-b from-slate-600 to-slate-800 rounded-l-lg"></div>
        <div className="absolute right-0 top-1/4 w-1 h-1/2 bg-gradient-to-b from-slate-600 to-slate-800 rounded-r-lg"></div>

        {/* Bottom Neck */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gradient-to-b from-slate-700 to-slate-900 rounded-b-lg">
          <div className="absolute top-0 left-0.5 right-0.5 h-0.5 bg-slate-500 rounded-full opacity-60"></div>
          <div className="absolute top-1 left-0.5 right-0.5 h-0.5 bg-slate-600 rounded-full opacity-40"></div>
        </div>

        {/* Outer Glow Effect */}
        <div className={`absolute inset-0 rounded-xl bg-green-400/10 ${glowColor} blur-sm -z-10`}></div>
      </div>
    </div>
  );
};

export default Logo;
