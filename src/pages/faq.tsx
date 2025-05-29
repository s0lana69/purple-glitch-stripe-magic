import React from 'react';
import Head from 'next/head';
// import Header from '@/components/Header'; // Removed
// import Footer from '@/components/Footer'; // Removed
import FAQComponent from '@/components/FAQ';

export default function FAQ() {
  return (
    <>
      <Head>
        <title>FAQ | TrueViral.ai</title>
        <meta name="description" content="Frequently asked questions about TrueViral.ai AI-powered content optimization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://trueviral.ai/faq" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Header /> */} {/* Removed */}
      <main className="text-foreground relative overflow-x-hidden pt-32 pb-16">
        <FAQComponent />
      </main>
      {/* <Footer /> */} {/* Removed */}
    </>
  );
}
