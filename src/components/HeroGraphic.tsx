'use client';

import React from 'react';
import Image from 'next/image';

const HeroGraphic: React.FC = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 transform-origin-center scale-[1.2] sm:scale-100">
        <Image
          src="/images/cyberpunk-hero.png"
          alt="AI Assistant - TrueViral"
          fill
          className="object-cover object-center sm:object-[center_30%] scale-[0.8] sm:scale-100"
          priority
        />
      </div>
    </div>
  );
};

export default HeroGraphic;
