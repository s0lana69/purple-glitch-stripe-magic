'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';
import { FirebaseAuthProvider } from '@/context/FirebaseAuthContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';

// Define props for our custom ThemeProvider, extending NextThemesProviderProps
interface CustomThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}

export function AuthProviders({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseAuthProvider>
      <SubscriptionProvider>
        {children}
      </SubscriptionProvider>
    </FirebaseAuthProvider>
  );
}
