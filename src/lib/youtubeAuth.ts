// This project uses Firebase, not Supabase
// This file is kept for backward compatibility with YouTube functionality

import { NextApiRequest } from 'next';

console.warn('⚠️ YouTube auth using Supabase accessed but this project uses Firebase. Using dummy implementation.');

interface YouTubeChannelInfo {
  channelId: string;
  channelName: string;
}

interface TokenResult {
  success: boolean;
  accessToken?: string;
  user?: any;
  error?: string;
}

// Dummy functions for YouTube auth - these should be replaced with Firebase-based implementations
export async function getYouTubeAccessToken(req: NextApiRequest): Promise<TokenResult> {
  console.warn('getYouTubeAccessToken called but not implemented for Firebase');
  return {
    success: true,
    accessToken: 'mock-access-token',
    user: {
      id: 'mock-user-id',
      email: 'user@example.com',
      user_metadata: {
        youtube_channel_name: 'Mock Channel'
      }
    }
  };
}

export async function validateYouTubeToken(accessToken: string): Promise<YouTubeChannelInfo | null> {
  console.warn('validateYouTubeToken called but not implemented for Firebase');
  return {
    channelId: 'mock-channel-id',
    channelName: 'Mock Channel'
  };
}

export async function refreshYouTubeToken(refreshToken: string): Promise<string | null> {
  console.warn('refreshYouTubeToken called but not implemented for Firebase');
  return null;
}

export async function storeYouTubeTokens(userId: string, accessToken: string, refreshToken: string): Promise<void> {
  console.warn('storeYouTubeTokens called but not implemented for Firebase');
}

export async function getServerSession(req: NextApiRequest): Promise<any> {
  console.warn('getServerSession (Supabase) called but not implemented for Firebase');
  return null;
}

// Dummy implementations for any other YouTube auth functions
export const youtubeAuth = {
  getAccessToken: getYouTubeAccessToken,
  validateToken: validateYouTubeToken,
  refreshToken: refreshYouTubeToken,
  storeTokens: storeYouTubeTokens,
};
