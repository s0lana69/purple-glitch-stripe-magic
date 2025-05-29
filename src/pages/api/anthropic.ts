/**
 * Anthropic/Claude AI API endpoint for content analysis
 */

import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { NextApiRequest, NextApiResponse } from 'next';

// Initialize the Anthropic client
const apiKey = process.env.ANTHROPIC_API_KEY;
let anthropic: Anthropic | null = null;

// Initialize if API key is available
if (apiKey) {
  try {
    anthropic = new Anthropic({
      apiKey,
    });
    console.log("Anthropic client initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Anthropic client:", error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Anthropic client is initialized
  if (!anthropic) {
    console.error("Anthropic client is not initialized. Check API key in .env file.");
    return res.status(500).json({
      error: 'Anthropic client not initialized. Check API key.'
    });
  }

  try {
    const { prompt, channelUrl, query } = req.body;

    // Handle different types of input
    let analysisPrompt = '';
    
    if (prompt) {
      // Direct prompt from request
      analysisPrompt = prompt;
    } else if (channelUrl || query) {
      // YouTube channel analysis request
      const input = channelUrl || query;
      analysisPrompt = `Please analyze the following YouTube content or channel: ${input}
      
      Provide a comprehensive analysis including:
      1. Content themes and topics
      2. Target audience analysis
      3. SEO optimization suggestions
      4. Content strategy recommendations
      5. Trending potential assessment
      
      Please provide actionable insights for content creators.`;
    } else {
      return res.status(400).json({ error: 'A valid prompt, channelUrl, or query is required' });
    }

    console.log("Processing AI analysis request:", analysisPrompt.substring(0, 100) + "...");

    // Using Anthropic's Claude API for content analysis
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Using Haiku for faster responses
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
    });

    console.log("Response received from Anthropic API");

    // Structure the response for the AI scanner frontend
    return res.status(200).json({
      content: message.content,
      model: message.model,
      id: message.id
    });
  } catch (error: any) {
    console.error('Error calling Anthropic API:', error);

    // Try to extract meaningful error message for the client
    const errorMessage = error.message || 'Failed to process request';
    const statusCode = error.status || 500;

    return res.status(statusCode).json({
      error: errorMessage
    });
  }
}
