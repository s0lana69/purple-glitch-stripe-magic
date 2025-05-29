'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [acceptedCookies, setAcceptedCookies] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('acceptedCookies');
    if (!hasAccepted) {
      setShowBanner(true);
    } else {
      setAcceptedCookies(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('acceptedCookies', 'true');
    setShowBanner(false);
    setAcceptedCookies(true);
  };

  const handleDecline = () => {
    localStorage.setItem('acceptedCookies', 'false');
    setShowBanner(false);
    setAcceptedCookies(false);
    // Implement any logic to clear cookies here if necessary
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-darkAccent border-t border-gray-800 p-4 flex items-center justify-between">
      <p className="text-gray-400">This website uses cookies to enhance your experience.</p>
      <div>
        <Button variant="secondary" onClick={handleDecline} className="mr-2">
          Decline
        </Button>
        <Button onClick={handleAccept}>Accept</Button>
      </div>
    </div>
  );
};

export default CookieBanner;
