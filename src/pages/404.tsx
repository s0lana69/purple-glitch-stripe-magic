import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Zap, AlertTriangle } from 'lucide-react'; // Using AlertTriangle for error
import { Button } from '@/components/ui/button';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
      <Head>
        <title>Page Not Found | TrueViral.ai</title>
        <meta name="description" content="The page you are looking for could not be found on TrueViral.ai." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center mb-8">
        <Zap className="h-8 w-8 text-primary mr-2" />
        <span className="text-2xl font-bold text-primary-foreground">TrueViral.ai</span>
      </div>

      <div className="bg-card p-8 sm:p-10 rounded-xl max-w-md w-full border border-border shadow-xl text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-primary-foreground">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
