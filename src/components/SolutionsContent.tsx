'use client';

import React from 'react';
import { Zap, Search, TrendingUp, Edit, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

const SolutionsContent: React.FC = () => {
  const solutions = [
    {
      id: 'content-generation',
      icon: <Edit className={cn("h-10 w-10 gradient-blue-violet")} />,
      title: 'AI Content Generation',
      description: 'Leverage advanced LLMs to generate high-quality, engaging content tailored for virality and SEO.',
      features: [
        'Blog posts, articles, scripts',
        'Social media captions & hooks',
        'Video titles & descriptions',
        'Ad copy & marketing materials',
      ],
    },
    {
      id: 'seo-analysis',
      icon: <Search className={cn("h-10 w-10 gradient-blue-violet")} />,
      title: 'Advanced SEO Analysis',
      description: 'Get deep insights into keywords, competitor strategies, and on-page optimization for maximum search visibility.',
      features: [
        'Keyword research & analysis',
        'Competitor SEO audits',
        'On-page optimization suggestions',
        'Technical SEO checks',
      ],
    },
    {
      id: 'viral-prediction',
      icon: <TrendingUp className={cn("h-10 w-10 gradient-blue-violet")} />,
      title: 'Viral Trend Prediction',
      description: 'Identify emerging trends and predict content virality potential using our proprietary AI models.',
      features: [
        'Real-time trend monitoring',
        'Content virality scoring',
        'Audience interest analysis',
        'Platform-specific insights',
      ],
    },
    {
      id: 'api-integration',
      icon: <Code className={cn("h-10 w-10 gradient-blue-violet")} />,
      title: 'API & Custom Solutions',
      description: 'Integrate our powerful AI capabilities directly into your existing workflows and applications.',
      features: [
        'LLM API access',
        'SEO analysis API',
        'Viral prediction API',
        'Custom model training (Enterprise)',
      ],
    },
  ];

  return (
    <section className="pt-8 pb-16 sm:pt-12 sm:pb-24 text-foreground"> {/* Adjusted padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Solutions That Scale With Your Success</h2> {/* Changed text color */}
          <p className="text-gray-300 max-w-3xl mx-auto text-lg"> {/* Changed text color */}
            Our suite of AI-powered tools is designed to meet the diverse needs of creators, marketers, and businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map(solution => (
            <div key={solution.id} id={solution.id} className="bg-neutral-900/70 p-6 rounded-xl border border-border shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-primary backdrop-blur-sm"> {/* Changed bg-card to bg-neutral-900/70 and added backdrop-blur-sm */}
              <div className="mb-4">{solution.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-foreground">{solution.title}</h3>
              <p className="text-gray-300 text-sm mb-6 flex-grow">{solution.description}</p> {/* Changed text color */}
              <div className="w-full text-left mt-auto">
                <h4 className="text-sm font-semibold mb-2 text-primary-foreground">Key Features:</h4>
                <ul className="text-gray-300 text-xs space-y-1"> {/* Changed text color */}
                  {solution.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      {/* This bullet point will now use the new primary violet color */}
                      <span className="mr-2 text-primary">•</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsContent;
