'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Youtube, CheckCircle, XCircle, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/FirebaseAuthContext';
import { useYouTubeLinkStatus } from '@/hooks/useYouTubeLinkStatus';
import { YouTubeConnectionModal } from './youtube-connection-modal';

interface YouTubeChannelInfo {
  channelTitle?: string;
  thumbnailUrl?: string;
}

export function ConnectedAccounts() {
  const { user } = useAuth();
  const { 
    isYouTubeLinked, 
    isLoading: isLoadingYouTubeStatus, 
    error: linkError, 
    channelName,
    refresh: refreshYouTubeStatus 
  } = useYouTubeLinkStatus();

  const [isUnlinking, setIsUnlinking] = useState<boolean>(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState<boolean>(false);
  const [componentError, setComponentError] = useState<string | null>(null);

  // Handle auth completion redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCompleted = urlParams.get('auth_completed');
    const flowType = urlParams.get('flow_type');
    
    if (authCompleted === 'true' && flowType === 'linking') {
      // Clear the URL parameters but keep the current path
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Show success message and force refresh of YouTube status
      toast.success('YouTube account linking completed! Verifying connection...');
      
      // Force a refresh after a short delay to allow the session to propagate
      // Increased delay and added retry logic
      const retryRefresh = (attempt = 1) => {
        refreshYouTubeStatus();
        if (attempt < 3) {
          setTimeout(() => retryRefresh(attempt + 1), 2000);
        }
      };
      
      setTimeout(() => {
        retryRefresh();
      }, 3000);
    }
  }, [refreshYouTubeStatus]);

  const handleOpenYouTubeModal = () => {
    setIsYouTubeModalOpen(true);
    setComponentError(null);
  };

  const handleUnlinkYouTubeAccount = async () => {
    if (!confirm('Are you sure you want to unlink your YouTube account? You will need to reconnect to access YouTube features.')) {
      return;
    }

    setIsUnlinking(true);
    setComponentError(null);
    try {
      const response = await fetch('/api/auth/unlink-youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to unlink YouTube account');
      }
      
      toast.success(result.message || 'YouTube account successfully unlinked');
      
      // Refresh the YouTube status and user context
      refreshYouTubeStatus();
      
      // Also refresh the user context to ensure UI updates
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      
    } catch (err: any) {
      console.error('Error unlinking YouTube account:', err);
      setComponentError(err.message);
      toast.error(err.message || 'Failed to unlink YouTube account');
    } finally {
      setIsUnlinking(false);
    }
  };

  const handleYouTubeConnectionSuccess = () => {
    refreshYouTubeStatus();
    toast.success('YouTube channel connected successfully!');
  };
  
  const displayError = componentError || linkError;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Link your external accounts to enhance your TrueViral.ai experience and enable personalized data insights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayError && (
            <div className="p-3 border border-red-200 bg-red-50 text-red-700 text-sm rounded-lg flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {displayError}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <Youtube className="h-8 w-8 text-red-500" />
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-medium text-foreground">YouTube</h4>
                  {isLoadingYouTubeStatus && !isUnlinking ? (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Checking status...
                    </div>
                  ) : isYouTubeLinked ? (
                    <div className="flex items-center text-xs text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" /> Connected
                      {channelName && (
                        <span className="ml-1 text-muted-foreground">
                          • {channelName}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <XCircle className="h-3 w-3 mr-1 text-red-500" /> Not Connected
                    </div>
                  )}
                </div>
                
                {/* Show channel avatar when connected - Placeholder for now */}
                {isYouTubeLinked && user?.photoURL && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user.photoURL || ''}
                      alt={channelName || 'YouTube Channel'} 
                    />
                    <AvatarFallback>YT</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
            
            {isYouTubeLinked ? (
              <Button 
                variant="outline" 
                onClick={handleUnlinkYouTubeAccount} 
                className="border-red-500 text-red-500 hover:bg-red-500/10"
                disabled={isLoadingYouTubeStatus || isUnlinking}
              >
                {isUnlinking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Unlinking...
                  </>
                ) : (
                  'Unlink YouTube Account'
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleOpenYouTubeModal} 
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoadingYouTubeStatus || isUnlinking}
              >
                {isLoadingYouTubeStatus ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Status...
                  </>
                ) : (
                  <>
                    <Youtube className="mr-2 h-4 w-4" />
                    Connect YouTube Channel
                  </>
                )}
              </Button>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => refreshYouTubeStatus()} disabled={isLoadingYouTubeStatus || isUnlinking}>
            <RefreshCw className="mr-2 h-3 w-3" /> Refresh Status
          </Button>
        </CardContent>
      </Card>

      <YouTubeConnectionModal 
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        onSuccess={handleYouTubeConnectionSuccess}
      />
    </>
  );
}
