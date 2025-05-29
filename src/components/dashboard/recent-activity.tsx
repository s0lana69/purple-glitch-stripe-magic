'use client';

import React, { useEffect, useState } from 'react';
import { Clock, MessageSquare, ThumbsUp, Users, AlertTriangle, Video, UserCheck, Heart } from 'lucide-react'; // Added Video, UserCheck, Heart
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useYouTubeLinkStatus } from '@/hooks/useYouTubeLinkStatus';
import { exampleRecentActivity, RecentActivityItem as ExampleRecentActivityItemType } from '@/lib/example-stats';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNowStrict } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Added import for cn

interface YouTubeComment {
  id: string;
  text: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  publishedAt: string;
  videoId: string;
}

interface RecentActivityProps {
  className?: string;
}

export function RecentActivity({ className }: RecentActivityProps) {
  // Use a union type for activities state
type TransformedExampleActivity = Omit<ExampleRecentActivityItemType, 'id'> & { // Omit original id
  id: string; // Ensure id is string for consistency with YouTubeComment
  isExample: true;
  textDisplay: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  publishedAt: string; // Will hold the example 'time' string directly
  videoId?: string;
};
type RealYouTubeComment = YouTubeComment & { isExample?: false };
type ActivityItem = RealYouTubeComment | TransformedExampleActivity;

const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);
  const [errorComponent, setErrorComponent] = useState<string | null>(null);

  const { isYouTubeLinked, isLoading: isLoadingLinkStatus, error: errorLinkStatus } = useYouTubeLinkStatus();

  useEffect(() => {
    async function fetchRecentComments() {
      setIsLoadingComponent(true);
      setErrorComponent(null);
      try {
        const response = await fetch('/api/youtube/recent-comments');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch recent comments');
        }
        const data: { comments: YouTubeComment[] } = await response.json();
        setActivities(data.comments.map(item => ({
          ...item,
          isExample: false 
        } as RealYouTubeComment)));
      } catch (err: any) {
        setErrorComponent(err.message);
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
      return;
    }

    if (isYouTubeLinked === true) {
      fetchRecentComments();
    } else if (isYouTubeLinked === false) {
      const exampleDataFormatted: TransformedExampleActivity[] = exampleRecentActivity.map((exItem: ExampleRecentActivityItemType) => ({
        ...exItem,
        id: exItem.id.toString(),
        isExample: true,
        textDisplay: exItem.content || (exItem.type === 'new_video' ? `New video: ${exItem.videoTitle}` : exItem.type === 'like' ? `Liked: ${exItem.videoTitle}` : exItem.type),
        authorDisplayName: exItem.user?.name || (exItem.type === 'new_video' ? 'Your Channel' : 'System'),
        authorProfileImageUrl: exItem.user?.avatar || '',
        publishedAt: exItem.time, // Use the example time string directly
        videoId: (exItem.type === 'comment' || exItem.type === 'like' || exItem.type === 'new_video') ? `exampleVideoId_${exItem.id}` : undefined,
      }));
      setActivities(exampleDataFormatted);
      setIsLoadingComponent(false);
      setErrorComponent(null);
    }
  }, [isYouTubeLinked, isLoadingLinkStatus, errorLinkStatus]);

  if (isLoadingComponent || isLoadingLinkStatus) {
    return (
      <Card className={cn(className)}> {/* Removed h-full */}
        <CardHeader>
          <CardTitle>Recent Comments</CardTitle>
          <CardDescription>Loading latest interactions...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (errorComponent || errorLinkStatus) {
    return (
      <Card className={cn(className)}> {/* Removed h-full */}
        <CardHeader>
          <CardTitle>Recent Comments</CardTitle>
          <CardDescription className="text-destructive">{errorComponent || errorLinkStatus}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
           <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Could not load comments. Please ensure your YouTube account is linked correctly or check console for errors.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (activities.length === 0 && !isLoadingComponent && !isLoadingLinkStatus) {
    return (
      <Card className={cn(className)}> {/* Removed h-full */}
        <CardHeader>
          <CardTitle>Recent Comments</CardTitle>
          <CardDescription>Latest interactions with your content</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No recent comments found on your videos.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}> {/* Removed h-full */}
      <CardHeader>
        <CardTitle>Recent Comments</CardTitle>
        <CardDescription>The latest comments on your videos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const isExampleActivity = activity.isExample === true;
            
            let iconToRender: JSX.Element | null = null;
            let displayText: JSX.Element | string = '';
            let finalAuthorName: string | undefined = '';
            let finalAuthorAvatar: string | undefined = '';
            let timeDisplay: string = '';
            let platformDisplay: string = 'YouTube';
            let activityLink: string | null = null;
            let activityLinkText: string = 'View';

            if (isExampleActivity) {
              const exItem = activity as TransformedExampleActivity;
              finalAuthorName = exItem.user?.name || (exItem.type === 'new_video' ? 'Your Channel' : 'System');
              finalAuthorAvatar = exItem.user?.avatar;
              timeDisplay = exItem.time; // Already a string like "2 hours ago"
              platformDisplay = exItem.platform;

              switch (exItem.type) {
                case 'comment':
                  iconToRender = <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />;
                  displayText = <span dangerouslySetInnerHTML={{ __html: exItem.content || '' }} />;
                  activityLinkText = "View Comment";
                  activityLink = `https://www.youtube.com/watch?v=${exItem.videoId || 'example'}&lc=${exItem.id}`;
                  break;
                case 'like':
                  iconToRender = <ThumbsUp className="mr-2 h-4 w-4 text-rose-500" />;
                  displayText = <span>liked {exItem.videoTitle ? `"${exItem.videoTitle}"` : 'a video'}.</span>;
                  activityLink = null; // No direct link for a "like" usually
                  break;
                case 'new_subscriber':
                  iconToRender = <UserCheck className="mr-2 h-4 w-4 text-emerald-500" />;
                  displayText = <span>subscribed to your channel.</span>;
                  activityLink = null;
                  break;
                case 'new_video':
                  iconToRender = <Video className="mr-2 h-4 w-4 text-blue-500" />;
                  displayText = <span>posted a new video: "{exItem.videoTitle}".</span>;
                  activityLinkText = "View Video";
                  activityLink = `https://www.youtube.com/watch?v=${exItem.videoId || 'example'}`;
                  break;
                default:
                  displayText = exItem.content || '';
                  break;
              }
            } else {
              const realComment = activity as RealYouTubeComment;
              finalAuthorName = realComment.authorDisplayName;
              finalAuthorAvatar = realComment.authorProfileImageUrl;
              displayText = <span dangerouslySetInnerHTML={{ __html: realComment.text || '' }} />;
              timeDisplay = formatDistanceToNowStrict(new Date(realComment.publishedAt), { addSuffix: true });
              platformDisplay = "YouTube";
              activityLinkText = "View Comment";
              activityLink = `https://www.youtube.com/watch?v=${realComment.videoId}&lc=${realComment.id.split('.')[1] || realComment.id}`;
            }
            
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={finalAuthorAvatar} alt={finalAuthorName} />
                  <AvatarFallback>{finalAuthorName?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-sm text-foreground">
                      <span>{finalAuthorName}</span>
                      {!isExampleActivity || (activity as TransformedExampleActivity).type === 'comment' ? <span className="ml-1 text-muted-foreground">commented:</span> : null}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 sm:mt-0">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{timeDisplay}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-start">
                    {isExampleActivity && (activity as TransformedExampleActivity).type !== 'comment' && iconToRender}
                    {displayText}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-5 text-xs">{platformDisplay}</Badge>
                    {activityLink && (
                      <Link href={activityLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                        {activityLinkText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
