
import React from 'react';

interface GlitchEffectProps {
  children: React.ReactNode;
  className?: string;
}

const GlitchEffect: React.FC<GlitchEffectProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="glitch-container">
        {children}
        <div className="glitch-overlay glitch-overlay-1" aria-hidden="true">
          {children}
        </div>
        <div className="glitch-overlay glitch-overlay-2" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GlitchEffect;
