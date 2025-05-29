require('dotenv').config();
const { Anthropic } = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
});

async function run() {
  try {
    console.log(
      'API Key:',
      process.env.ANTHROPIC_API_KEY
        ? 'Available (length: ' + process.env.ANTHROPIC_API_KEY.length + ')'
        : 'Not available',
    );
    console.log('Using model: claude-3-haiku-20240307');

    const msg = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{ role: 'user', content: 'Hello Claude' }],
    });

    console.log('Response received:');
    console.log(JSON.stringify(msg, null, 2));
  } catch (error) {
    console.error('Error occurred:');
    console.error(error.message);
    console.error(error.stack);
  }
}

run();
