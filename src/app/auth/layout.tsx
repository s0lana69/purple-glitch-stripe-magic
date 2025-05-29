import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login & Sign Up - TrueViral.ai',
  description: 'Access your TrueViral.ai account to unlock viral content potential',
  alternates: {
    canonical: 'https://trueviral.ai/auth',
  },
  robots: {
    index: false, // Auth pages should not be indexed
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
