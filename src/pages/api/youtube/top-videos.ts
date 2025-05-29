import type { NextApiRequest, NextApiResponse } from 'next';
import { getYouTubeAccessToken } from '@/lib/youtubeAuth';

type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
};

type ErrorResponse = {
  error: string;
  details?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ videos: YouTubeVideo[] } | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('Fetching real YouTube top videos data...');

  try {
    // Get YouTube access token using the centralized helper
    const tokenResult = await getYouTubeAccessToken(req);

    if (!tokenResult.success) {
      console.log('No valid YouTube token found:', tokenResult.error);
      return res.status(401).json({ 
        error: 'YouTube account not connected or token invalid',
        details: tokenResult.error 
      });
    }

    const { accessToken } = tokenResult;
    const youtubeApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

    // First get the channel and uploads playlist ID
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true&key=${youtubeApiKey}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (!channelResponse.ok) {
      const errorText = await channelResponse.text();
      console.error('YouTube API error fetching channel:', channelResponse.status, errorText);
      return res.status(channelResponse.status).json({ 
        error: 'Failed to fetch YouTube channel data',
        details: `YouTube API returned ${channelResponse.status}: ${channelResponse.statusText}`
      });
    }

    const channelData = await channelResponse.json();
    if (!channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads) {
      return res.status(404).json({ 
        error: 'No upload playlist found for channel',
        details: 'The YouTube channel does not have an uploads playlist'
      });
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Get videos from uploads playlist
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${uploadsPlaylistId}&key=${youtubeApiKey}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (!playlistResponse.ok) {
      const errorText = await playlistResponse.text();
      console.error('Failed to fetch playlist items:', playlistResponse.status, errorText);
      return res.status(playlistResponse.status).json({ 
        error: 'Failed to fetch videos from playlist',
        details: errorText
      });
    }

    const playlistData = await playlistResponse.json();
    const videoIds = playlistData.items?.map((item: any) => item.snippet?.resourceId?.videoId).filter(Boolean);

    if (!videoIds?.length) {
      return res.status(200).json({ videos: [] });
    }

    // Get detailed video statistics
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${youtubeApiKey}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (!videosResponse.ok) {
      const errorText = await videosResponse.text();
      console.error('Failed to fetch video details:', videosResponse.status, errorText);
      return res.status(videosResponse.status).json({ 
        error: 'Failed to fetch video details',
        details: errorText
      });
    }

    const videosData = await videosResponse.json();
    const videos: YouTubeVideo[] = videosData.items?.map((video: any) => ({
      id: video.id,
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      thumbnailUrl: video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || '',
      publishedAt: video.snippet?.publishedAt || '',
      viewCount: video.statistics?.viewCount || '0',
      likeCount: video.statistics?.likeCount || '0',
      commentCount: video.statistics?.commentCount || '0',
    })) || [];

    // Sort by view count (descending)
    videos.sort((a: YouTubeVideo, b: YouTubeVideo) => parseInt(b.viewCount) - parseInt(a.viewCount));

    console.log(`Successfully fetched ${videos.length} real YouTube videos`);
    return res.status(200).json({ videos });
  } catch (error: any) {
    console.error('Error in top-videos API:', error);
    return res.status(500).json({ 
      error: 'Internal server error while fetching videos',
      details: error.message 
    });
  }
}
