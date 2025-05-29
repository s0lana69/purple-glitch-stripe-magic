import React from 'react';
import { CheckCircle, Database, Layers, Server } from 'lucide-react'; // Updated icons

const ScalabilitySection: React.FC = () => {
  const integrationPoints = [
    'Seamless API Integration: Connect TrueViral.ai with your existing tools and workflows via robust REST APIs.',
    'Scales on Demand: Our infrastructure effortlessly handles millions of requests, growing with your content needs.',
    'Enterprise-Grade Reliability: Built for performance, security, and compliance, ensuring your data is safe and operations are smooth.',
  ];

  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary-foreground">
              Solutions That Scale With Your Success
            </h2>
            <p className="text-muted-foreground mb-8 text-sm">
              Whether you're analyzing a few YouTube videos or processing vast amounts of content data, TrueViral.ai is built to perform. Integrate our powerful LLM capabilities into your stack and watch your content strategy soar.
            </p>

            <ul className="space-y-4">
              {integrationPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-neonGreen-500 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">{point}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-96 flex items-center justify-center">
            {/* Simplified Stack Graphic for SaaS */}
            <div className="space-y-4 w-full max-w-md">
              <div className="flex items-center p-4 bg-card rounded-lg border border-border shadow-md animate-float" style={{ animationDelay: '0.1s' }}>
                <Layers className="h-8 w-8 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold text-foreground">Your Application / Frontend</h3>
                  <p className="text-xs text-muted-foreground">Integrate via API</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-card rounded-lg border border-border shadow-md animate-float" style={{ animationDelay: '0.3s' }}>
                <Server className="h-8 w-8 text-neonBlue-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-foreground">TrueViral.ai API & LLMs</h3>
                  <p className="text-xs text-muted-foreground">Powerful AI Processing</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-card rounded-lg border border-border shadow-md animate-float" style={{ animationDelay: '0.5s' }}>
                <Database className="h-8 w-8 text-neonGreen-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-foreground">Scalable Infrastructure</h3>
                  <p className="text-xs text-muted-foreground">Reliable & Secure Data Handling</p>
                </div>
              </div>
            </div>
            {/* Optional: Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-5 -z-10"
              style={{
                backgroundImage:
                  'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScalabilitySection;
