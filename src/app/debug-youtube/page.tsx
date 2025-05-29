'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/FirebaseAuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface DebugInfo {
  authStatus: {
    isAuthenticated: boolean;
    userId: string | null;
    email: string | null;
    userMetadata: any;
    identities: any[];
  };
  youtubeStatus: {
    isChecking: boolean;
    connected: boolean;
    error: string | null;
    channelName: string | null;
    apiResponse: any;
  };
  tokenInfo: {
    hasProviderToken: boolean;
    hasRefreshToken: boolean;
    tokenValidation: any;
  };
}

export default function DebugYouTubePage() {
  const { user, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    authStatus: {
      isAuthenticated: false,
      userId: null,
      email: null,
      userMetadata: {},
      identities: []
    },
    youtubeStatus: {
      isChecking: false,
      connected: false,
      error: null,
      channelName: null,
      apiResponse: null
    },
    tokenInfo: {
      hasProviderToken: false,
      hasRefreshToken: false,
      tokenValidation: null
    }
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  // Prevent automatic redirects by intercepting navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // This won't prevent programmatic navigation, but helps with some cases
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const checkYouTubeStatus = async () => {
    setDebugInfo(prev => ({
      ...prev,
      youtubeStatus: { ...prev.youtubeStatus, isChecking: true, error: null }
    }));

    try {
      const response = await fetch('/api/youtube/check-status', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      const data = await response.json();
      
      setDebugInfo(prev => ({
        ...prev,
        youtubeStatus: {
          isChecking: false,
          connected: data.connected || false,
          error: data.error || null,
          channelName: data.channelName || null,
          apiResponse: data
        }
      }));
    } catch (error: any) {
      setDebugInfo(prev => ({
        ...prev,
        youtubeStatus: {
          isChecking: false,
          connected: false,
          error: error.message,
          channelName: null,
          apiResponse: null
        }
      }));
    }
  };

  const validateToken = async () => {
    try {
      const response = await fetch('/api/youtube/validate-token', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      setDebugInfo(prev => ({
        ...prev,
        tokenInfo: {
          ...prev.tokenInfo,
          tokenValidation: data
        }
      }));
    } catch (error: any) {
      setDebugInfo(prev => ({
        ...prev,
        tokenInfo: {
          ...prev.tokenInfo,
          tokenValidation: { error: error.message }
        }
      }));
    }
  };

  const refreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([
      checkYouTubeStatus(),
      validateToken()
    ]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (user) {
      setDebugInfo(prev => ({
        ...prev,
        authStatus: {
          isAuthenticated: true,
          userId: user.uid,
          email: user.email || null,
          userMetadata: {
            displayName: user.displayName || null,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            emailVerified: user.emailVerified,
            providerId: user.providerId,
            providerData: user.providerData
          },
          identities: user.providerData || []
        },
        tokenInfo: {
          hasProviderToken: false, // Firebase Auth doesn't expose provider tokens directly
          hasRefreshToken: !!(user.refreshToken),
          tokenValidation: null
        }
      }));
      
      // Auto-check YouTube status when user is loaded
      checkYouTubeStatus();
      validateToken();
    }
  }, [user]);

  const StatusIcon = ({ status }: { status: boolean | null }) => {
    if (status === null) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">YouTube Integration Debug</h1>
        <Button onClick={refreshAll} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      {/* Authentication Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon status={debugInfo.authStatus.isAuthenticated} />
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>User ID:</strong> {debugInfo.authStatus.userId || 'None'}
            </div>
            <div>
              <strong>Email:</strong> {debugInfo.authStatus.email || 'None'}
            </div>
          </div>
          
          <div>
            <strong>User Metadata:</strong>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.authStatus.userMetadata, null, 2)}
            </pre>
          </div>
          
          <div>
            <strong>Identities ({debugInfo.authStatus.identities.length}):</strong>
            <div className="mt-2 space-y-2">
              {debugInfo.authStatus.identities.map((identity, index) => (
                <Badge key={index} variant="outline">
                  {identity.provider} - {identity.id}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* YouTube Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon status={debugInfo.youtubeStatus.connected} />
            YouTube Connection Status
            {debugInfo.youtubeStatus.isChecking && <RefreshCw className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Connected:</strong> {debugInfo.youtubeStatus.connected ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Channel Name:</strong> {debugInfo.youtubeStatus.channelName || 'None'}
            </div>
          </div>
          
          {debugInfo.youtubeStatus.error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded">
              <strong>Error:</strong> {debugInfo.youtubeStatus.error}
            </div>
          )}
          
          <div>
            <strong>API Response:</strong>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.youtubeStatus.apiResponse, null, 2)}
            </pre>
          </div>
          
          <Button onClick={checkYouTubeStatus} disabled={debugInfo.youtubeStatus.isChecking}>
            <RefreshCw className={`h-4 w-4 mr-2 ${debugInfo.youtubeStatus.isChecking ? 'animate-spin' : ''}`} />
            Check YouTube Status
          </Button>
        </CardContent>
      </Card>

      {/* Token Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon status={debugInfo.tokenInfo.hasProviderToken} />
            Token Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Has Provider Token:</strong> {debugInfo.tokenInfo.hasProviderToken ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Has Refresh Token:</strong> {debugInfo.tokenInfo.hasRefreshToken ? 'Yes' : 'No'}
            </div>
          </div>
          
          <div>
            <strong>Token Validation:</strong>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.tokenInfo.tokenValidation, null, 2)}
            </pre>
          </div>
          
          <Button onClick={validateToken}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Validate Token
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/settings'}>
              Go to Settings
            </Button>
            <Button variant="outline" onClick={() => {
              localStorage.setItem('youtube-status-changed', Date.now().toString());
              window.dispatchEvent(new Event('storage'));
            }}>
              Trigger Status Change Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
