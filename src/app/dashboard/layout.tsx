import type { Metadata } from 'next';
import DashboardClientLayout from '@/components/dashboard/DashboardClientLayout';
import React from 'react';

export const metadata: Metadata = {
  title: 'Dashboard - TrueViral.ai',
  description: 'Monitor and manage your content performance with AI-powered analytics',
  alternates: {
    canonical: 'https://trueviral.ai/dashboard',
  },
  robots: {
    index: false, // Dashboard should not be indexed
    follow: false,
  },
};

export default function DashboardAppLayout({ children }: { children: React.ReactNode }) {
  // Server component that doesn't directly use auth
  return (
    <DashboardClientLayout>
      {children}
    </DashboardClientLayout>
  );
}
