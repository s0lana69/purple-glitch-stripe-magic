import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Replace with Firebase implementation
    // Mock authenticated user for now
    const user = {
      id: 'mock-user-id',
      email: 'user@example.com',
      user_metadata: {
        youtube_channel_name: 'Mock Channel',
        youtube_refresh_token: 'mock-refresh-token',
        youtube_access_token: 'mock-access-token'
      }
    };
    console.log('TODO: Get authenticated user from Firebase');

    if (!user) {
      return res.status(200).json({ 
        user: null,
        error: null
      });
    }

    return res.status(200).json({
      user: user,
      error: null
    });

  } catch (error) {
    console.error('Error getting session:', error);
    return res.status(500).json({
      user: null,
      error: 'Internal server error'
    });
  }
}
