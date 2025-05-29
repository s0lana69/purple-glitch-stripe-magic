'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/FirebaseAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
      closeMobileMenu();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled ? 'bg-background/80 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-8 group">
              <Image
                src="/icon/logo_hold.png"
                alt="TrueViral Logo"
                width={32}
                height={32}
                className="mr-2 group-hover:opacity-80 transition-opacity thicker-logo-effect"
              />
              <span className="text-[1.3rem] sm:text-xl font-bold gradient-blue-violet group-hover:opacity-80 transition-opacity">
                TrueViral
              </span>
            </Link>

            <nav className="hidden lg:flex space-x-6 lg:space-x-8">
              {[
                { href: "/", label: t('nav.home') },
                { href: "/solutions", label: t('nav.solutions') },
                { href: "/faq", label: t('nav.faq') },
                { href: "/prices", label: t('nav.pricing') },
                { href: "/contact", label: t('nav.contact') },
              ].map(item => (
                <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden p-0 hover:bg-purple-100 dark:hover:bg-purple-900">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.photoURL || ''} alt={user?.email || 'User'} />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 text-white">
                        {getInitials(user?.email, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {user?.email || t('dashboard.user')}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => router.push('/dashboard')} className="cursor-pointer">
                    {t('nav.dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleSignOut} className="text-purple-700 dark:text-purple-400 focus:text-white focus:bg-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 cursor-pointer">
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/affiliate"
                  className="hidden lg:inline-block border border-border text-muted-foreground px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md hover:border-primary hover:text-primary transition-all duration-200"
                >
                  {t('nav.earnWithUs')}
                </Link>
                <Button asChild size="sm" className="btn-transparent-violet">
                  <Link href="/auth?initialMode=signup">{t('nav.getStarted')}</Link>
                </Button>
              </>
            )}
            <button
              className="lg:hidden text-foreground p-1 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-black z-50 lg:hidden transition-transform duration-300 transform flex flex-col shadow-xl",
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex justify-end p-4">
          <button onClick={closeMobileMenu} aria-label="Close menu">
            <X className="w-7 h-7 text-foreground" />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center flex-grow space-y-6 text-center">
          {[
            { href: "/", label: t('nav.home') },
            { href: "/solutions", label: t('nav.solutions') },
            { href: "/faq", label: t('nav.faq') },
            { href: "/prices", label: t('nav.pricing') },
            { href: "/contact", label: t('nav.contact') },
            { href: "/affiliate", label: t('nav.affiliate') },
          ].map(item => (
            <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-primary text-xl py-2" onClick={closeMobileMenu}>
              {item.label}
            </Link>
          ))}
          
          <div className="flex items-center justify-center py-2">
            <LanguageSelector className="scale-125" />
          </div>
        </nav>
        <div className="p-6 border-t border-border">
          {user ? (
            <div className="flex flex-col space-y-3">
               <Button variant="outline" className="w-full" onClick={() => { router.push('/dashboard'); closeMobileMenu(); }}>{t('nav.dashboard')}</Button>
               <Button variant="destructive" className="w-full" onClick={handleSignOut}>{t('nav.logout')}</Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <Button size="lg" className="w-full btn-transparent-violet" asChild>
                <Link href="/auth?initialMode=signup" onClick={closeMobileMenu}>{t('nav.getStarted')}</Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link href="/auth?initialMode=login" onClick={closeMobileMenu}>{t('nav.login')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
