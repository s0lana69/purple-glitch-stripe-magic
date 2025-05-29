'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ExternalLink, ThumbsUp, MessageCircle, Eye, Video as VideoIcon, TrendingUp, Youtube } from 'lucide-react'; // VideoIcon for placeholder
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useYouTubeLinkStatus } from '@/hooks/useYouTubeLinkStatus';
import { exampleTopPosts, TopPost as ExampleTopPostType } from '@/lib/example-stats';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface YouTubeVideoDetails {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewCount: string;
  likeCount?: string;
  commentCount?: string;
  publishedAt: string;
  description?: string;
}

interface TopPostsProps {
  className?: string;
}

export function TopPosts({ className }: TopPostsProps) {
  const [posts, setPosts] = useState<YouTubeVideoDetails[]>([]);
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);
  const [errorComponent, setErrorComponent] = useState<string | null>(null);
  const { isYouTubeLinked, isLoading: isLoadingLinkStatus, error: errorLinkStatus } = useYouTubeLinkStatus();

  useEffect(() => {
    async function fetchTopVideos() {
      setIsLoadingComponent(true);
      setErrorComponent(null);
      try {
        const response = await fetch('/api/youtube/top-videos');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch top videos');
        }
        const data = await response.json();
        setPosts(data.videos || []);
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
      fetchTopVideos();
    } else if (isYouTubeLinked === false) {
      const exampleDataFormatted: YouTubeVideoDetails[] = exampleTopPosts.map((post: ExampleTopPostType) => ({
        id: post.id.toString(), // Ensure ID is a string
        title: post.title,
        thumbnailUrl: post.thumbnail,
        viewCount: post.views,
        likeCount: post.engagement, // Map engagement to likeCount for example
        commentCount: undefined, // Not available in exampleTopPosts
        publishedAt: 'Example Post', // Placeholder as not available
      }));
      setPosts(exampleDataFormatted);
      setIsLoadingComponent(false);
      setErrorComponent(null);
    }
  }, [isYouTubeLinked, isLoadingLinkStatus, errorLinkStatus]);

  if (isLoadingComponent || isLoadingLinkStatus) {
    return (
      <Card className={cn(className)}> {/* Removed h-full */}
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>Loading your most successful videos...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-16 w-28 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
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
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription className="text-destructive">{errorComponent || errorLinkStatus}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Could not load top videos. Please ensure your YouTube account is linked correctly in settings or check console for errors.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (posts.length === 0 && !isLoadingComponent && !isLoadingLinkStatus) {
     return (
      <Card className={cn(className)}> {/* Removed h-full */}
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>No videos found or data unavailable.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">It seems there are no videos to display. Try uploading some content to your YouTube channel!</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className={cn(className)}> {/* Removed h-full */}
      <CardHeader>
        <CardTitle>Top Performing Content</CardTitle>
        <CardDescription>Your most successful videos by view count</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="flex items-start gap-4">
              <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-md md:w-28 lg:w-32">
                {post.thumbnailUrl ? (
                  <Image src={post.thumbnailUrl} alt={post.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <VideoIcon className="h-8 w-8 text-muted-foreground" /> {/* Changed Video to VideoIcon */}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                {isYouTubeLinked === false && exampleTopPosts.find(p => p.id.toString() === post.id)?.platform !== "YouTube" ? (
                  <span className="font-medium line-clamp-2 text-sm text-foreground">{post.title}</span>
                ) : (
                <Link href={`https://www.youtube.com/watch?v=${post.id}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  <span className="font-medium line-clamp-2 text-sm text-foreground">{post.title}</span>
                </Link>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center"><Eye className="h-3 w-3 mr-1" /> {post.viewCount} views</span>
                  {post.likeCount && <span className="flex items-center"><ThumbsUp className="h-3 w-3 mr-1" /> {post.likeCount}</span>}
                  {post.commentCount && <span className="flex items-center"><MessageCircle className="h-3 w-3 mr-1" /> {post.commentCount}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="h-5 text-xs">
                    {isYouTubeLinked === false ? (exampleTopPosts.find(p => p.id.toString() === post.id)?.platform || 'Platform') : 'YouTube'}
                  </Badge>
                  { (isYouTubeLinked !== false || (isYouTubeLinked === false && exampleTopPosts.find(p => p.id.toString() === post.id)?.platform === "YouTube")) &&
                    <Link href={`https://www.youtube.com/watch?v=${post.id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                    </Link>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
