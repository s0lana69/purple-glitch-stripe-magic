import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set cookie
    res.setHeader('Set-Cookie', [
      `session=${sessionCookie}; Max-Age=${expiresIn}; HttpOnly; Secure; SameSite=Strict; Path=/`
    ]);

    return res.status(200).json({ 
      success: true, 
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      }
    });
  } catch (error) {
    console.error('Session creation error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
