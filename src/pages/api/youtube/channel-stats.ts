import { NextApiRequest, NextApiResponse } from 'next';
import { getYouTubeAccessToken } from '@/lib/youtubeAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== YouTube Channel Stats API Called ===');
  console.log('Host:', req.headers.host);
  console.log('Method:', req.method);
  console.log('Cookies:', req.headers.cookie ? 'Present' : 'Missing');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Attempting to fetch YouTube channel data...');

  try {
    // Get YouTube access token using the enhanced helper
    const tokenResult = await getYouTubeAccessToken(req);

    if (!tokenResult.success) {
      console.log('No valid YouTube token found:', tokenResult.error);
      
      // Return error response instead of mock data when no token
      return res.status(401).json({ 
        error: 'YouTube account not connected or token invalid',
        details: tokenResult.error 
      });
    }

    const { accessToken, user } = tokenResult;
    console.log('Valid YouTube token found, returning mock channel data...');

    // Since this is a mock implementation, return mock data
    const responseData = {
      channelId: 'mock-channel-id',
      channelTitle: user?.user_metadata?.youtube_channel_name || 'Mock Channel',
      subscriberCount: '1250',
      viewCount: '45678',
      videoCount: '23',
      thumbnails: {
        default: {
          url: 'https://via.placeholder.com/88x88',
          width: 88,
          height: 88
        },
        medium: {
          url: 'https://via.placeholder.com/240x240',
          width: 240,
          height: 240
        },
        high: {
          url: 'https://via.placeholder.com/800x800',
          width: 800,
          height: 800
        }
      },
      recentVideos: [
        {
          title: 'How to Create Viral Content',
          viewCount: '1234',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        },
        {
          title: 'YouTube SEO Tips',
          viewCount: '5678',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
        },
        {
          title: 'Content Strategy Guide',
          viewCount: '9012',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
        }
      ]
    };

    console.log('Successfully returning mock YouTube channel stats for:', responseData.channelTitle);
    console.log('Channel stats:', {
      subscribers: responseData.subscriberCount,
      views: responseData.viewCount,
      videos: responseData.videoCount
    });
    
    return res.status(200).json(responseData);
  } catch (error: any) {
    console.error('Error in channel-stats API:', error);
    
    // Return error response instead of mock data
    return res.status(500).json({ 
      error: 'Internal server error while fetching YouTube data',
      details: error.message 
    });
  }
}
