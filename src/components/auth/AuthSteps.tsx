'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuthStepsProps {
  currentStep: number;
}

const steps = [
  { id: 1, title: 'Sign up your account' },
  { id: 2, title: 'Set up your workspace' },
  { id: 3, title: 'Set up your profile' },
];

export default function AuthSteps({ currentStep }: AuthStepsProps) {
  return (
    <div className="space-y-4 w-full max-w-md">
      {steps.map((step) => (
        <motion.div
          key={step.id}
          className={cn(
            'flex items-center p-4 rounded-lg transition-all',
            currentStep === step.id ? 'bg-white/10 backdrop-blur-sm' : 'bg-black/20 backdrop-blur-sm',
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * step.id }}
        >
          <div
            className={cn(
              'flex justify-center items-center w-8 h-8 rounded-full mr-3 font-medium',
              currentStep === step.id ? 'bg-white text-purple-900' : 'bg-gray-700 text-white',
            )}
          >
            {step.id}
          </div>
          <span className="text-sm md:text-base">{step.title}</span>
        </motion.div>
      ))}
    </div>
  );
}
