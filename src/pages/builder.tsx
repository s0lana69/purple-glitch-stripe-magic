import React, { useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { Construction } from 'lucide-react'; // Icon for under construction

const BuilderPage: React.FC = () => {
  const [selectedHtml, setSelectedHtml] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (previewRef.current && previewRef.current.contains(target)) {
      setSelectedHtml(target.outerHTML);
    }
  };

  return (
    <>
      <Head>
        <title>Content Builder (Preview) | TrueViral.ai</title>
        <meta name="description" content="Preview of the upcoming TrueViral.ai content builder and element inspector." />
      </Head>
      <Header />
      <main className="min-h-screen bg-background text-foreground pt-24 sm:pt-32 pb-16">
        <section className="relative">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
              <Construction className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Content Builder & Inspector (Coming Soon)</h1>
              <p className="text-muted-foreground mb-8 text-base sm:text-lg">
                This page will feature our powerful AI-driven content builder. For now, you can click elements in the preview below to inspect their HTML.
              </p>
            </div>
            <div
              ref={previewRef}
              className="bg-card rounded-xl p-6 sm:p-8 shadow-lg border border-border cursor-pointer min-h-[300px] flex flex-col items-center justify-center"
              onClick={handleElementClick}
            >
              <div className="p-4 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-primary-foreground">Interactive Preview Area</h2>
                <p className="text-muted-foreground mb-2">Click on any text or element here.</p>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                  Sample Button
                </button>
                <div className="mt-4 p-3 border border-dashed border-border rounded">
                  <span className="text-foreground">This is a clickable span.</span>
                </div>
              </div>
            </div>
            {selectedHtml && (
              <div className="mt-8 p-4 bg-secondary text-neonGreen-500 rounded-lg shadow-lg overflow-auto max-h-96 border border-border">
                <h2 className="font-semibold mb-2 text-primary-foreground">Selected Element HTML:</h2>
                <pre className="whitespace-pre-wrap break-all text-xs">{selectedHtml}</pre>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BuilderPage;
