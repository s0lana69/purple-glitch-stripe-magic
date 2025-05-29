import React from 'react';

const ApiModels: React.FC = () => {
  return (
    <section className="relative w-full min-h-[600px] h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-black">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 z-10 relative">AI Foundations</h2>
      <video
        className="absolute inset-0 w-full h-full object-contain z-0 bg-black scale-105"
        style={{ transform: 'scale(1.05)', backgroundColor: 'black' }}
        src="/videos/cali.webm"
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  );
};

export default ApiModels;
