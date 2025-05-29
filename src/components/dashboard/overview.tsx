'use client';

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useYouTubeLinkStatus } from '@/hooks/useYouTubeLinkStatus';
import { exampleOverviewStats, MonthlyStat } from '@/lib/example-stats';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewCount: string;
  publishedAt: string;
}

interface ChartDataPoint {
  name: string; // Formatted date or video title
  views: number;
  title?: string; // Original video title for tooltip
}

interface OverviewProps {
  className?: string;
  children?: React.ReactNode; // Add children prop
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {data.title || label} {/* Show video title if available, else formatted date */}
            </span>
            <span className="font-bold text-foreground">
              {payload[0].value?.toLocaleString()} views
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


export function Overview({ className, children }: OverviewProps) { // Add children to destructuring
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);
  const [errorComponent, setErrorComponent] = useState<string | null>(null);

  const { isYouTubeLinked, isLoading: isLoadingLinkStatus, error: errorLinkStatus } = useYouTubeLinkStatus();

  useEffect(() => {
    async function fetchRecentVideosData() {
      setIsLoadingComponent(true);
      setErrorComponent(null);
      try {
        const response = await fetch('/api/youtube/channel-stats');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch recent videos for overview');
        }
        const data = await response.json();
        
        if (data.recentVideos && data.recentVideos.length > 0) {
          const formattedData = data.recentVideos
            .map((video: YouTubeVideo) => ({
              name: format(parseISO(video.publishedAt), 'MMM d'),
              views: parseInt(video.viewCount || '0'),
              title: video.title,
            }))
            .sort((a: ChartDataPoint, b: ChartDataPoint) => new Date(a.name).getTime() - new Date(b.name).getTime());
          setChartData(formattedData);
        } else {
          setChartData([]);
        }
      } catch (err: any) {
        setErrorComponent(err.message);
      } finally {
        setIsLoadingComponent(false);
      }
    }

    if (isLoadingLinkStatus) {
      // Wait for link status to be determined
      setIsLoadingComponent(true);
      return;
    }

    if (errorLinkStatus) {
      setErrorComponent(errorLinkStatus);
      setIsLoadingComponent(false);
      setChartData([]); // Clear data on link status error
      return;
    }

    if (isYouTubeLinked === true) {
      fetchRecentVideosData();
    } else if (isYouTubeLinked === false) {
      // Use example data
      const exampleDataFormatted: ChartDataPoint[] = exampleOverviewStats.map((stat: MonthlyStat) => ({
        name: stat.name, // Month name like "Jan", "Feb"
        views: stat.views,
        // title: `Month: ${stat.name}` // Optional: if you want a specific title for example data tooltip
      }));
      setChartData(exampleDataFormatted);
      setIsLoadingComponent(false);
      setErrorComponent(null);
    }
    // isYouTubeLinked can be null initially, handled by isLoadingLinkStatus
  }, [isYouTubeLinked, isLoadingLinkStatus, errorLinkStatus]);

  if (isLoadingComponent || isLoadingLinkStatus) {
    return (
      <Card className={cn(className)}> {/* Removed h-full */}
        <CardHeader>
          <CardTitle>Recent Content Performance</CardTitle>
          <CardDescription>Loading views of your latest videos...</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }

  if (errorComponent || errorLinkStatus) {
    return (
      <Card className={cn(className)}> {/* Removed h-full */}
        <CardHeader>
          <CardTitle>Recent Content Performance</CardTitle>
          <CardDescription className="text-destructive">{errorComponent || errorLinkStatus}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Could not load chart data.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (chartData.length === 0 && !isLoadingComponent && !isLoadingLinkStatus) {
    return (
      <Card className={cn(className)}> {/* Removed h-full */}
        <CardHeader>
          <CardTitle>Recent Content Performance</CardTitle>
          <CardDescription>Views of your latest videos</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No recent video data to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}> {/* Removed h-full */}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Recent Content Performance</CardTitle>
          <CardDescription>Views of your latest videos by publish date</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 0, left: -20, bottom: 0 }} // Adjusted left margin for YAxis
            >
              <defs>
                <linearGradient id="colorViewsOverview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted)/0.3)" }}/>
              <Area
                type="monotone"
                dataKey="views"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorViewsOverview)"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--chart-1))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "hsl(var(--chart-1))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Render children (YouTubeChannelCard) below the chart */}
        {children && <div className="pt-4">{children}</div>}
      </CardContent>
    </Card>
  );
}
