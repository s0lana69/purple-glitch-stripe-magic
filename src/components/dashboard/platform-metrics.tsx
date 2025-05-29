'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Users, Eye, Video as VideoIcon, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useYouTubeLinkStatus } from '@/hooks/useYouTubeLinkStatus';
import { examplePlatformMetrics, PlatformMetric as ExamplePlatformMetricType } from '@/lib/example-stats';

interface Metric {
  title: string;
  value: string;
  change?: string; // Change is now optional
  trending?: 'up' | 'down' | 'neutral';
  description: string;
  icon: React.ElementType;
}

export function PlatformMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);
  const [errorComponent, setErrorComponent] = useState<string | null>(null);

  const { isYouTubeLinked, isLoading: isLoadingLinkStatus, error: errorLinkStatus } = useYouTubeLinkStatus();

  useEffect(() => {
    async function fetchChannelData() {
      setIsLoadingComponent(true);
      setErrorComponent(null);
      try {
        const response = await fetch('/api/youtube/channel-stats');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch channel stats');
        }
        const data = await response.json();

        const fetchedMetrics: Metric[] = [
          {
            title: 'Total Subscribers',
            value: parseInt(data.subscriberCount || '0').toLocaleString(),
            description: data.channelTitle || 'Your YouTube Channel',
            icon: Users,
            trending: 'neutral', // Change/trending can be added later with more complex logic
          },
          {
            title: 'Total Views',
            value: parseInt(data.viewCount || '0').toLocaleString(),
            description: 'Across all videos',
            icon: Eye,
            trending: 'neutral',
          },
          {
            title: 'Total Videos',
            value: parseInt(data.videoCount || '0').toLocaleString(),
            description: 'Uploaded to channel',
            icon: VideoIcon,
            trending: 'neutral',
          },
          { // Placeholder for a 4th metric, e.g., recent views
            title: 'Recent Video Views',
            value: data.recentVideos?.reduce((sum: number, video: any) => sum + parseInt(video.viewCount || '0'), 0).toLocaleString() || 'N/A',
            description: `Last ${data.recentVideos?.length || 0} videos`,
            icon: TrendingUp, // Example icon
            trending: 'neutral',
          },
        ];
        setMetrics(fetchedMetrics);
      } catch (err: any) {
        setErrorComponent(err.message);
        setMetrics([
          { title: 'Total Subscribers', value: 'N/A', description: 'Error loading data', icon: Users, trending: 'neutral' },
          { title: 'Total Views', value: 'N/A', description: 'Error loading data', icon: Eye, trending: 'neutral' },
          { title: 'Total Videos', value: 'N/A', description: 'Error loading data', icon: VideoIcon, trending: 'neutral' },
          { title: 'Recent Views', value: 'N/A', description: 'Error loading data', icon: TrendingUp, trending: 'neutral' },
        ]);
      } finally {
        setIsLoadingComponent(false);
      }
    }

    if (isLoadingLinkStatus) {
      setIsLoadingComponent(true);
      return;
    }

    if (errorLinkStatus) {
      setErrorComponent(errorLinkStatus);
      setIsLoadingComponent(false);
      // Set error state metrics based on example structure for consistency
      setMetrics(examplePlatformMetrics.map((m: ExamplePlatformMetricType) => ({
        ...m,
        value: 'N/A',
        description: `Error: ${errorLinkStatus}`,
        icon: m.title.includes("View") ? Eye : m.title.includes("Subscriber") ? Users : m.title.includes("Rate") ? BarChart2 : VideoIcon,
      })));
      return;
    }

    if (isYouTubeLinked === true) {
      fetchChannelData();
    } else if (isYouTubeLinked === false) {
      const exampleDataFormatted: Metric[] = examplePlatformMetrics.map((m: ExamplePlatformMetricType) => ({
        title: m.title,
        value: m.value,
        change: m.change,
        trending: m.trending,
        description: m.description,
        icon: m.title.includes("View") ? Eye : m.title.includes("Subscriber") ? Users : m.title.includes("Rate") ? BarChart2 : VideoIcon, // Assign icons based on title
      }));
      setMetrics(exampleDataFormatted);
      setIsLoadingComponent(false);
      setErrorComponent(null);
    }
  }, [isYouTubeLinked, isLoadingLinkStatus, errorLinkStatus]);

  if (isLoadingComponent || isLoadingLinkStatus) {
    return (
      <>
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-1/3 mb-1" />
              <Skeleton className="h-3 w-4/5" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }
  
  if (errorComponent || errorLinkStatus) {
     return (
      <>
        {metrics.length > 0 ? metrics.map((metric, index) => ( // Check if metrics array has items
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{metric.value}</div>
              <p className="text-xs text-destructive">{metric.description || 'Error loading metric details'}</p>
            </CardContent>
          </Card>
        )) : (
          [...Array(4)].map((_, index) => ( // Fallback to skeletons if metrics is empty during error
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-1/3 mb-1" />
                <Skeleton className="h-3 w-4/5" />
              </CardContent>
            </Card>
          ))
        )}
      </>
    );
  }

  // Display "No data" message if not loading, no error, but metrics array is empty
  if (!isLoadingComponent && !isLoadingLinkStatus && !errorComponent && !errorLinkStatus && metrics.length === 0) {
    return (
      <>
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Metric {index + 1}</CardTitle>
               <Minus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">No data available for this metric.</p>
            </CardContent>
          </Card>
        ))}
      </>
    );
  }


  return (
    <>
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            {metric.trending === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
            {metric.trending === 'down' && <TrendingDown className="h-4 w-4 text-rose-500" />}
            {metric.trending === 'neutral' && <metric.icon className="h-4 w-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.change && (
                <span
                  className={
                    metric.trending === 'up' ? 'text-emerald-500' : metric.trending === 'down' ? 'text-rose-500' : ''
                  }
                >
                  {metric.change}
                </span>
              )}
              {' '} {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
