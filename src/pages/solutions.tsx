import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import SolutionsContent from '@/components/SolutionsContent';

export default function Solutions() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Attempt to play the video.
      // Browsers might block autoplay if not muted or if user hasn't interacted.
      // The `muted` and `playsInline` props are crucial for autoplay on mobile.
      video.play().catch(error => {
        console.warn("Video autoplay was potentially blocked by the browser:", error);
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Solutions | TrueViral.ai</title>
        <meta name="description" content="Discover powerful AI-driven solutions for viral content creation and optimization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://trueviral.ai/solutions" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/videos/output.mp4" as="video" type="video/mp4" />
      </Head>
      <main className="text-foreground relative overflow-hidden pt-24 pb-16"> {/* Changed pt-32 to pt-24 */}
        <div className="absolute inset-0 -z-10">
          <video
            ref={videoRef}
            muted // Ensure muted is set
            autoPlay // Autoplay
            loop
            playsInline // Crucial for iOS
            preload="auto" // Revert to auto for more aggressive loading
            className="absolute inset-0 w-full h-full object-cover"
            controls={false} // Explicitly disable controls
          >
            <source src="/videos/output.mp4" type="video/mp4" />
            <source src="/videos/output.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="relative z-10">
          <SolutionsContent />
        </div>
      </main>
    </>
  );
}
