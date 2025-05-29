'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Zap, Target, DollarSign } from 'lucide-react';

const PerformanceComparison: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [videoTop, setVideoTop] = useState(0);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Ermittle die Höhe des Headers/Einleitungstexts, damit das Video darunter startet
  useEffect(() => {
    if (videoContainerRef.current) {
      setVideoTop(videoContainerRef.current.offsetTop + videoContainerRef.current.offsetHeight);
    }
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-dark relative overflow-hidden">
      {/* Überschrift und Einleitung */}
      <div ref={videoContainerRef} className="text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Unbeatable Value, Unmatched Performance</h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          Our AI solutions deliver superior results across all key metrics compared to traditional approaches
        </p>
      </div>
      {/* Video-Background nur unterhalb der Überschrift */}
      {isVisible && (
        <div className="absolute left-0 w-full z-0" style={{ top: videoTop, height: `calc(100% - ${videoTop}px)` }}>
          <video
            className="w-full h-full object-cover"
            src="/videos/tv-intro.webm"
            autoPlay
            loop
            muted
            playsInline
            style={{ backgroundColor: 'black', width: '100%', margin: 0, padding: 0 }}
          />
        </div>
      )}
      {/* Restlicher Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-5xl mx-auto relative z-10">
        <div className="relative w-72 h-72 md:w-80 md:h-80">
          {/* Center circle with logo */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-darkLight border-2 border-white/20 flex items-center justify-center z-10">
            <div className="text-white font-bold text-xl">TrueViral</div>
          </div>
          {/* Orbit circles */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-72 md:h-72 rounded-full border border-gray-700 animate-spin"
            style={{ animationDuration: '40s' }}
          ></div>
          {/* Metric points on the circle */}
          {/* Accuracy metric */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-darkAccent border border-neonTeal-500/50 flex items-center justify-center mb-3 shadow-glow">
              <Target className="w-8 h-8 text-neonTeal-500" />
            </div>
            <div className="text-neonTeal-500 font-bold text-xl">95%</div>
            <div className="text-gray-300 text-sm">Accuracy</div>
          </div>
          {/* Speed metric */}
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-darkAccent border border-neonBlue-500/50 flex items-center justify-center mb-3 shadow-glow-blue">
              <Zap className="w-8 h-8 text-neonBlue-500" />
            </div>
            <div className="text-neonBlue-500 font-bold text-xl">10x</div>
            <div className="text-gray-300 text-sm">Faster</div>
          </div>
          {/* Cost metric */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-darkAccent border border-neonGreen-500/50 flex items-center justify-center mb-3 shadow-glow-green">
              <DollarSign className="w-8 h-8 text-neonGreen-500" />
            </div>
            <div className="text-neonGreen-500 font-bold text-xl">60%</div>
            <div className="text-gray-300 text-sm">Cost Savings</div>
          </div>
          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            <line x1="100" y1="100" x2="100" y2="10" stroke="rgba(60, 255, 236, 0.3)" strokeWidth="1" />
            <line x1="100" y1="100" x2="190" y2="100" stroke="rgba(23, 168, 255, 0.3)" strokeWidth="1" />
            <line x1="100" y1="100" x2="100" y2="190" stroke="rgba(57, 255, 176, 0.3)" strokeWidth="1" />
          </svg>
        </div>
        <div className="max-w-md space-y-8">
          <div>
            <div className="flex items-start mb-2">
              <Target className="w-6 h-6 text-neonTeal-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold flex items-center">
                  <span className="text-neonTeal-500 text-2xl mr-2">95%</span>
                  <span>Accuracy</span>
                </h3>
                <p className="text-gray-300">
                  Our AI models consistently outperform traditional systems by achieving 95% accuracy in complex
                  scenarios.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-start mb-2">
              <Zap className="w-6 h-6 text-neonBlue-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold flex items-center">
                  <span className="text-neonBlue-500 text-2xl mr-2">10x</span>
                  <span>Faster Processing</span>
                </h3>
                <p className="text-gray-300">
                  Process and analyze data up to 10 times faster than conventional solutions, enabling real-time
                  decision making.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-start mb-2">
              <DollarSign className="w-6 h-6 text-neonGreen-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold flex items-center">
                  <span className="text-neonGreen-500 text-2xl mr-2">60%</span>
                  <span>Cost Reduction</span>
                </h3>
                <p className="text-gray-300">
                  Reduce operational costs by up to 60% compared to traditional approaches while improving performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceComparison;
