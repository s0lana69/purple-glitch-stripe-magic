'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, LogOut } from 'lucide-react';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import Link from 'next/link';

const HeroDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, loading } = useFirebaseAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="btn btn-primary relative overflow-hidden text-xs px-4 py-2 text-center opacity-50">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth?mode=signup"
        className="btn btn-primary relative overflow-hidden group text-xs px-4 py-2 text-center"
      >
        Try It Free
        <ChevronRight className="ml-1 w-3 h-3 inline-block group-hover:translate-x-1 transition-transform duration-200" />
        <span className="absolute inset-0 bg-gradient-to-r from-neonTeal-500/20 to-neonBlue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary relative overflow-hidden group text-xs px-4 py-2 text-center flex items-center"
      >
        Dashboard
        <ChevronDown className={`ml-1 w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        <span className="absolute inset-0 bg-gradient-to-r from-neonTeal-500/20 to-neonBlue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-48 rounded-md shadow-lg bg-black/90 backdrop-blur-sm border border-neonTeal-500/50 overflow-hidden z-50">
          <div className="py-1">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-xs text-gray-100 hover:bg-neonTeal-500/20 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/settings"
              className="block px-4 py-2 text-xs text-gray-100 hover:bg-neonTeal-500/20 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/20 transition-colors duration-200 flex items-center"
            >
              <LogOut className="w-3 h-3 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroDropdown;
