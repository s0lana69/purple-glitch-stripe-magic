import type { NextApiRequest, NextApiResponse } from 'next';
import { getYouTubeAccessToken } from '@/lib/youtubeAuth'; // Import the centralized function

type YouTubeComment = {
  id: string;
  text: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  likeCount: string;
  publishedAt: string;
  videoId: string;
  videoTitle: string;
};

type ErrorResponse = {
  error: string;
  details?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ comments: YouTubeComment[] } | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('Fetching real YouTube comments data...');

  // Use the centralized getYouTubeAccessToken function
  const tokenResult = await getYouTubeAccessToken(req);

  if (!tokenResult.success || !tokenResult.accessToken) {
    console.warn('API recent-comments: Failed to get YouTube access token or token is missing.', tokenResult.error);
    return res.status(403).json({ 
      error: 'YouTube access token unavailable. Please ensure your account is linked.', 
      details: tokenResult.error 
    });
  }
  const accessToken = tokenResult.accessToken;
  const user = tokenResult.user; // User object from tokenResult

  // The getYouTubeAccessToken function already handles checks for user authentication,
  // has_youtube_access flag, and Google identity. So, explicit checks here are redundant if using it.

  try {
    // First get the channel ID
    const youtubeApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
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
      let errorData;
      try {
        errorData = await channelResponse.json();
      } catch (e) {
        errorData = { error: { message: 'Failed to parse YouTube API error response. Raw response might be HTML or non-JSON.' } };
      }
      
      console.error(
        `API recent-comments: YouTube API error fetching channel data. Status: ${channelResponse.status} ${channelResponse.statusText}. Response:`, 
        JSON.stringify(errorData, null, 2)
      );

      if (channelResponse.status === 401) { // Unauthorized
        return res.status(401).json({ 
          error: 'YouTube authentication failed. The access token may be invalid or expired. Please try unlinking and re-linking your account.', 
          details: errorData?.error?.message || 'Unauthorized' 
        });
      }
      if (channelResponse.status === 403) { // Forbidden
        return res.status(403).json({
          error: 'YouTube API access forbidden. This could be due to insufficient permissions, incorrect API setup, or quota issues.',
          details: errorData?.error?.message || 'Forbidden'
        });
      }

      const errorMessage = errorData?.error?.message || `YouTube API request for channel data failed with status ${channelResponse.status}`;
      return res.status(channelResponse.status).json({ error: 'Failed to fetch YouTube channel data.', details: errorMessage });
    }

    const channelData = await channelResponse.json();
    if (!channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads) {
      return res.status(404).json({ error: 'No upload playlist found for channel.' });
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Get recent videos from uploads playlist
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}&key=${youtubeApiKey}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (!playlistResponse.ok) {
      let errorData;
      try {
        errorData = await playlistResponse.json();
      } catch (e) {
        errorData = { error: { message: 'Failed to parse YouTube API error response for playlist items.' } };
      }
      console.error(
        `API recent-comments: YouTube API error fetching playlist items. Status: ${playlistResponse.status} ${playlistResponse.statusText}. Response:`,
        JSON.stringify(errorData, null, 2)
      );
      const errorMessage = errorData?.error?.message || `YouTube API request for playlist items failed with status ${playlistResponse.status}`;
      return res.status(playlistResponse.status).json({ error: 'Failed to fetch recent videos.', details: errorMessage });
    }

    const playlistData = await playlistResponse.json();
    const videoIds = playlistData.items?.map((item: any) => item.snippet?.resourceId?.videoId).filter(Boolean);

    if (!videoIds?.length) {
      return res.status(200).json({ comments: [] });
    }

    // Get comments for these videos
    const comments: YouTubeComment[] = [];
    for (const videoId of videoIds.slice(0, 10)) { // Limit to latest 10 videos
      const commentsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=10&videoId=${videoId}&key=${youtubeApiKey}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      );

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        const videoTitle = playlistData.items.find((item: any) => item.snippet?.resourceId?.videoId === videoId)?.snippet?.title;

        comments.push(
          ...commentsData.items?.map((item: any) => ({
            id: item.id,
            text: item.snippet?.topLevelComment?.snippet?.textDisplay,
            authorDisplayName: item.snippet?.topLevelComment?.snippet?.authorDisplayName,
            authorProfileImageUrl: item.snippet?.topLevelComment?.snippet?.authorProfileImageUrl,
            likeCount: item.snippet?.topLevelComment?.snippet?.likeCount,
            publishedAt: item.snippet?.topLevelComment?.snippet?.publishedAt,
            videoId,
            videoTitle,
          })) || []
        );
      }
    }

    return res.status(200).json({ comments: comments.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()) });
  } catch (error: any) {
    console.error('API recent-comments: Internal error', error.message);
    return res.status(500).json({ error: 'Internal server error while fetching comments.', details: error.message });
  }
}
