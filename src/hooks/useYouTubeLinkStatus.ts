'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

interface YouTubeLinkStatus {
  isYouTubeLinked: boolean;
  isLoading: boolean;
  error: string | null;
  channelName: string | null;
  refresh: () => void;
}

// Global cache to prevent redundant API calls
let globalCache: {
  lastCheck: number;
  result: { isYouTubeLinked: boolean; channelName: string | null; error: string | null };
  requestPromise: Promise<any> | null;
} | null = null;

const CACHE_DURATION = 30 * 1000; // 30 seconds cache (shorter for better responsiveness)
const MIN_REQUEST_INTERVAL = 5 * 1000; // 5 seconds minimum between requests

export function useYouTubeLinkStatus(): YouTubeLinkStatus {
  const { user, loading: authLoading } = useAuth();
  const [isYouTubeLinked, setIsYouTubeLinked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [channelName, setChannelName] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const checkYouTubeStatus = useCallback(async (forceRefresh = false) => {
    // Don't check if still loading auth or no user
    if (authLoading) return;
    
    if (!user) {
      setIsLoading(false);
      setIsYouTubeLinked(false);
      setChannelName(null);
      setError(null);
      return;
    }

    const now = Date.now();

    // Check if we should use cached result
    if (!forceRefresh && globalCache && now - globalCache.lastCheck < CACHE_DURATION) {
      console.log('useYouTubeLinkStatus: Using cached result');
      setIsYouTubeLinked(globalCache.result.isYouTubeLinked);
      setChannelName(globalCache.result.channelName);
      setError(globalCache.result.error);
      setIsLoading(false);
      return;
    }

    // Check minimum interval unless forced
    if (!forceRefresh && globalCache && now - globalCache.lastCheck < MIN_REQUEST_INTERVAL) {
      console.log('useYouTubeLinkStatus: Request too frequent, using cached result');
      setIsYouTubeLinked(globalCache.result.isYouTubeLinked);
      setChannelName(globalCache.result.channelName);
      setError(globalCache.result.error);
      setIsLoading(false);
      return;
    }

    // If there's already a request in progress and we're not forcing, wait for it
    if (globalCache?.requestPromise && !forceRefresh) {
      console.log('useYouTubeLinkStatus: Request already in progress, waiting...');
      try {
        await globalCache.requestPromise;
        if (globalCache) {
          setIsYouTubeLinked(globalCache.result.isYouTubeLinked);
          setChannelName(globalCache.result.channelName);
          setError(globalCache.result.error);
        }
        setIsLoading(false);
        return;
      } catch (err) {
        console.error('useYouTubeLinkStatus: Error waiting for in-progress request:', err);
      }
    }

    console.log('useYouTubeLinkStatus: Starting fresh status check');
    setIsLoading(true);
    setError(null);

    // Create the API request promise
    const requestPromise = (async () => {
      try {
        // Check the API for actual token validation
        const response = await fetch('/api/youtube/check-status', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Cache-Control': forceRefresh ? 'no-cache' : 'max-age=30',
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        return {
          isYouTubeLinked: data.connected || false,
          channelName: data.channelName || null,
          error: data.connected ? null : (data.error || 'YouTube not connected')
        };
      } catch (err: any) {
        console.error('useYouTubeLinkStatus: API request failed:', err);
        
        return {
          isYouTubeLinked: false,
          channelName: null,
          error: err.message || 'Failed to check YouTube connection'
        };
      }
    })();

    // Initialize cache if needed
    if (!globalCache) {
      globalCache = {
        lastCheck: 0,
        result: { isYouTubeLinked: false, channelName: null, error: null },
        requestPromise: null
      };
    }

    // Store the promise
    globalCache.requestPromise = requestPromise;

    try {
      const result = await requestPromise;
      
      // Update cache
      globalCache = {
        lastCheck: now,
        result,
        requestPromise: null
      };

      // Update component state
      setIsYouTubeLinked(result.isYouTubeLinked);
      setChannelName(result.channelName);
      setError(result.error);

    } catch (err: any) {
      console.error('useYouTubeLinkStatus: Unexpected error:', err);
      setIsYouTubeLinked(false);
      setChannelName(null);
      setError('An unexpected error occurred');
      
      // Update cache with error
      globalCache = {
        lastCheck: now,
        result: { isYouTubeLinked: false, channelName: null, error: 'Unexpected error' },
        requestPromise: null
      };
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const refresh = useCallback(() => {
    console.log('useYouTubeLinkStatus: Manual refresh triggered');
    // Clear cache to force fresh request
    globalCache = null;
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Check status when component mounts or dependencies change
  useEffect(() => {
    if (!authLoading) {
      checkYouTubeStatus();
    }
  }, [refreshTrigger, authLoading]);

  // Listen for URL parameters indicating successful linking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authCompleted = urlParams.get('auth_completed');
      const flowType = urlParams.get('flow_type');

      if (authCompleted === 'true' && flowType === 'linking') {
        console.log('useYouTubeLinkStatus: Detected successful linking, refreshing status');
        
        // Clear URL parameters
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', newUrl);
        
        // Clear cache and force immediate refresh
        globalCache = null;
        
        // Use multiple attempts with increasing delays to ensure we catch the update
        const attemptRefresh = async (attempt: number = 1) => {
          console.log(`useYouTubeLinkStatus: Refresh attempt ${attempt} after linking`);
          
          await checkYouTubeStatus(true); // Force immediate check
          
          // Wait and check if the status changed
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check current status and retry if needed
          const currentStatus = globalCache?.result?.isYouTubeLinked;
          if (attempt < 5 && !currentStatus) {
            setTimeout(() => attemptRefresh(attempt + 1), attempt * 2000);
          } else if (currentStatus) {
            console.log(`useYouTubeLinkStatus: Successfully detected YouTube linking after ${attempt} attempts`);
          } else {
            console.warn(`useYouTubeLinkStatus: Failed to detect YouTube linking after ${attempt} attempts`);
          }
        };
        
        // Start the refresh process after a short delay
        setTimeout(() => attemptRefresh(), 1000);
      }
    };

    // Check immediately
    checkUrlParams();

    // Also check when the URL changes (in case of navigation)
    const handlePopState = () => {
      setTimeout(checkUrlParams, 100);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Remove checkYouTubeStatus dependency to prevent infinite loops

  // Listen for storage events from other tabs and contexts
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'youtube-status-changed') {
        console.log('useYouTubeLinkStatus: YouTube status changed in another tab');
        globalCache = null; // Clear cache
        checkYouTubeStatus(true); // Force immediate check
      }
    };

    const handleWindowEvent = (e: Event) => {
      if (e.type === 'storage') {
        console.log('useYouTubeLinkStatus: YouTube status changed via window event');
        globalCache = null; // Clear cache
        checkYouTubeStatus(true); // Force immediate check
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleWindowEvent);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleWindowEvent);
    };
  }, []); // Remove checkYouTubeStatus dependency to prevent infinite loops

  // Listen for YouTube connection events from AuthContext
  useEffect(() => {
    const handleYouTubeConnection = () => {
      console.log('useYouTubeLinkStatus: YouTube connection event detected');
      globalCache = null; // Clear cache
      checkYouTubeStatus(true); // Force immediate check
    };

    // Check if there's a stored event indicating recent YouTube connection
    const recentConnection = localStorage.getItem('youtube-status-changed');
    if (recentConnection) {
      const timestamp = parseInt(recentConnection);
      const now = Date.now();
      // If the connection event was within the last 30 seconds, trigger a refresh
      if (now - timestamp < 30000) {
        console.log('useYouTubeLinkStatus: Recent YouTube connection detected from localStorage');
        setTimeout(handleYouTubeConnection, 500);
      }
    }

    // Listen for custom events
    window.addEventListener('youtube-connection-updated', handleYouTubeConnection);
    
    return () => {
      window.removeEventListener('youtube-connection-updated', handleYouTubeConnection);
    };
  }, []); // Remove checkYouTubeStatus dependency to prevent infinite loops

  return {
    isYouTubeLinked,
    isLoading,
    error,
    channelName,
    refresh,
  };
}
