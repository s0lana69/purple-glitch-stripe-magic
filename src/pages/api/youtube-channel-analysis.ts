import 'dotenv/config';
import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
const apiKey = process.env.ANTHROPIC_API_KEY;
let anthropic: Anthropic | null = null;

if (apiKey) {
  try {
    anthropic = new Anthropic({ apiKey });
    console.log('Anthropic client initialized successfully for YouTube channel analysis');
  } catch (error) {
    console.error('Failed to initialize Anthropic client:', error);
  }
}

// Validate if URL is a YouTube channel URL
function isYouTubeChannelUrl(url: string): boolean {
  const patterns = [
    /^(https?:\/\/)?(www\.)?youtube\.com\/channel\/[a-zA-Z0-9_-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/@[a-zA-Z0-9_-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/c\/[a-zA-Z0-9_-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/user\/[a-zA-Z0-9_-]+/
  ];
  return patterns.some(pattern => pattern.test(url));
}

// Extract channel identifier from YouTube URL
function extractChannelInfo(url: string): { type: string; id: string } | null {
  // Channel ID format (UC...)
  const channelMatch = url.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/);
  if (channelMatch) {
    return { type: 'channelId', id: channelMatch[1] };
  }

  // Handle format (@username)
  const handleMatch = url.match(/youtube\.com\/@([a-zA-Z0-9_-]+)/);
  if (handleMatch) {
    return { type: 'handle', id: handleMatch[1] };
  }

  // Custom URL format (/c/channelname)
  const customMatch = url.match(/youtube\.com\/c\/([a-zA-Z0-9_-]+)/);
  if (customMatch) {
    return { type: 'customUrl', id: customMatch[1] };
  }

  // User format (/user/username)
  const userMatch = url.match(/youtube\.com\/user\/([a-zA-Z0-9_-]+)/);
  if (userMatch) {
    return { type: 'username', id: userMatch[1] };
  }

  return null;
}

// Fetch channel data from YouTube API
async function getChannelData(channelInfo: { type: string; id: string }) {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  let apiUrl = '';

  // Build API URL based on channel identifier type
  switch (channelInfo.type) {
    case 'channelId':
      apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${channelInfo.id}&key=${apiKey}`;
      break;
    case 'handle':
      // For handles, we need to use the search API first or forUsername
      apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle=${channelInfo.id}&key=${apiKey}`;
      break;
    case 'customUrl':
    case 'username':
      apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forUsername=${channelInfo.id}&key=${apiKey}`;
      break;
    default:
      throw new Error('Invalid channel identifier type');
  }

  const response = await fetch(apiUrl);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch channel data');
  }

  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found');
  }

  return data.items[0];
}

// Get recent videos from channel
async function getChannelVideos(channelId: string, maxResults: number = 10) {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch channel videos');
  }

  return data.items || [];
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
    const { channelUrl } = req.body;

    if (!channelUrl || typeof channelUrl !== 'string') {
      return res.status(400).json({ error: 'A valid YouTube channel URL is required' });
    }

    // Trim whitespace from the URL
    const cleanChannelUrl = channelUrl.trim();

    // Validate if it's a YouTube channel URL
    if (!isYouTubeChannelUrl(cleanChannelUrl)) {
      return res.status(400).json({ 
        error: 'The provided URL is not a valid YouTube channel URL. Please use formats like:\n• https://www.youtube.com/channel/UC...\n• https://www.youtube.com/@channelname\n• https://www.youtube.com/c/channelname' 
      });
    }

    // Extract channel info
    const channelInfo = extractChannelInfo(cleanChannelUrl);
    if (!channelInfo) {
      return res.status(400).json({ error: 'Could not extract channel information from the URL' });
    }

    console.log(`Processing YouTube channel: ${channelInfo.type} - ${channelInfo.id}`);

    // Fetch channel data
    const channelData = await getChannelData(channelInfo);
    const channelId = channelData.id;

    // Fetch recent videos
    const recentVideos = await getChannelVideos(channelId, 10);

    // Prepare data for AI analysis
    const channelStats = channelData.statistics;
    const channelSnippet = channelData.snippet;

    const videoTitles = recentVideos.map((video: any) => video.snippet.title).slice(0, 10);
    const videoDescriptions = recentVideos.map((video: any) => video.snippet.description?.substring(0, 200) || '').slice(0, 5);

    // Create prompt for Claude
    const prompt = `
You are an expert YouTube channel analyst and SEO consultant. Analyze the following YouTube channel data and provide comprehensive insights and recommendations:

CHANNEL INFORMATION:
- Channel Name: ${channelSnippet.title}
- Description: ${channelSnippet.description || 'No description provided'}
- Subscriber Count: ${Number(channelStats.subscriberCount || 0).toLocaleString()}
- Total Views: ${Number(channelStats.viewCount || 0).toLocaleString()}
- Total Videos: ${Number(channelStats.videoCount || 0).toLocaleString()}
- Channel Created: ${channelSnippet.publishedAt}

RECENT VIDEO TITLES (Last 10 videos):
${videoTitles.map((title: string, index: number) => `${index + 1}. ${title}`).join('\n')}

SAMPLE VIDEO DESCRIPTIONS:
${videoDescriptions.map((desc: string, index: number) => `${index + 1}. ${desc}...`).join('\n\n')}

Please provide a comprehensive analysis including:

1. **Channel Overview & Performance Assessment**
   - Overall channel health and growth potential
   - Content strategy analysis
   - Audience engagement insights

2. **Content Analysis & Patterns**
   - Common themes and topics
   - Title patterns and effectiveness
   - Content consistency analysis

3. **SEO & Optimization Recommendations**
   - 15-20 high-impact keywords for this niche
   - Title optimization suggestions
   - Channel branding improvements

4. **Growth Strategy Recommendations**
   - Content gaps and opportunities
   - Recommended video topics (5-7 specific ideas)
   - Collaboration and cross-promotion opportunities

5. **Competitive Analysis Insights**
   - Market positioning
   - Unique value propositions
   - Areas for differentiation

6. **Technical Recommendations**
   - Upload schedule optimization
   - Thumbnail and metadata improvements
   - Community engagement strategies

Please be specific, actionable, and data-driven in your recommendations.
`;

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    console.log('Response received from Anthropic API for YouTube channel analysis');

    // Structure the response
    return res.status(200).json({
      content: message.content,
      model: message.model,
      id: message.id,
      channelData: {
        channelId: channelId,
        title: channelSnippet.title,
        description: channelSnippet.description,
        subscriberCount: channelStats.subscriberCount,
        viewCount: channelStats.viewCount,
        videoCount: channelStats.videoCount,
        publishedAt: channelSnippet.publishedAt,
        thumbnails: channelSnippet.thumbnails,
      },
      recentVideos: recentVideos.slice(0, 5).map((video: any) => ({
        title: video.snippet.title,
        description: video.snippet.description?.substring(0, 100) || '',
        publishedAt: video.snippet.publishedAt,
        videoId: video.id.videoId,
      })),
    });
  } catch (error: any) {
    console.error('Error analyzing YouTube channel:', error);

    // Try to extract meaningful error message for the client
    const errorMessage = error.message || 'Failed to process YouTube channel analysis request';
    const statusCode = error.status || 500;

    return res.status(statusCode).json({
      error: errorMessage,
    });
  }
}
