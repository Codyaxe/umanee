// Guide siguro:
// do 'npm install' if not already done
// do 'npm install groq-sdk' in the backend folder (its already in package.json)
// make sure GROQ_API_KEY is set in your .env file
// do 'node tests/ai_console_test.js' inside the backend folder to run this script

import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';

dotenv.config();

const groqApiKey = process.env.GROQ_API_KEY;
const model = 'llama-3.3-70b-versatile';

// Idk how to make the location based on users location, so hardcoding for now
const location = 'Philippines, Batangas City, Alangilan';

const prompt = `What crops should I sell this season to maximize profit?
Answer should be based on current market trends, climate conditions, and consumer demand.
Write the crops name in capital letters only, separated by commas.
Example of output: SITAW, CORN, RICE.
Only answer with the crop names, no additional text.
Location is ${location}.`;

if (!groqApiKey) {
  console.error('Error: GROQ_API_KEY is not set.\nSet it in your environment or in backend/.env (GROQ_API_KEY=your_key)');
  process.exit(1);
}

// This function will return a list of suggested crops
// You can use the returned array to display or process the crops as needed
// Not really accurate for now, try changing the temperature value
async function runAI() {
  try {
    const groq = new Groq({ groqApiKey });

    // closer to 1 = more creative, 0 = more precise
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model,
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null
    });

    let output = '';
    for await (const chunk of chatCompletion) {
      const content = chunk.choices?.[0]?.delta?.content || '';
      output += content;
    }

    const items = output
      .trim()
      .replace(/\n/g, ' ')
      .split(',')
      .map(s => s.trim().replace(/[^a-zA-Z\s]/g, '').toUpperCase())
      .filter(Boolean);

    return items;
  } catch (err) {
    console.error('GROQ request failed:', err?.message || err);
    process.exit(1);
  }
}

// For testing purposes
const result = await runAI();
console.log(result);
console.log('\nEach crop on its own line:');
result.forEach(crop => console.log('-', crop));