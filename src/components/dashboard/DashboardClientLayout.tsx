'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, UserCircle, LogOut } from 'lucide-react';
import { ThemeAwareYouTubeIcon } from '@/components/icons/ThemeAwareYouTubeIcon';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/FirebaseAuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { YouTubeStatusTrigger } from './youtube-status-trigger';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardClientLayoutProps {
  children: ReactNode;
}

export default function DashboardClientLayout({ children }: DashboardClientLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth(); // Use the centralized auth context
  const { t } = useLanguage();

  // Effect to handle window resize for responsive adjustments
  useEffect(() => {
    const mdBreakpoint = 768; // Tailwind's md
    const handleResize = () => {
      if (window.innerWidth >= mdBreakpoint) {
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Effect to prevent body scroll when mobile menu is open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768 && isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isMobileMenuOpen]);

  // Authentication is now handled by the AuthGuard component

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSignOut = signOut; // Use the centralized signOut function

  const handleProfileClick = () => router.push('/dashboard/settings');
  const handleSettingsClick = () => router.push('/dashboard/settings');

  const getInitials = (name?: string | null, email?: string | null): string => {
    if (name) {
      const parts = name.split(' ');
      if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      return name.substring(0, 2).toUpperCase();
    }
    if (email) return email.substring(0, 2).toUpperCase();
    return 'U';
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <YouTubeStatusTrigger />
      <div className={cn(
        "hidden md:flex flex-shrink-0 flex-col transition-all duration-300 ease-in-out border-r bg-card",
        isDesktopSidebarCollapsed ? 'w-[72px]' : 'w-64'
      )}>
        <DashboardSidebar 
          isOpen={true}
          onToggleSidebarAction={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
          isCollapsed={isDesktopSidebarCollapsed}
          setIsCollapsed={setIsDesktopSidebarCollapsed}
          isMobileView={false}
        /> 
      </div>

      <div
        className={cn(
          "fixed inset-0 bg-background z-40 md:hidden transition-transform duration-300 transform flex flex-col shadow-xl",
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <DashboardSidebar 
          isOpen={isMobileMenuOpen}
          onToggleSidebarAction={toggleMobileMenu}
          isMobileView={true} 
        />
      </div>
      
      <div className="flex flex-col flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 relative">
            {/* Left: Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMobileMenu}
              className="md:hidden border-purple-400 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900 dark:hover:text-purple-300 z-50"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle Menu</span>
            </Button>
            
            {/* Spacer for mobile to allow YouTube logo to center */}
            <div className="md:hidden flex-1"></div>


            {/* Centered YouTube Logo (visible on all sizes if desired, or md:flex) */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 md:static md:left-auto md:top-auto md:transform-none md:mr-auto md:ml-4">
                 <ThemeAwareYouTubeIcon className="flex" />
            </div>

            {/* Right-aligned controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="outline"
                onClick={handleSignOut}
                size="icon"
                className="text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900 md:size-9 md:px-3 md:w-auto md:h-9 flex md:gap-2"
                aria-label={t('dashboard.logout')}
                title={t('dashboard.logout')}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">{t('dashboard.logout')}</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.photoURL || ''} alt={user?.email || 'User'} />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 text-white">
                        {user ? getInitials(user.email, user.email) : <UserCircle />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {user?.email || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>{t('dashboard.profile')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettingsClick}>{t('dashboard.settings')}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-purple-700 dark:text-purple-400 focus:text-white focus:bg-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900"
                  >
                    {t('dashboard.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </header>
        <main className="flex-1 p-3 sm:p-4 bg-background overflow-y-auto"> {/* Reduced padding */}
          {children}
        </main>
      </div>
    </div>
  );
}
