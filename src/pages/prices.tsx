import React from 'react';
import Head from 'next/head';
// import Header from '@/components/Header'; // Removed
// import Footer from '@/components/Footer'; // Removed
import PricingContent from '@/components/PricingContent';
import dynamic from 'next/dynamic';

// Dynamically import the subscription-aware component to avoid SSR issues
const PricingWithSubscription = dynamic(
  () => import('@/components/PricingWithSubscription'),
  {
    ssr: false,
    loading: () => <PricingContent />
  }
);

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Pricing | TrueViral.ai</title>
        <meta name="description" content="Choose the perfect plan for your viral content journey with TrueViral.ai" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://trueviral.ai/prices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Header /> */} {/* Removed */}
      <main className="text-foreground relative overflow-x-hidden min-h-screen">
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            left: 0,
            top: 0,
            objectFit: 'cover',
            zIndex: -1,
          }}
        >
          <source src="/videos/smoke4k_short.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 pt-24 pb-16 min-h-screen">
          <PricingWithSubscription />
        </div>
      </main>
      {/* <Footer /> */} {/* Removed */}
    </>
  );
}
