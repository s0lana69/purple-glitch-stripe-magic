'use client';

import { Zap, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link'; // Import Link
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { ModeToggle } from '@/components/mode-toggle'; // Added ModeToggle import

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  const footerSections = [
    {
      title: t('footer.platform'),
      links: [
        { label: t('footer.aiContentTools'), href: "/solutions#content-generation" },
        { label: t('footer.seoAnalysis'), href: "/solutions#seo-analysis" },
        { label: t('footer.viralPrediction'), href: "/solutions#viral-prediction" },
        { label: t('footer.pricing'), href: "/prices" },
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { label: t('footer.blog'), href: "#blog" },
        { label: t('footer.caseStudies'), href: "#case-studies" },
        { label: t('footer.apiDocs'), href: "#api-docs" },
        { label: t('footer.helpCenter'), href: "/faq" },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.about'), href: "/faq#about" }, // Assuming about is in FAQ
        { label: t('footer.contact'), href: "/contact" },
        { label: t('footer.affiliate'), href: "/affiliate" },
        { label: t('footer.careers'), href: "#careers" },
      ],
    },
  ];

  const socialLinks = [
    { label: "Twitter", href: "https://twitter.com/trueviralai", icon: <Twitter className="h-5 w-5" /> },
    { label: "GitHub", href: "https://github.com/trueviralai", icon: <Github className="h-5 w-5" /> },
    { label: "LinkedIn", href: "https://linkedin.com/company/trueviralai", icon: <Linkedin className="h-5 w-5" /> },
    { label: "Email", href: "mailto:info@trueviral.ai", icon: <Mail className="h-5 w-5" /> },
  ];

  return (
    <footer className="bg-gradient-to-b from-[hsl(var(--secondary))] from-0% to-black to-70% border-t border-border pt-16 pb-8 text-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Slogan Section - Centered on mobile/tablet */}
          <div className="lg:col-span-2 flex flex-col items-center text-center lg:items-start lg:text-left">
            <Link href="/" className="flex items-center justify-center lg:justify-start mb-4 group"> {/* justify-center for internal content on mobile/tablet */}
              <Zap className={cn("h-7 w-7 mr-2.5 gradient-blue-violet group-hover:opacity-80 transition-opacity")} />
              <span className={cn("text-2xl font-bold gradient-blue-violet group-hover:opacity-80 transition-opacity")}>
                TrueViral.ai
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-md"> {/* Inherits text-center from parent div, lg:text-left also from parent */}
              {t('footer.slogan')}
            </p>
            <div className="flex flex-col items-center lg:items-start gap-4"> {/* Outer container for social links and mode toggle */}
              <div className="flex items-center space-x-4 justify-center lg:justify-start"> {/* justify-center for internal content on mobile/tablet */}
                {socialLinks.map(social => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {social.icon}
                  </a>
                ))}
                {/* Language selector with same styling as social icons */}
                <LanguageSelector className="border-l border-border/30 pl-4 ml-1" />
              </div>
              <div className="mt-2"> {/* Add some margin-top for spacing */}
                <ModeToggle />
              </div>
            </div>
          </div>

          {/* Link Sections - Centered on mobile/tablet */}
          {footerSections.map(section => (
            <div key={section.title} className="text-center lg:text-left"> {/* text-center for h3 and li content on mobile/tablet */}
              <h3 className="text-base font-semibold mb-4 text-primary-foreground">{section.title}</h3>
              <ul className="space-y-3"> {/* List items will inherit text-center */}
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col lg:flex-row justify-between items-center text-center lg:text-left">
          <p className="text-muted-foreground text-xs mb-4 lg:mb-0">
            {t('footer.rights').replace('2025', new Date().getFullYear().toString())}
          </p>
          <div className="flex space-x-4 sm:space-x-6 justify-center lg:justify-start">
            <Link href="#terms" className="text-muted-foreground hover:text-primary text-xs transition-colors duration-200">
              {t('footer.terms')}
            </Link>
            <Link href="#privacy" className="text-muted-foreground hover:text-primary text-xs transition-colors duration-200">
              {t('footer.privacy')}
            </Link>
            <Link href="#cookies" className="text-muted-foreground hover:text-primary text-xs transition-colors duration-200">
              {t('footer.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
