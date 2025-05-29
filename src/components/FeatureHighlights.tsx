'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Brain, TrendingUp, SearchCheck, Zap, BarChart3, Edit3 } from 'lucide-react'; // Updated icons
import Image from 'next/image';

const FeatureHighlights: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }, // Lower threshold for earlier trigger
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
      title: 'AI-Powered Content Strategy',
      description:
        'Leverage advanced LLMs to generate content ideas, outlines, and drafts that resonate with your target audience and current trends.',
      color: 'teal', // Corresponds to neonTeal
    },
    {
      icon: <SearchCheck className="h-6 w-6 sm:h-8 sm:w-8 text-neonBlue-500" />,
      title: 'Advanced SEO Analysis',
      description:
        'Get deep insights into your content\'s SEO performance. TrueViral.ai identifies keyword opportunities and on-page optimization factors.',
      color: 'blue',
    },
    {
      icon: <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-neonMagenta-500" />,
      title: 'Viral Potential Prediction',
      description:
        'Our AI analyzes millions of data points to predict the virality score of your content before you publish, helping you maximize reach.',
      color: 'magenta',
    },
    {
      icon: <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-neonGreen-500" />,
      title: 'Real-time Trend Spotting',
      description:
        'Stay ahead of the curve. TrueViral.ai identifies emerging trends and topics relevant to your niche, ensuring your content is always timely.',
      color: 'green',
    },
    {
      icon: <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
      title: 'Performance Analytics',
      description:
        'Track key metrics, understand audience engagement, and measure the ROI of your content marketing efforts with our intuitive dashboard.',
      color: 'teal',
    },
    {
      icon: <Edit3 className="h-6 w-6 sm:h-8 sm:w-8 text-neonBlue-500" />,
      title: 'Automated Content Optimization',
      description:
        'Receive AI-driven suggestions to refine your titles, descriptions, tags, and content structure for optimal performance.',
      color: 'blue',
    },
  ];

  // Define color classes for border and text based on feature.color
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'teal':
        return 'border-neonTeal-500/30 hover:border-neonTeal-500 text-neonTeal-500';
      case 'blue':
        return 'border-neonBlue-500/30 hover:border-neonBlue-500 text-neonBlue-500';
      case 'magenta':
        return 'border-neonMagenta-500/30 hover:border-neonMagenta-500 text-neonMagenta-500';
      case 'green':
        return 'border-neonGreen-500/30 hover:border-neonGreen-500 text-neonGreen-500';
      default:
        return 'border-primary/30 hover:border-primary text-primary';
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 bg-gradient-to-b from-background to-secondary relative overflow-hidden"
    >
      <div className="absolute -top-32 right-0 w-[800px] h-[800px] z-0 hidden md:block opacity-5 transition-opacity duration-1000 ease-in-out">
        <Image
          src="/images/cyberpunk-hero.png" // Kept for subtle background texture
          alt="AI Background Texture"
          layout="fill"
          objectFit="cover"
          className="opacity-10" // Very subtle
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-primary-foreground">
            Elevate Your Content with TrueViral.ai
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-xs sm:text-sm">
            Discover the intelligent features designed to make your content go viral and dominate search results.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-card p-4 sm:p-6 rounded-xl border ${getColorClasses(feature.color)} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              style={{ transitionDelay: `${index * 50}ms` }} // Staggered animation
            >
              <div className={`mb-3 sm:mb-4 ${getColorClasses(feature.color).split(' ')[2]}`}>{feature.icon}</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
