'use client';

import React from 'react';
import { useLanguage, Language } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className={cn("flex items-center", className)}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code as Language)}
          className={cn(
            "text-lg mx-1 transition-all hover:opacity-100",
            language === lang.code ? "opacity-100 scale-110" : "opacity-60"
          )}
          title={lang.label}
          aria-label={`Switch to ${lang.label}`}
        >
          <span className="text-lg">{lang.flag}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
