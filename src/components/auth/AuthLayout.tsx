'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image'; // Added Image import
import AuthSteps from './AuthSteps'; // Use relative import
import SignUpForm from './SignUpForm'; // Use relative import
import LoginForm from './LoginForm'; // Import LoginForm
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'; // Keep alias for ui component

type AuthMode = 'login' | 'signup';

interface AuthLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: AuthMode;
  onLoginSuccess?: () => void; // Callback for successful login/signup, for parent component's use
}

export function AuthLayout({ open, onOpenChange, mode: initialMode, onLoginSuccess: onParentSuccessCallback }: AuthLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [currentMode, setCurrentMode] = useState<AuthMode>(initialMode);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Update currentMode if the initial mode prop changes or dialog is re-opened with a different mode.
    if (open) {
      setCurrentMode(initialMode);
    }
  }, [initialMode, open]);

  if (!mounted) return null;

  const handleSwitchMode = (newMode: AuthMode) => {
    setCurrentMode(newMode);
  };

  const handleFormSuccess = () => {
    // Call the parent's success callback if provided (e.g., for analytics or other parent-level state changes)
    if (onParentSuccessCallback) {
      onParentSuccessCallback();
    }
    // Directly instruct the Dialog to close itself.
    // LoginForm/SignUpForm will handle redirection after this.
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-0 max-w-4xl bg-transparent rounded-lg overflow-hidden">
        <DialogTitle className="sr-only">
          {currentMode === 'signup' ? 'Create your TrueViral account' : 'Log in to TrueViral'}
        </DialogTitle>
        <div className="flex">
          <motion.div
            className="relative hidden md:flex w-1/2 bg-gradient-to-b from-purple-800 to-black text-white px-8 py-12 flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full max-w-xs text-center space-y-6">
              <div className="flex flex-col items-center mb-8">
                <Image
                  src="/icon/logo_hold.png"
                  alt="TrueViral Logo"
                  width={48} // Intermediate size, w-12 equivalent
                  height={48} // Intermediate size, h-12 equivalent
                  className="mb-3 thicker-logo-effect" 
                />
                <span className="text-2xl sm:text-3xl font-bold gradient-blue-violet">TrueViral</span>
              </div>
              <h1 className="text-2xl font-bold">
                {currentMode === 'signup' ? 'Get Started with Us' : 'Welcome Back'}
              </h1>
              <p className="text-sm text-gray-300">
                {currentMode === 'signup'
                  ? 'Complete these easy steps to register your account.'
                  : 'Log in to continue to your dashboard.'}
              </p>
              {currentMode === 'signup' && <AuthSteps currentStep={1} />}
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 bg-black text-white px-8 py-6 flex flex-col justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="max-w-md mx-auto w-full">
              {currentMode === 'signup' ? (
                <SignUpForm 
                  onSwitchMode={() => handleSwitchMode('login')} 
                  onSignUpSuccess={handleFormSuccess} // Pass the new handler to close dialog
                />
              ) : (
                <LoginForm
                  onSwitchMode={() => handleSwitchMode('signup')}
                  onLoginSuccess={handleFormSuccess} // Pass the new handler to close dialog
                />
              )}
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
