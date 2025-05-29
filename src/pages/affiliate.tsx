import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import Link from 'next/link';
import { LinkIcon, UsersIcon, GiftIcon, MailIcon, ArrowRight, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AffiliatePage: React.FC = () => {
  const steps = [
    {
      icon: <LinkIcon className="w-10 h-10 mb-4 text-primary" />,
      title: '1. Sign Up & Get Your Link',
      description: 'Join our affiliate program quickly and receive your unique referral link instantly. It takes less than 2 minutes!',
    },
    {
      icon: <UsersIcon className="w-10 h-10 mb-4 text-primary" />,
      title: '2. Promote TrueViral.ai',
      description: 'Share your link with your audience, network, and on your platforms. We provide marketing assets and support to help you succeed.',
    },
    {
      icon: <GiftIcon className="w-10 h-10 mb-4 text-primary" />,
      title: '3. Earn Generous Commissions',
      description: 'Receive a competitive, 20% recurring commission for every new paying customer you refer to TrueViral.ai. No earning caps!',
    },
  ];

  const benefits = [
    { icon: <DollarSign className="w-6 h-6 text-neonGreen-500 mr-3" />, text: "Generous 20% recurring commissions on all referred sales." },
    { icon: <TrendingUp className="w-6 h-6 text-neonBlue-500 mr-3" />, text: "Promote a high-demand, cutting-edge AI SaaS product." },
    { icon: <CheckCircle className="w-6 h-6 text-primary mr-3" />, text: "Long 90-day cookie duration to maximize your earnings." },
    { icon: <MailIcon className="w-6 h-6 text-neonMagenta-500 mr-3" />, text: "Dedicated affiliate support and marketing materials." },
  ];

  return (
    <>
      <Head>
        <title>Affiliate Program | TrueViral.ai - Earn by Promoting AI</title>
        <meta
          name="description"
          content="Partner with TrueViral.ai and earn substantial recurring commissions by promoting our leading AI-powered SEO and content virality platform."
        />
      </Head>
      <Header />
      <main className="bg-background text-foreground relative overflow-x-hidden min-h-screen pt-24 sm:pt-32">
        <section className="py-16 md:py-20 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-primary-foreground">
              Partner with <span className="gradient-blue-violet">TrueViral.ai</span> & Grow Together
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join our affiliate program and earn a 20% recurring commission on all payments from customers you refer. Help others achieve viral success while boosting your income.
            </p>
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-3.5">
              <Link href="/contact?subject=Affiliate%20Program%20Application">
                Become a TrueViral Affiliate <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-secondary">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-center text-primary-foreground">
              How It Works: Simple Steps to Success
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-card p-8 rounded-xl shadow-xl border border-border hover:border-primary/70 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center md:items-start text-center md:text-left"
                >
                  <div className="mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-base">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-primary-foreground">Why Partner with TrueViral.ai?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-left">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start p-4 bg-card rounded-lg border border-border">
                  {benefit.icon}
                  <span className="text-muted-foreground text-base">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-20 md:py-28 text-center bg-secondary">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
            <MailIcon className="w-12 h-12 mb-6 text-primary mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-primary-foreground">Ready to Start Earning?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our dedicated affiliate support team is here to help you succeed. If you have any questions, contact us at{' '}
              <a href="mailto:affiliates@trueviral.ai" className="text-primary hover:underline">
                affiliates@trueviral.ai
              </a>.
            </p>
            <Button variant="outline" size="lg" asChild className="border-primary text-primary hover:bg-primary/10 hover:text-primary text-lg px-8 py-3.5">
              <Link href="/contact?subject=Affiliate%20Program%20Question">
                Contact Affiliate Support
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AffiliatePage;
