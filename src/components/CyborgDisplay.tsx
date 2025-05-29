
import React from 'react';
import GlitchEffect from './GlitchEffect';

const CyborgDisplay: React.FC = () => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <GlitchEffect className="cyborg-glitch">
        <div className="relative">
          <img 
            src="/lovable-uploads/2d9855c0-05c6-4768-ba43-af1a13199955.png" 
            alt="Cyberpunk Cyborg"
            className="w-full h-auto rounded-lg shadow-2xl"
          />
          {/* Purple neon eye stripes overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-8">
              {/* Left eye stripes */}
              <div className="absolute left-2 top-0 w-12 h-8 overflow-hidden">
                <div className="purple-stripe stripe-1"></div>
                <div className="purple-stripe stripe-2"></div>
                <div className="purple-stripe stripe-3"></div>
              </div>
              {/* Right eye stripes */}
              <div className="absolute right-2 top-0 w-12 h-8 overflow-hidden">
                <div className="purple-stripe stripe-1"></div>
                <div className="purple-stripe stripe-2"></div>
                <div className="purple-stripe stripe-3"></div>
              </div>
            </div>
          </div>
        </div>
      </GlitchEffect>
    </div>
  );
};

export default CyborgDisplay;
