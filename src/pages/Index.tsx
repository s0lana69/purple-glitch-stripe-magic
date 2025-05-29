
import React from 'react';
import CyborgDisplay from '../components/CyborgDisplay';
import CyberpunkBackground from '../components/CyberpunkBackground';
import GlitchEffect from '../components/GlitchEffect';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <CyberpunkBackground />
      
      <div className="relative z-10 text-center px-4">
        <GlitchEffect className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-4 tracking-wider font-mono">
            CYBER
          </h1>
        </GlitchEffect>
        
        <div className="mb-8">
          <CyborgDisplay />
        </div>
        
        <GlitchEffect>
          <h2 className="text-2xl md:text-4xl font-mono text-purple-300 tracking-widest opacity-80">
            NEURAL INTERFACE
          </h2>
        </GlitchEffect>
        
        <div className="mt-8 flex justify-center space-x-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          <div className="h-px w-8 bg-purple-500 animate-pulse"></div>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </div>
      </div>
      
      {/* Scanline effect */}
      <div className="scanline"></div>
    </div>
  );
};

export default Index;
