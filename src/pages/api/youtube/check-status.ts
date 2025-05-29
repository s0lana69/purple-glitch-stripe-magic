import type { NextApiRequest, NextApiResponse } from 'next';
import { validateYouTubeToken } from '@/lib/youtubeAuth';

interface UserMetadata {
  youtube_channel_name?: string;
  youtube_refresh_token?: string;
}

interface User {
  id: string;
  email: string;
  user_metadata: UserMetadata;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Replace with Firebase implementation
    // Mock authenticated user for now
    const user: User = {
      id: 'mock-user-id',
      email: 'user@example.com',
      user_metadata: {
        youtube_channel_name: 'Mock Channel',
        youtube_refresh_token: 'mock-refresh-token'
      }
    };
    console.log('TODO: Get authenticated user from Firebase');

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const refreshToken = user.user_metadata?.youtube_refresh_token;
    if (!refreshToken) {
      return res.status(200).json({ 
        isConnected: false,
        channelName: null,
        error: 'No YouTube connection found'
      });
    }

    try {
      // TODO: Replace with Firebase implementation
      // Mock access token validation
      console.log('TODO: Get fresh access token using refresh token:', refreshToken);
      const mockAccessToken = 'mock-access-token';
      
      if (!mockAccessToken) {
        console.error('Failed to get YouTube access token');
        return res.status(200).json({
          isConnected: false,
          channelName: null,
          error: 'Failed to validate YouTube connection'
        });
      }

      // Validate the token and get channel info
      const channelInfo = await validateYouTubeToken(mockAccessToken);
      if (!channelInfo) {
        console.error('Failed to validate YouTube token or get channel info');
        return res.status(200).json({
          isConnected: false,
          channelName: null,
          error: 'Failed to validate YouTube connection'
        });
      }

      // Update user metadata if channel name has changed
      if (channelInfo.channelName !== user.user_metadata?.youtube_channel_name) {
        console.log('TODO: Update user metadata in Firebase with new channel name:', channelInfo.channelName);
      }

      return res.status(200).json({
        isConnected: true,
        channelName: channelInfo.channelName,
        error: null
      });

    } catch (error) {
      console.error('Error validating YouTube connection:', error);
      
      // If token validation fails, consider the connection broken
      return res.status(200).json({
        isConnected: false,
        channelName: null,
        error: 'Failed to validate YouTube connection'
      });
    }

  } catch (error) {
    console.error('Error in check-status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
