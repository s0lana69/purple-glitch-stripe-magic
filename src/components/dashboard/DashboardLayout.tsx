'use client'; // Add "use client" directive

import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-shell';
import { LogoutButton } from '@/components/auth/LogoutButton'; // Import LogoutButton

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // Initialize sidebar state based on screen width
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768; // md breakpoint
    }
    return true; // Default for SSR or non-browser environments
  });

  useEffect(() => {
    const mdBreakpoint = 768;
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < mdBreakpoint) {
        if (isSidebarOpen) setIsSidebarOpen(false);
      } else {
        if (!isSidebarOpen) setIsSidebarOpen(true);
      }
    };
    
    // Call once to set initial state based on current width
    handleResize(); 

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]); // Rerun if isSidebarOpen changes to correctly re-evaluate or re-attach

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar isOpen={isSidebarOpen} onToggleSidebarAction={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          isSidebarOpen={isSidebarOpen} 
          onMenuClickAction={toggleSidebar} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
