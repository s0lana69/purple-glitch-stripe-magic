'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'de';

// Language context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.solutions': 'Solutions',
    'nav.faq': 'FAQ',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.affiliate': 'Affiliate Program',
    'nav.earnWithUs': 'Earn with Us',
    'nav.getStarted': 'Get Started',
    'nav.login': 'Log In',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Footer sections
    'footer.platform': 'Platform',
    'footer.resources': 'Resources',
    'footer.company': 'Company',
    'footer.aiContentTools': 'AI Content Tools',
    'footer.seoAnalysis': 'SEO Analysis',
    'footer.viralPrediction': 'Viral Prediction',
    'footer.pricing': 'Pricing',
    'footer.blog': 'Blog (Coming Soon)',
    'footer.caseStudies': 'Case Studies (Coming Soon)',
    'footer.apiDocs': 'API Docs (Coming Soon)',
    'footer.helpCenter': 'Help Center',
    'footer.about': 'About TrueViral.ai',
    'footer.contact': 'Contact Us',
    'footer.affiliate': 'Affiliate Program',
    'footer.careers': 'Careers (We\'re Hiring!)',
    'footer.rights': '© 2025 TrueViral.ai. All rights reserved.',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.cookies': 'Cookie Policy',
    'footer.slogan': 'Unlock viral potential and dominate SEO with our AI-powered content intelligence platform. Because Viral is a Choice!',

    // Dashboard
    'dashboard.logout': 'Logout',
    'dashboard.profile': 'Profile',
    'dashboard.settings': 'Settings',
    'dashboard.dashboard': 'Dashboard',
    'dashboard.tools': 'Tools',
    'dashboard.analytics': 'Analytics',
    'dashboard.content': 'Content',
    'dashboard.audience': 'Audience',
    'dashboard.toggleMenu': 'Toggle Menu',
    'dashboard.signOut': 'Sign out',
    'dashboard.user': 'User',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.solutions': 'Lösungen',
    'nav.faq': 'FAQ',
    'nav.pricing': 'Preise',
    'nav.contact': 'Kontakt',
    'nav.affiliate': 'Partnerprogramm',
    'nav.earnWithUs': 'Mit uns verdienen',
    'nav.getStarted': 'Loslegen',
    'nav.login': 'Anmelden',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Einstellungen',
    'nav.logout': 'Abmelden',
    
    // Footer sections
    'footer.platform': 'Plattform',
    'footer.resources': 'Ressourcen',
    'footer.company': 'Unternehmen',
    'footer.aiContentTools': 'KI-Content-Tools',
    'footer.seoAnalysis': 'SEO-Analyse',
    'footer.viralPrediction': 'Viral-Prognose',
    'footer.pricing': 'Preise',
    'footer.blog': 'Blog (Demnächst)',
    'footer.caseStudies': 'Fallstudien (Demnächst)',
    'footer.apiDocs': 'API-Dokumentation (Demnächst)',
    'footer.helpCenter': 'Hilfe-Center',
    'footer.about': 'Über TrueViral.ai',
    'footer.contact': 'Kontakt',
    'footer.affiliate': 'Partnerprogramm',
    'footer.careers': 'Karriere (Wir stellen ein!)',
    'footer.rights': '© 2025 TrueViral.ai. Alle Rechte vorbehalten.',
    'footer.terms': 'Nutzungsbedingungen',
    'footer.privacy': 'Datenschutzrichtlinie',
    'footer.cookies': 'Cookie-Richtlinie',
    'footer.slogan': 'Nutzen Sie virales Potenzial und dominieren Sie SEO mit unserer KI-gestützten Content-Intelligence-Plattform. Denn Viral ist eine Entscheidung!',

    // Dashboard
    'dashboard.logout': 'Abmelden',
    'dashboard.profile': 'Profil',
    'dashboard.settings': 'Einstellungen',
    'dashboard.dashboard': 'Dashboard',
    'dashboard.tools': 'Werkzeuge',
    'dashboard.analytics': 'Analyse',
    'dashboard.content': 'Inhalt',
    'dashboard.audience': 'Follower',
    'dashboard.toggleMenu': 'Menü umschalten',
    'dashboard.signOut': 'Abmelden',
    'dashboard.user': 'Benutzer',
  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Function to translate keys
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Detect browser language on mount
  useEffect(() => {
    const detectLanguage = () => {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'de') {
        setLanguage('de');
      }
      
      // Check localStorage for saved preference
      const savedLang = localStorage.getItem('preferredLanguage') as Language;
      if (savedLang && (savedLang === 'en' || savedLang === 'de')) {
        setLanguage(savedLang);
      }
    };
    
    detectLanguage();
  }, []);

  // Store language preference in localStorage
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);
