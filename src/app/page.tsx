'use client';
test
import { Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeatureHighlights from '@/components/FeatureHighlights';
import ScalabilitySection from '@/components/ScalabilitySection';
import Testimonials from '@/components/Testimonials';
import FinalCta from '@/components/FinalCta';
import { OAuthHandler } from '@/components/auth/OAuthHandler';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark text-white">
      <Suspense fallback={null}>
        <OAuthHandler />
      </Suspense>
      <Header />
      <HeroSection />
      <FeatureHighlights />
      <ScalabilitySection />
      <Testimonials />
      <FinalCta />
    </div>
  );
}
