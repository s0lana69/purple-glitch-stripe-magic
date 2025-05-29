'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeAwareYouTubeIcon({ width = 100, height = 28, className = '' }: { width?: number, height?: number, className?: string }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null to avoid hydration mismatch
    return <div style={{ width: `${width}px`, height: `${height}px` }} className={className} />;
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const textColor = currentTheme === 'dark' ? 'white' : 'black'; // White text for dark mode, black for light mode

  // Standard YouTube red color for the play button icon
  const playButtonColor = "#FF0000";

  return (
    <div className={`flex items-center ${className}`} style={{ width: `${width}px`, height: `${height}px` }}>
      {/* YouTube Play Button SVG */}
      <svg 
        width="36" // Adjusted for proportion with text
        height="25" // Adjusted for proportion with text
        viewBox="0 0 36 25" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="mr-1.5" // Add some space between icon and text
      >
        <path 
          d="M35.2729 3.956C34.8489 2.39867 33.6629 1.21267 32.1055 0.788C29.2995 0 18.0002 0 18.0002 0C18.0002 0 6.70088 0 3.89488 0.788C2.33754 1.21267 1.15154 2.39867 0.727544 3.956C0.000199201 6.78667 0.000199201 12.5 0.000199201 12.5C0.000199201 12.5 0.000199201 18.2133 0.727544 21.044C1.15154 22.6013 2.33754 23.7873 3.89488 24.212C6.70088 25 18.0002 25 18.0002 25C18.0002 25 29.2995 25 32.1055 24.212C33.6629 23.7873 34.8489 22.6013 35.2729 21.044C35.9995 18.2133 35.9995 12.5 35.9995 12.5C35.9995 12.5 35.9995 6.78667 35.2729 3.956Z" 
          fill={playButtonColor}
        />
        <path d="M14.3398 17.8574L23.7138 12.5004L14.3398 7.14337V17.8574Z" fill="white"/>
      </svg>
      {/* YouTube Text */}
      <span 
        style={{ color: textColor, fontSize: '1.125rem', fontWeight: 600, lineHeight: '1.75rem' }} // Corresponds to text-lg font-semibold
      >
        YouTube
      </span>
    </div>
  );
}
