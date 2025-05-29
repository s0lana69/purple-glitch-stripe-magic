'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import HeroGraphic from './HeroGraphic';
import { cn } from '@/lib/utils'; // Import cn utility

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-dark text-white">
      {/* Image Container - positioned differently for mobile and desktop */}
      <div className="absolute top-0 left-0 right-0 bottom-0 md:left-auto md:right-[5%] md:w-[45%] w-full h-full z-0">
        <HeroGraphic />
      </div>

      {/* Text Content Container - positioned on the left */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center"> {/* Use a 2-col grid, text on left, empty space on right (where image is visually) */}
          <div className="lg:col-span-1 py-12 lg:py-0"> {/* Text content takes the first column */}
            <div className="max-w-xl text-center lg:text-left mx-auto lg:mx-0"> {/* Constrain text width and center on small screens */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight transform -translate-y-[170%] sm:transform-none md:mb-6">
                Unlock <span className="gradient-blue-violet">Viral Potential</span> with AI
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 hidden sm:block">
                TrueViral.ai is the AI-powered platform that helps you analyze trends, generate viral content ideas, and optimize for maximum reach and engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transform translate-y-[200%] sm:transform-none w-full">
                <Button asChild size="lg" className="btn-transparent-violet shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_20px_rgba(138,43,226,0.7)] transition-shadow">
                  <Link href="/auth?initialMode=signup">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-background/50 bg-transparent md:bg-background shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-shadow">
                  <Link href="/solutions">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 hidden lg:block"> {/* This column is effectively empty for spacing, hidden on small screens */}
            {/* This column is effectively empty, allowing the absolutely positioned image to show through */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
