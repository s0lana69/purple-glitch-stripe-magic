'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
  const { setTheme } = useTheme(); // Removed theme, isLightModeActive as default bg is not teal

  const buttonClasses = `
    w-9 h-9 /* Reduced size from w-[2.5rem] h-[2.5rem] */
    border-purple-400 dark:border-purple-600 
    text-white /* Icons should be white */
    hover:bg-purple-100 dark:hover:bg-purple-900 
    hover:text-purple-700 dark:hover:text-purple-300 /* Text color change on hover for icons */
    focus-visible:ring-purple-500
    bg-transparent /* Ensure transparent background by default */
  `;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={buttonClasses.trim()}>
          {/* Ensure icons are white by default, hover color will be handled by parent button's text color change */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border-purple-400 dark:border-purple-600">
        <DropdownMenuItem 
          onClick={() => setTheme('light')} 
          className="hover:bg-purple-100 dark:hover:bg-purple-900 focus:bg-purple-200 dark:focus:bg-purple-800"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="hover:bg-purple-100 dark:hover:bg-purple-900 focus:bg-purple-200 dark:focus:bg-purple-800"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="hover:bg-purple-100 dark:hover:bg-purple-900 focus:bg-purple-200 dark:focus:bg-purple-800"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
