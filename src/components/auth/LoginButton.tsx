'use client';

import { Button } from '@/components/ui/button';
import { AuthLayout } from './AuthLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  mode: 'login' | 'signup';
}

export function LoginButton({
  className,
  variant = 'default',
  size = 'default',
  children,
  mode,
}: LoginButtonProps) {
  const [showAuth, setShowAuth] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Force close the auth dialog
    setShowAuth(false);
    
    // Add a small timeout to ensure React state updates
    setTimeout(() => {
      // Refresh router to ensure we have the latest auth state
      router.refresh();
    }, 100);
  };

  const toggleAuth = () => setShowAuth(true);

  return (
    <>
      <Button
        size={size}
        variant="default"
        className={`btn-transparent-violet ${className || ''}`}
        onClick={toggleAuth}
      >
        {children}
      </Button>
      {showAuth && (
        <AuthLayout
          open={showAuth}
          onOpenChange={setShowAuth}
          mode={mode}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}
