'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, UserCircle, LogOut, X } from 'lucide-react';
import { ThemeAwareYouTubeIcon } from '@/components/icons/ThemeAwareYouTubeIcon';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { DashboardSidebar } from './dashboard-sidebar';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  onMenuClickAction: () => void;
}

export function DashboardHeader({ isSidebarOpen, onMenuClickAction }: DashboardHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error: any) {
      console.error('Logout error:', error.message);
    }
  };

  const handleProfileClick = () => {
    router.push('/dashboard/settings');
  };

  const handleSettingsClick = () => {
    router.push('/dashboard/settings');
  };

  const getInitials = (name?: string | null, email?: string | null): string => {
    if (name) {
      const parts = name.split(' ');
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 relative">
      <div>
        <Button
          variant="outline"
          size="icon"
          onClick={onMenuClickAction}
          className="md:hidden border-purple-400 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900 dark:hover:text-purple-300 z-50"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>

      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <ThemeAwareYouTubeIcon className="flex" />
      </div>

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
  );
}

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  useEffect(() => {
    const mdBreakpoint = 768;
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < mdBreakpoint) {
        // On mobile, manage overlay menu
      } else {
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };
    
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

  return (
    <>
      {children}
    </>
  );
}
