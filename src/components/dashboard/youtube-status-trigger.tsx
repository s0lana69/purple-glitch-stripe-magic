'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/FirebaseAuthContext';

export function YouTubeStatusTrigger() {
  const { user } = useAuth();

  useEffect(() => {
    // Listen for URL changes that indicate YouTube linking completion
    const handleURLChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authCompleted = urlParams.get('auth_completed');
      const flowType = urlParams.get('flow_type');

      if (authCompleted === 'true' && flowType === 'linking') {
        console.log('YouTubeStatusTrigger: YouTube linking detected, triggering status refresh');
        
        // Trigger localStorage event to notify all YouTube status hooks
        localStorage.setItem('youtube-status-changed', Date.now().toString());
        
        // Dispatch custom event for immediate updates
        window.dispatchEvent(new CustomEvent('youtube-connection-updated'));
        
        // Also trigger storage event manually for same-tab detection
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'youtube-status-changed',
          newValue: Date.now().toString(),
          storageArea: localStorage
        }));
        
        // Clean up URL params
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      }
    };

    // Check immediately
    handleURLChange();

    // Listen for navigation changes
    const handlePopState = () => {
      setTimeout(handleURLChange, 100);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Also trigger when user metadata changes
  useEffect(() => {
    if (user) {
      console.log('YouTubeStatusTrigger: User detected, checking for YouTube connection status');
      
      // Small delay to ensure the metadata update is complete
      setTimeout(() => {
        localStorage.setItem('youtube-status-changed', Date.now().toString());
        window.dispatchEvent(new CustomEvent('youtube-connection-updated'));
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'youtube-status-changed',
          newValue: Date.now().toString(),
          storageArea: localStorage
        }));
      }, 500);
    }
  }, [user?.uid]);

  return null; // This component doesn't render anything
}
