'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/providers';
import { Toaster } from "@/components/ui/toaster";
import AuthStateListener from '@/components/auth/AuthStateListener';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  const isSolutionsPage = pathname === '/solutions';

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Suspense fallback={null}>
        <AuthStateListener />
      </Suspense>
      <div className="flex flex-col min-h-screen relative"> {/* Added relative for video positioning */}
        {isSolutionsPage && (
          <video
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover -z-10" // Video behind other content
            src="/videos/output.webm"
            typeof="video/webm"
          />
        )}
        {/* Ensure Header, main, and Footer content are above the video using z-index or stacking context */}
        <div className="relative z-0 flex flex-col flex-grow"> {/* Wrapper to establish stacking context and allow flex-grow for main */}
          {!isDashboardRoute && <Header />} {/* Header is already z-40, so it's fine */}
          <main className="flex-grow"> {/* Allows main content to expand */}
            {children}
          </main>
          {/* Footer: Render default footer for non-dashboard and non-solutions pages.
              Solutions page handles its own transparent footer. */}
          {!isDashboardRoute && !isSolutionsPage && <Footer />}
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
