'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Zap, Target, DollarSign, HelpCircle, Brain, TrendingUp, BarChart3, ChevronDown } from 'lucide-react';
import Link from 'next/link';

type Metric = {
  icon: React.ReactNode;
  value: string;
  title: string;
  description: string;
  color: string; // 'teal', 'blue', 'green', 'magenta'
};

type FaqItem = {
  question: string;
  answer: string;
};

const colorMap = {
  teal: { text: 'text-neonTeal-500', border: 'border-neonTeal-500/50', shadow: 'shadow-glow' }, // Note: neonTeal will now be violet due to global CSS change
  blue: { text: 'text-neonBlue-500', border: 'border-neonBlue-500/50', shadow: 'shadow-glow-blue' },
  green: { text: 'text-neonGreen-500', border: 'border-neonGreen-500/50', shadow: 'shadow-glow-green' },
  magenta: { text: 'text-neonMagenta-500', border: 'border-neonMagenta-500/50', shadow: 'shadow-glow-magenta' },
  primary: { text: 'text-primary', border: 'border-primary/50', shadow: 'shadow-glow' },
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const metrics = useMemo<Metric[]>(
    () => [
      {
        icon: <TrendingUp />,
        value: '300%',
        title: 'Engagement Boost',
        description:
          'Clients using TrueViral.ai see an average 300% increase in content engagement and viral spread.',
        color: 'teal', // This will now render as the new primary violet
      },
      {
        icon: <Brain />,
        value: '10x',
        title: 'Faster Content Creation',
        description:
          'Accelerate your content pipeline by up to 10x with AI-assisted generation and optimization tools.',
        color: 'blue',
      },
      {
        icon: <BarChart3 />,
        value: '75%',
        title: 'Improved SEO Ranking',
        description:
          'Achieve up to 75% improvement in search engine rankings for targeted keywords with our SEO analysis features.',
        color: 'green',
      },
    ],
    [],
  );

  const faqs = useMemo<FaqItem[]>(
    () => [
      {
        question: 'What is TrueViral.ai?',
        answer:
          'TrueViral.ai is an AI-powered SaaS platform designed to help creators, marketers, and businesses maximize their content\'s reach, engagement, and SEO performance. We use advanced Large Language Models (LLMs) to provide insights, generate content, and predict viral trends.',
      },
      {
        question: 'How does TrueViral.ai help with SEO?',
        answer:
          'Our platform analyzes YouTube video transcripts, website content, and competitor data to provide actionable SEO recommendations. This includes keyword suggestions, title/description optimization, and content structure improvements to boost your search engine rankings.',
      },
      {
        question: 'Can TrueViral.ai help me create content?',
        answer:
          'Yes! TrueViral.ai offers AI-assisted content generation tools. You can generate blog post ideas, video scripts, social media captions, and more, all optimized for engagement and SEO based on current trends and your specific niche.',
      },
      {
        question: 'How does the viral prediction feature work?',
        answer:
          'Our AI models are trained on vast datasets of viral content. By analyzing various factors like topic, sentiment, structure, and platform-specific elements, TrueViral.ai can provide a virality score for your content ideas, helping you focus on high-potential topics.',
      },
      {
        question: 'What platforms do you support for analysis?',
        answer:
          'Currently, we offer in-depth analysis for YouTube (including Shorts). We are continuously expanding our platform support to include TikTok, Instagram, LinkedIn, and more.',
      },
      {
        question: 'Is there a free trial available?',
        answer:
          'Yes, we offer a free trial so you can experience the power of TrueViral.ai. Check our Pricing page for more details on trial limitations and available plans.',
      },
    ],
    [],
  );

  const toggleFaq = useCallback((index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  }, []);

  const MetricIconDisplay = ({ metric, size = 'normal' }: { metric: Metric; size?: 'small' | 'normal' }) => {
    const iconSize = size === 'small' ? 'w-6 h-6' : 'w-8 h-8';
    // The color 'teal' in metric.color will now map to the new primary violet color due to changes in globals.css affecting neonTeal
    const colorClass = colorMap[metric.color as keyof typeof colorMap]?.text || colorMap.primary.text;
    return React.cloneElement(metric.icon as React.ReactElement, {
      className: `${iconSize} ${colorClass}`,
    });
  };

  const FaqAccordionItem = ({ faq, index }: { faq: FaqItem; index: number }) => {
    const isOpen = openIndex === index;
    return (
      <div
        className={`bg-card rounded-lg border border-border transition-all duration-300 ${isOpen ? 'ring-2 ring-primary shadow-lg' : 'hover:border-primary/50'}`}
        key={index}
      >
        <button
          className="w-full flex justify-between items-center text-left p-4 sm:p-5 font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-50 rounded-t-lg"
          aria-expanded={isOpen.toString() as 'true' | 'false'}
          aria-controls={`faq-content-${index}`}
          onClick={() => toggleFaq(index)}
          id={`faq-button-${index}`}
        >
          <span>{faq.question}</span>
          <ChevronDown className={`w-5 h-5 ml-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div
          id={`faq-content-${index}`}
          role="region"
          aria-labelledby={`faq-button-${index}`}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <p className="text-muted-foreground text-sm px-4 sm:px-5 pb-4 sm:pb-5 pt-1">{faq.answer}</p>
        </div>
      </div>
    );
  };

  return (
    <section className="relative min-h-screen bg-background text-foreground pb-16" aria-labelledby="faq-heading"> {/* Removed pt-24 sm:pt-32 */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 id="faq-heading" className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground mb-8 text-base">
            Find answers to common questions about TrueViral.ai and our AI-powered content solutions.
          </p>
        </div>

        <div className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {metrics.map((metric, index) => (
              <div key={index} className={`bg-card p-6 rounded-xl border ${colorMap[metric.color as keyof typeof colorMap]?.border || colorMap.primary.border} shadow-lg text-center flex flex-col items-center`}>
                <div className={`mb-3 ${colorMap[metric.color as keyof typeof colorMap]?.shadow || colorMap.primary.shadow}`}>
                  <MetricIconDisplay metric={metric} />
                </div>
                <div className={`text-3xl font-bold mb-1 ${colorMap[metric.color as keyof typeof colorMap]?.text || colorMap.primary.text}`}>
                  {metric.value}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{metric.title}</h3>
                <p className="text-muted-foreground text-xs flex-grow">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-16" role="region" aria-labelledby="faq-section-heading-list">
          <h2 id="faq-section-heading-list" className="sr-only">
            Detailed Questions and Answers
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FaqAccordionItem key={index} faq={faq} index={index} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold text-foreground mb-3">Still have questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Our team is ready to assist you. Reach out for personalized support or to discuss your specific needs.
          </p>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
