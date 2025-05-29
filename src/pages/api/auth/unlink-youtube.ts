import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // TODO: Update user metadata in Firebase to remove YouTube connection
    console.log('TODO: Remove YouTube connection data from user in Firebase:', {
      userId: user.id,
      fieldsToRemove: [
        'youtube_channel_name',
        'youtube_refresh_token',
        'youtube_access_token'
      ]
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'YouTube account unlinked successfully'
    });

  } catch (error) {
    console.error('Error unlinking YouTube account:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
