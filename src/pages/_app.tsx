import type { AppProps } from 'next/app';
import '@/app/globals.css'; // Use the App Router's global styles for consistency
import { ClientLayout } from '@/components/ClientLayout';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProviders } from '@/components/providers';

// Font setup to match the App Router
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={cn("gradient-background", inter.variable)}>
      <LanguageProvider>
        <AuthProviders>
          <ClientLayout> {/* ClientLayout wraps all pages router pages */}
            <Component {...pageProps} />
          </ClientLayout>
        </AuthProviders>
      </LanguageProvider>
    </div>
  );
}

export default MyApp;
