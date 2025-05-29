'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonialsData = [
    {
      quote:
        "TrueViral.ai revolutionized our content strategy. The AI-driven SEO insights helped us triple our organic traffic in just three months!",
      name: 'Sarah L.',
      title: 'Marketing Director, Innovatech Solutions',
      color: 'teal',
    },
    {
      quote:
        'The viral prediction feature is a game-changer. We now focus our efforts on content with the highest potential, saving us time and resources.',
      name: 'Mike P.',
      title: 'Content Creator & Influencer',
      color: 'blue',
    },
    {
      quote:
        "Integrating TrueViral.ai's API was seamless. Their LLM capabilities for content generation have significantly boosted our team's productivity.",
      name: 'Dr. Emily Carter',
      title: 'Head of R&D, FutureAI Corp',
      color: 'magenta',
    },
    {
      quote:
        "We've seen a 40% increase in engagement since using TrueViral.ai. The platform is intuitive and the analytics are incredibly insightful.",
      name: 'David K.',
      title: 'CEO, Growth Hackers Agency',
      color: 'green',
    },
     {
      quote:
        "The YouTube SEO analysis tool is phenomenal. Our video rankings improved dramatically, leading to a significant increase in subscribers.",
      name: 'Jessica B.',
      title: 'YouTube Channel Manager',
      color: 'teal',
    },
    {
      quote:
        "TrueViral.ai's trend spotting feature keeps us ahead of the competition. We're always the first to capitalize on emerging topics.",
      name: 'Tom H.',
      title: 'Digital Strategist, MarketMinds',
      color: 'blue',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(testimonialsData.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  const getVisibleTestimonials = () => {
    const startIndex = currentIndex * itemsPerPage;
    return testimonialsData.slice(startIndex, startIndex + itemsPerPage);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'teal': return 'border-neonTeal-500 text-neonTeal-500';
      case 'blue': return 'border-neonBlue-500 text-neonBlue-500';
      case 'magenta': return 'border-neonMagenta-500 text-neonMagenta-500';
      case 'green': return 'border-neonGreen-500 text-neonGreen-500';
      default: return 'border-primary text-primary';
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-300">Loved by Creators & Businesses Alike</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-sm">
            Discover how TrueViral.ai is empowering users to achieve unprecedented content success.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {getVisibleTestimonials().map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-background p-6 rounded-xl border-l-4 ${getColorClasses(testimonial.color).split(' ')[0]} shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl`}
                >
                  <Quote className={`w-8 h-8 mb-4 ${getColorClasses(testimonial.color).split(' ')[1]} opacity-50`} />
                  <p className="text-gray-300 mb-6 italic text-sm flex-grow">"{testimonial.quote}"</p>
                  <div className="mt-auto">
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-muted-foreground text-xs">{testimonial.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <>
              <button
                className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 p-2 rounded-full bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 shadow-md"
                onClick={prevSlide}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 p-2 rounded-full bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 shadow-md"
                onClick={nextSlide}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
         {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <button
                key={pageIndex}
                className={`w-2.5 h-2.5 rounded-full ${
                  currentIndex === pageIndex ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground/50'
                } transition-colors duration-200`}
                onClick={() => setCurrentIndex(pageIndex)}
                aria-label={`Go to slide ${pageIndex + 1}`}
              ></button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
