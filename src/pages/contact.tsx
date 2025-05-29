'use client';

import React from 'react';
import Link from 'next/link'; // Added import for Link
// import Header from '@/components/Header'; // Assuming you have a Header // Removed
// import Footer from '@/components/Footer'; // Assuming you have a Footer // Removed
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Form submitted! (This is a placeholder)');
  };

  return (
    <div className="min-h-screen text-foreground">
      <main className="pt-24 pb-16"> {/* Changed pt-32 to pt-24 */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold gradient-blue-violet mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              We&apos;d love to hear from you. Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="bg-card p-8 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold text-primary-foreground mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                  <Input type="text" name="name" id="name" required className="w-full" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
                  <Input type="email" name="email" id="email" required className="w-full" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-1">Subject</label>
                  <Input type="text" name="subject" id="subject" required className="w-full" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">Message</label>
                  <Textarea name="message" id="message" rows={4} required className="w-full" />
                </div>
                <div>
                  <Button type="submit" className="w-full btn-transparent-violet">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-card p-6 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold text-primary-foreground mb-3">Contact Information</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-primary" />
                    <span>support@trueviral.ai</span>
                  </li>
                  <li className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-primary" />
                    <span>+1 (555) 123-4567 (Placeholder)</span>
                  </li>
                  <li className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-primary" />
                    <span>123 Viral St, Innovation City, AI (Placeholder)</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold text-primary-foreground mb-3">Frequently Asked Questions</h3>
                <p className="text-muted-foreground mb-4">
                  Have a common question? Check out our FAQ page.
                </p>
                <Button asChild variant="outline">
                  <Link href="/faq">View FAQs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */} {/* Removed */}
    </div>
  );
};

export default ContactPage;
