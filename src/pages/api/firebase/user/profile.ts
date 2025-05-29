import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get session cookie
    const sessionCookie = req.cookies.session || '';

    if (!sessionCookie) {
      return res.status(401).json({ error: 'No session found' });
    }

    // Verify session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    if (req.method === 'GET') {
      // Get user profile
      const userDoc = await adminDb.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      return res.status(200).json({ user: userDoc.data() });
    }

    if (req.method === 'PUT') {
      // Update user profile
      const updateData = req.body;
      
      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updateData.uid;
      delete updateData.created_at;
      
      await adminDb.collection('users').doc(uid).update({
        ...updateData,
        updated_at: new Date().toISOString(),
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Profile API error:', error);
    return res.status(401).json({ error: 'Invalid session' });
  }
}
