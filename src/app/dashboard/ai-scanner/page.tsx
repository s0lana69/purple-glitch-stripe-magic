import React from 'react';
import { Metadata } from 'next';
import AiScannerContent from '@/components/dashboard/ai-scanner-content';

export const metadata: Metadata = {
  title: 'AI Scanner - TrueViral.ai Dashboard',
  description: 'AI-powered YouTube content analysis and SEO optimization using Google Gemini 2.0',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AiScannerPage() {
  return <AiScannerContent />;
}
