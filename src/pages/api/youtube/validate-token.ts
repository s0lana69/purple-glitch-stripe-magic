import type { NextApiRequest, NextApiResponse } from 'next';
import { getYouTubeAccessToken, validateYouTubeToken } from '@/lib/youtubeAuth';

type ValidationResponse = {
  valid: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidationResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ valid: false, error: 'Method Not Allowed' });
  }

  try {
    // Use the enhanced helper to get access token
    const tokenResult = await getYouTubeAccessToken(req);

    if (!tokenResult.success) {
      console.log('API validate-token: No valid token found:', tokenResult.error);
      return res.status(200).json({ valid: false, error: tokenResult.error });
    }

    const { accessToken } = tokenResult;

    if (!accessToken) {
      return res.status(200).json({ valid: false, error: 'No access token available' });
    }

    // Validate the token using the helper function
    const isValid = await validateYouTubeToken(accessToken);

    if (isValid) {
      console.log('API validate-token: Token is valid');
      return res.status(200).json({ valid: true });
    } else {
      console.log('API validate-token: Token validation failed');
      return res.status(200).json({ 
        valid: false, 
        error: 'Token validation failed'
      });
    }
  } catch (error: any) {
    console.error('API validate-token: Internal error', error.message);
    return res.status(200).json({ 
      valid: false, 
      error: 'Internal server error during token validation' 
    });
  }
}
