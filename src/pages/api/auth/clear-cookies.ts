import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear all Supabase-related cookies (including the ones showing as corrupted in logs)
  const cookiesToClear = [
    'sb-jfkmpdfyevlutyrcgnhw-auth-token',
    'sb-jfkmpdfyevlutyrcgnhw-auth-token.0',
    'sb-jfkmpdfyevlutyrcgnhw-auth-token.1',
    'sb-jfkmpdfyevlutyrcgnhw-auth-token.2',
    'sb-jfkmpdfyevlutyrcgnhw-auth-token-code-verifier',
    'supabase-auth-token'
  ];

  const clearCookieHeaders: string[] = [];
  
  cookiesToClear.forEach(cookieName => {
    // Clear cookie for all possible paths and domains
    clearCookieHeaders.push(`${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Secure`);
    clearCookieHeaders.push(`${cookieName}=; Path=/; Domain=localhost; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`);
    clearCookieHeaders.push(`${cookieName}=; Path=/; Domain=127.0.0.1; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`);
    // Also clear without HttpOnly in case some were set without it
    clearCookieHeaders.push(`${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`);
  });

  res.setHeader('Set-Cookie', clearCookieHeaders);
  
  return res.status(200).json({ 
    message: 'All corrupted cookies cleared successfully. Please refresh the page.',
    clearedCookies: cookiesToClear
  });
}
