import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - TrueViral.ai Dashboard',
  description: 'Manage your account settings and connected services',
  alternates: {
    canonical: 'https://trueviral.ai/dashboard/settings',
  },
  robots: {
    index: false, // Settings should not be indexed
    follow: false,
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
