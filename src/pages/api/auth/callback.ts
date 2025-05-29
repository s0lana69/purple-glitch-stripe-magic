import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, error, error_description, state } = req.query;

    console.log('[AuthCallback] OAuth callback received:', { 
      hasCode: !!code, 
      error, 
      error_description,
      state 
    });

    // Handle OAuth errors
    if (error) {
      console.error('[AuthCallback] OAuth error:', error, error_description);
      return res.redirect(`/auth?error=${encodeURIComponent(error as string)}&description=${encodeURIComponent(error_description as string || '')}`);
    }

    if (!code || typeof code !== 'string') {
      console.error('[AuthCallback] No authorization code provided');
      return res.redirect('/auth?error=no_code');
    }

    // TODO: Exchange authorization code for Firebase tokens
    // This would typically involve:
    // 1. Exchange code with Google OAuth for access/refresh tokens
    // 2. Use Google tokens to authenticate with Firebase
    // 3. Create/update user profile in Firestore
    // 4. Set Firebase session cookies
    
    console.log('[AuthCallback] TODO: Implement Firebase OAuth flow');
    console.log('[AuthCallback] Authorization code:', code.substring(0, 20) + '...');

    // For now, simulate successful authentication by redirecting to auth page
    // The frontend will handle Firebase authentication
    const redirectTo = req.cookies['oauth-redirect-to'] || '/dashboard';
    
    // Clear OAuth cookies
    res.setHeader('Set-Cookie', [
      'oauth-redirect-to=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
      'oauth-state=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
    ]);

    // Redirect with a success parameter that the frontend can handle
    return res.redirect(`/auth?oauth_success=true&redirect_to=${encodeURIComponent(redirectTo)}`);

  } catch (error) {
    console.error('[AuthCallback] Error processing callback:', error);
    return res.redirect('/auth?error=internal_error');
  }
}
