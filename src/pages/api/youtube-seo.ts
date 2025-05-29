import 'dotenv/config';
import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { YoutubeTranscript } from 'youtube-transcript';

// Initialize the Anthropic client
const apiKey = process.env.ANTHROPIC_API_KEY;
let anthropic: Anthropic | null = null;

if (apiKey) {
  try {
    anthropic = new Anthropic({ apiKey });
    console.log('Anthropic client initialized successfully for YouTube SEO');
  } catch (error) {
    console.error('Failed to initialize Anthropic client:', error);
  }
}

// Validate if URL is a YouTube URL
function isYouTubeUrl(url: string): boolean {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.?be\/).+$/;
  return pattern.test(url);
}

// Helper function to extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  // Check if it's a YouTube Shorts URL
  if (url.includes('youtube.com/shorts/')) {
    const shortsMatch = url.match(/youtube\.com\/shorts\/([^/?&]+)/);
    return shortsMatch ? shortsMatch[1] : null;
  }

  // Regular YouTube URL
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7] && match[7].length === 11 ? match[7] : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Anthropic client is initialized
  if (!anthropic) {
    console.error('Anthropic client is not initialized. Check API key in .env file.');
    return res.status(500).json({
      error: 'Anthropic client not initialized. Check API key.',
    });
  }

  try {
    const { youtubeUrl, description } = req.body;

    if (!youtubeUrl || typeof youtubeUrl !== 'string') {
      return res.status(400).json({ error: 'A valid YouTube URL is required' });
    }

    // Validate if it's a YouTube URL
    if (!isYouTubeUrl(youtubeUrl)) {
      return res.status(400).json({ error: 'The provided URL is not a valid YouTube URL' });
    }

    // Extract video ID
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return res.status(400).json({ error: 'Could not extract video ID from the URL' });
    }

    console.log(`Processing YouTube video with ID: ${videoId}`);

    // Get transcript
    let transcript;
    try {
      transcript = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (error) {
      console.error('Error fetching transcript:', error);
      return res
        .status(400)
        .json({ error: 'Could not fetch transcript for this video. It may not have captions available.' });
    }

    // Combine transcript text
    const transcriptText = transcript
      .map((item) => item.text)
      .join(' ')
      .trim();

    if (!transcriptText) {
      return res.status(400).json({ error: 'No transcript content available for this video' });
    }

    // Create prompt for Claude with optional description context
    let prompt = `
You are an expert SEO consultant analyzing a YouTube video transcript. 
Based on the following transcript, provide SEO optimization suggestions:

TRANSCRIPT:
${transcriptText}`;

    // Add user description context if provided
    if (description && description.trim()) {
      prompt += `

ADDITIONAL CONTEXT FROM USER:
${description.trim()}

Please consider this additional context when providing your recommendations.`;
    }

    prompt += `

Please provide the following in your response:
1. 3-5 Suggested video titles that are SEO-optimized (include important keywords)
2. 10-15 Relevant SEO keywords and phrases for this content
3. A 150-200 word video description optimized for search engines
4. 10 Suggested hashtags relevant to the content
`;

    // Using Anthropic's Claude API with Haiku model
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    console.log('Response received from Anthropic API for YouTube SEO analysis');

    // Structure the response for easier frontend handling
    return res.status(200).json({
      content: message.content,
      model: message.model,
      id: message.id,
      videoId: videoId,
      hasUserContext: !!description?.trim(),
    });
  } catch (error: any) {
    console.error('Error analyzing YouTube video:', error);

    // Try to extract meaningful error message for the client
    const errorMessage = error.message || 'Failed to process YouTube SEO request';
    const statusCode = error.status || 500;

    return res.status(statusCode).json({
      error: errorMessage,
    });
  }
}
