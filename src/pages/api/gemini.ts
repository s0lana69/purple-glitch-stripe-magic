/**
 * Google Gemini 2.0 AI API endpoint for content analysis
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextApiRequest, NextApiResponse } from 'next';

// Initialize the Gemini client
const apiKey = process.env.GOOGLE_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

// Initialize if API key is available
if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("Google Gemini client initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Gemini client is initialized
  if (!genAI) {
    console.error("Gemini client is not initialized. Check GOOGLE_API_KEY in .env file.");
    return res.status(500).json({
      error: 'Gemini client not initialized. Check API key.'
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
      6. Competitive analysis insights
      7. Monetization opportunities
      
      Please provide actionable insights for content creators in a well-structured format.`;
    } else {
      return res.status(400).json({ error: 'A valid prompt, channelUrl, or query is required' });
    }

    console.log("Processing AI analysis request with Gemini 2.0:", analysisPrompt.substring(0, 100) + "...");

    // Get Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content using Gemini
    const result = await model.generateContent(analysisPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("Response received from Gemini API");

    // Structure the response similar to Anthropic format for frontend compatibility
    return res.status(200).json({
      content: [
        {
          type: 'text',
          text: text
        }
      ],
      model: 'gemini-2.0-flash',
      id: `gemini-${Date.now()}`
    });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);

    // Try to extract meaningful error message for the client
    const errorMessage = error.message || 'Failed to process request';
    const statusCode = error.status || 500;

    return res.status(statusCode).json({
      error: errorMessage
    });
  }
}