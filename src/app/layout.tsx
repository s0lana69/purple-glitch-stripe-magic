import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css'; // Global styles for app router
import { ClientLayout } from '@/components/ClientLayout';
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProviders } from '@/components/providers';
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL('https://trueviral.ai'),
  title: 'TrueViral.ai - Because Viral is a Choice',
  description: 'Unlock viral potential and dominate SEO with our AI-powered content intelligence platform.',
  keywords: 'AI content optimization, viral content, SEO, social media analytics, content intelligence',
  authors: [{ name: 'TrueViral.ai' }],
  creator: 'TrueViral.ai',
  publisher: 'TrueViral.ai',
  icons: {
    icon: '/icon/logo_hold.png',
  },
  alternates: {
    canonical: 'https://trueviral.ai',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trueviral.ai',
    title: 'TrueViral.ai - Because Viral is a Choice',
    description: 'Unlock viral potential and dominate SEO with our AI-powered content intelligence platform.',
    siteName: 'TrueViral.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrueViral.ai - Because Viral is a Choice',
    description: 'Unlock viral potential and dominate SEO with our AI-powered content intelligence platform.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <LanguageProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased gradient-background",
            inter.variable
          )}
        >
          <AuthProviders>
            <ClientLayout>{children}</ClientLayout> {/* ClientLayout wraps all app router pages */}
          </AuthProviders>
          <Analytics />
        </body>
      </LanguageProvider>
    </html>
  );
}
