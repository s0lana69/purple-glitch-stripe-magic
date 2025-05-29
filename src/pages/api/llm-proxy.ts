import type { NextApiRequest, NextApiResponse } from 'next';

// Constants for local LLM with better error messages if environment variables are missing
const LOCAL_LLM_URL = process.env.LOCAL_LLM_URL || 'http://localhost:11434';
const LOCAL_LLM_MODEL = process.env.LOCAL_LLM_MODEL || 'llama3';
const MAX_PROMPT_LENGTH = 1000; // Maximum allowed prompt length

// Log configuration at startup (development mode only)
if (process.env.NODE_ENV !== 'production') {
  console.log('LLM Configuration:');
  console.log(`URL: ${LOCAL_LLM_URL}`);
  console.log(`Model: ${LOCAL_LLM_MODEL}`);
}

type ResponseData = {
  text?: string;
  error?: string;
};

// Simple in-memory rate limiting
const limiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // limit each IP to 100 requests per windowMs
  requests: new Map<string, { count: number; resetTime: number }>(),

  check(ip: string): boolean {
    const now = Date.now();
    const record = this.requests.get(ip);

    // Reset if window expired
    if (record && record.resetTime < now) {
      this.requests.delete(ip);
    }

    // Get current or create new record
    const currentRecord = this.requests.get(ip) || {
      count: 0,
      resetTime: now + this.windowMs,
    };

    // Check if limit reached
    if (currentRecord.count >= this.maxRequests) {
      return false;
    }

    // Increment counter
    currentRecord.count++;
    this.requests.set(ip, currentRecord);
    return true;
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Methode erlaubt' });
  }

  // Get client IP
  const clientIp =
    (typeof req.headers['x-forwarded-for'] === 'string'
      ? req.headers['x-forwarded-for']
      : Array.isArray(req.headers['x-forwarded-for'])
        ? req.headers['x-forwarded-for'][0]
        : null) ||
    req.socket?.remoteAddress ||
    'unknown';

  // Apply rate limiting
  if (!limiter.check(String(clientIp))) {
    return res.status(429).json({
      error: 'Too many requests, please try again later',
    });
  }

  try {
    let { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt ist erforderlich' });
    }

    // Input validation
    if (typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt must be a string' });
    }

    // Length validation
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({
        error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters`,
      });
    }

    // Sanitize input - basic sanitization
    prompt = prompt.trim();

    console.log('Anfrage an lokales LLM senden:', prompt.substring(0, 50) + '...');

    // Request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      // Anfrage an das lokale LLM
      const response = await fetch(`${LOCAL_LLM_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: LOCAL_LLM_MODEL,
          prompt: prompt,
          stream: false,
          max_tokens: 500,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('LLM-Fehler:', errorText);
        return res.status(response.status).json({
          error: `Fehler vom LLM-Service: ${response.status} ${response.statusText}`,
        });
      }

      const data = await response.json();

      // Validate response format
      if (!data || !data.choices || !data.choices[0] || typeof data.choices[0].text !== 'string') {
        return res.status(500).json({ error: 'Invalid response format from LLM' });
      }

      return res.status(200).json({ text: data.choices[0].text });
    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        return res.status(504).json({ error: 'LLM request timed out' });
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Proxy-Fehler:', error);
    return res.status(500).json({
      error: 'Interner Serverfehler beim Aufruf des LLM. Ist der LLM-Server unter ' + LOCAL_LLM_URL + ' erreichbar?',
    });
  }
}
