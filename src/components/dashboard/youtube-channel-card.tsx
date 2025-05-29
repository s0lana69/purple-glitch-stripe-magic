'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useYouTubeLinkStatus } from '@/hooks/useYouTubeLinkStatus';
import { exampleYouTubeChannelCard } from '@/lib/example-stats';
import { Users, Eye, Video, AlertTriangle, Youtube, ExternalLink as LinkIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface YouTubeChannelStats {
  channelId: string;
  channelTitle: string;
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
  thumbnails?: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
  };
  recentVideos?: Array<{
    title: string;
    viewCount: string;
    publishedAt: string;
  }>;
}

interface MetricDisplayProps {
  icon: React.ElementType;
  value?: string | null;
  label: string;
  example?: boolean;
}

function MetricDisplay({ icon: Icon, value, label, example }: MetricDisplayProps) {
  const formattedValue = value && parseInt(value) ? parseInt(value).toLocaleString() : 'N/A';
  
  return (
    <div>
      <Icon className={cn(
        "h-6 w-6 mb-1 mx-auto",
        example ? "text-muted-foreground" : "text-primary"
      )} />
      <p className="text-2xl font-bold">{formattedValue}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function YouTubeChannelCard() {
  const { 
    isYouTubeLinked, 
    isLoading: linkStatusLoading, 
    error: linkError, 
    channelName,
    refresh: refreshLinkStatus 
  } = useYouTubeLinkStatus();
  
  const [stats, setStats] = useState<YouTubeChannelStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Debug logging
  useEffect(() => {
    console.log('YouTubeChannelCard: Status update -', {
      isYouTubeLinked,
      linkStatusLoading,
      linkError,
      channelName,
      stats: stats ? 'loaded' : 'null'
    });
  }, [isYouTubeLinked, linkStatusLoading, linkError, channelName, stats]);

  const fetchStats = async () => {
    if (!isYouTubeLinked) {
      console.log('YouTube not linked, skipping stats fetch');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/youtube/channel-stats', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('YouTube API error:', errorData);
        
        if (response.status === 401) {
          // Token invalid or YouTube not connected
          setError('YouTube account not connected or token expired. Please reconnect your YouTube account.');
        } else if (response.status === 404) {
          // No YouTube channel found
          setError('No YouTube channel found for this Google account.');
        } else {
          // Other API errors
          setError(errorData.details || `Failed to fetch channel stats: ${response.status}`);
        }
        return;
      }
      
      const data = await response.json();
      console.log('Real YouTube data received:', data);
      setStats(data);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error('Error fetching YouTube stats:', err);
      setError(err.message || 'Failed to load channel statistics');
      // Retry up to 3 times with exponential backoff if it's a temporary error
      if (retryCount < 3 && err.message.includes('429')) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, Math.pow(2, retryCount) * 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [isYouTubeLinked, retryCount]);

  const handleRefresh = () => {
    refreshLinkStatus();
    fetchStats();
  };

  // Loading state with placeholder animation
  if (linkStatusLoading || isLoading) {
    return (
      <Card className="h-full animate-pulse">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Youtube className="h-6 w-6 text-red-600" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Not connected state - show example data instead of link prompt
  if (!isYouTubeLinked) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Youtube className="h-6 w-6 text-red-600" />
              <div>
                <CardTitle className="text-lg">
                  {exampleYouTubeChannelCard.channelTitle}
                </CardTitle>
                <CardDescription>
                  Example YouTube Channel
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Connect
                </Button>
              </Link>
              {exampleYouTubeChannelCard.thumbnailUrl && (
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={exampleYouTubeChannelCard.thumbnailUrl} 
                    alt={exampleYouTubeChannelCard.channelTitle || 'Channel Thumbnail'} 
                  />
                  <AvatarFallback>YT</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <MetricDisplay
              icon={Users}
              value={exampleYouTubeChannelCard.subscriberCount}
              label="Subscribers"
              example={true}
            />
            <MetricDisplay
              icon={Eye}
              value={exampleYouTubeChannelCard.viewCount}
              label="Total Views"
              example={true}
            />
            <MetricDisplay
              icon={Video}
              value={exampleYouTubeChannelCard.videoCount}
              label="Videos"
              example={true}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error || linkError) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Youtube className="h-6 w-6 text-red-600" />
              <span>YouTube Channel</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={linkStatusLoading}
            >
              <RefreshCw className={cn(
                "h-4 w-4",
                linkStatusLoading && "animate-spin"
              )} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-red-600 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm">Error Loading Channel Data</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {error || linkError || 'Unable to load channel statistics'}
          </p>
          <div className="space-y-2">
            <Button variant="outline" onClick={handleRefresh} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full">
                Check Connection Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show loading state when YouTube is linked but no stats yet
  if (!stats && isYouTubeLinked) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Youtube className="h-6 w-6 text-red-600" />
              <div>
                <CardTitle className="text-lg">
                  {channelName || 'Your YouTube Channel'}
                </CardTitle>
                <CardDescription>
                  Loading real channel data...
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={linkStatusLoading || isLoading}
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  (linkStatusLoading || isLoading) && "animate-spin"
                )} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Fetching your YouTube channel data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main successful state with real data
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Youtube className="h-6 w-6 text-red-600" />
            <div>
              <CardTitle className="text-lg">{stats?.channelTitle || 'YouTube Channel'}</CardTitle>
              <CardDescription>YouTube Channel Analytics</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={linkStatusLoading || isLoading}
            >
              <RefreshCw className={cn(
                "h-4 w-4",
                (linkStatusLoading || isLoading) && "animate-spin"
              )} />
            </Button>
            {(stats?.thumbnails?.high?.url || stats?.thumbnails?.medium?.url || stats?.thumbnails?.default?.url) && (
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={stats.thumbnails?.high?.url || stats.thumbnails?.medium?.url || stats.thumbnails?.default?.url} 
                  alt={stats?.channelTitle || 'Channel Thumbnail'} 
                />
                <AvatarFallback>YT</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <MetricDisplay
            icon={Users}
            value={stats?.subscriberCount}
            label="Subscribers"
          />
          <MetricDisplay
            icon={Eye}
            value={stats?.viewCount}
            label="Total Views"
          />
          <MetricDisplay
            icon={Video}
            value={stats?.videoCount}
            label="Videos"
          />
        </div>
      </CardContent>
    </Card>
  );
}
