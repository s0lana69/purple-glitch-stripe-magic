'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Added Image import
import { cn } from '@/lib/utils';
import { BarChart3, ChevronLeft, Home, LayoutDashboard, Settings, Users, Video, Zap } from 'lucide-react'; // Added Zap back
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { ModeToggle } from '@/components/mode-toggle'; // Added ModeToggle import
import { ProBadge } from '@/components/ui/pro-badge';

interface NavItemProps {
  icon: React.ElementType;
  title: string;
  href: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  requiresSubscription?: boolean;
  hasAccess?: boolean;
}

function NavItem({ icon: Icon, title, href, isActive, isCollapsed, onClick, requiresSubscription = false, hasAccess = true }: NavItemProps) {
  const isDisabled = requiresSubscription && !hasAccess;
  
  const content = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
        isActive && hasAccess
          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.5)] dark:shadow-[0_0_12px_rgba(192,132,252,0.5)]' // Active: Purple bg, purple text, subtle purple glow
          : isDisabled
          ? 'text-muted-foreground/50 cursor-not-allowed opacity-60' // Disabled: Greyed out
          : 'text-muted-foreground hover:bg-purple-100/70 dark:hover:bg-purple-900/70 hover:text-purple-700 dark:hover:text-purple-300', // Normal: Muted text, on hover: lighter purple bg & purple text
        isCollapsed && 'justify-center py-3',
      )}
      onClick={isDisabled ? undefined : onClick}
    >
      <Icon className={cn('h-5 w-5', isCollapsed ? 'mr-0' : 'mr-2')} />
      {!isCollapsed && (
        <div className="flex items-center justify-between w-full">
          <span>{title}</span>
          {requiresSubscription && !hasAccess && <ProBadge size="sm" />}
        </div>
      )}
    </div>
  );

  if (isDisabled) {
    return content;
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  );
}

import { X } from 'lucide-react'; // Import X icon for close button

interface DashboardSidebarProps {
  isOpen: boolean; 
  onToggleSidebarAction: () => void; 
  isMobileView?: boolean;
  // Props for controlled collapse state (primarily for desktop)
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export function DashboardSidebar({ 
  isOpen, 
  onToggleSidebarAction, 
  isMobileView,
  isCollapsed: isCollapsedProp, // Renaming for clarity
  setIsCollapsed: setIsCollapsedProp // Renaming for clarity
}: DashboardSidebarProps) {
  // Internal state for collapse if not controlled, primarily for simplicity if used standalone.
  // However, for DashboardShell integration, we'll rely on isCollapsedProp.
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  // Determine effective collapse state and setter
  const isEffectivelyCollapsed = isMobileView ? false : (setIsCollapsedProp !== undefined ? isCollapsedProp! : internalIsCollapsed);
  const setEffectiveIsCollapsed = setIsCollapsedProp !== undefined ? setIsCollapsedProp : setInternalIsCollapsed;
  
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const { hasServiceAccess } = useSubscription();

  // Define all nav items with access requirements
  const allNavItems = [
    { icon: LayoutDashboard, title: t('dashboard.dashboard'), href: '/dashboard', requiresSubscription: true },
    { icon: Zap, title: t('dashboard.tools'), href: '/dashboard/tools', requiresSubscription: true },
    { icon: BarChart3, title: t('dashboard.analytics'), href: '/dashboard/analytics', requiresSubscription: true },
    { icon: Video, title: t('dashboard.content'), href: '/dashboard/content', requiresSubscription: true },
    { icon: Users, title: t('dashboard.audience'), href: '/dashboard/audience', requiresSubscription: true },
    { icon: Settings, title: t('dashboard.settings'), href: '/dashboard/settings', requiresSubscription: false },
  ];

  // Show all nav items, access control is handled in NavItem component
  const navItems = allNavItems;

  // For mobile overlay, clicking a nav item should close the overlay.
  const handleNavItemClick = () => {
    if (isMobileView) {
      onToggleSidebarAction(); // This closes the mobile overlay
    }
  };

  return (
    <aside
      className='flex flex-col transition-all duration-300 ease-in-out w-full h-full'
    >
      {/* Header for the sidebar */}
      <div className={cn(
          "flex h-16 items-center border-b px-4",
          isMobileView ? "justify-between" : (isEffectivelyCollapsed ? "justify-center" : "justify-between")
        )}>
        {!isEffectivelyCollapsed && ( // Use isEffectivelyCollapsed
          <Link href="/dashboard" className="flex items-center gap-2 group" onClick={handleNavItemClick}>
            <Image
              src="/icon/logo_hold.png"
              alt="TrueViral Logo"
              width={24}
              height={24}
              className="mr-1 group-hover:opacity-80 transition-opacity thicker-logo-effect"
            />
            <span className="text-lg font-bold gradient-blue-violet group-hover:opacity-80 transition-opacity">TrueViral</span>
          </Link>
        )}
        {/* Desktop: Collapse/Expand button */}
        {!isMobileView && isOpen && !isEffectivelyCollapsed && ( // Use isEffectivelyCollapsed
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEffectiveIsCollapsed(true)} // Use setEffectiveIsCollapsed
            className="hidden md:flex text-muted-foreground hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-700 dark:hover:text-purple-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        {/* Desktop: Logo when collapsed (acts as expand) */}
        {!isMobileView && isOpen && isEffectivelyCollapsed && ( // Use isEffectivelyCollapsed
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEffectiveIsCollapsed(false)} // Use setEffectiveIsCollapsed
            className="hidden md:flex text-muted-foreground hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-700 dark:hover:text-purple-300"
          >
            <Image src="/icon/logo_hold.png" alt="TrueViral Logo" width={24} height={24} className="thicker-logo-effect"/>
          </Button>
        )}
        {/* Mobile: Close button for the overlay */}
        {isMobileView && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebarAction} className="text-foreground">
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        )}
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              title={item.title}
              href={item.href}
              isActive={!!pathname && (item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href))}
              isCollapsed={isEffectivelyCollapsed} // Use isEffectivelyCollapsed
              onClick={handleNavItemClick} // Close mobile menu on item click
              requiresSubscription={item.requiresSubscription}
              hasAccess={hasServiceAccess}
            />
          ))}
        </nav>
      </div>

      {/* Footer section for ModeToggle */}
      <div className="mt-auto p-4 border-t">
        {isEffectivelyCollapsed ? ( // Use isEffectivelyCollapsed
          <div className="flex justify-center">
            <ModeToggle />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {/* Removed the text label for themeMode */}
            <ModeToggle />
            {isMobileView && <div className="h-8"></div>} {/* Add some padding at bottom for mobile view */}
          </div>
        )}
      </div>
    </aside>
  );
}
