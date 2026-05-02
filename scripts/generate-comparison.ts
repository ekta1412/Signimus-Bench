import fs from 'fs/promises';
import path from 'path';

const PSEO_DATA_PATH = path.join(__dirname, '../lib/pseo-data.json');

async function generateNewComparison() {
  console.log('Generating new comparison...');

  const prompt = `
    You are an expert in code performance and software development. Your task is to generate a new comparison topic for our benchmark website.
    The topic should be a comparison between two technologies, libraries, or coding techniques.
    Provide a slug, title, description, and two code snippets (code_a and code_b) for the comparison.
    The output must be a single JSON object, and nothing else.

    Example:
    {
      "slug": "for-loop-vs-foreach",
      "title": "For Loop vs. forEach: A Performance Deep Dive",
      "description": "Which is faster for iterating over arrays in JavaScript? We benchmark the classic for loop against the forEach method to find out.",
      "code_a": "const arr = Array.from({length: 1000000}, (_, i) => i);\nfor (let i = 0; i < arr.length; i++) {\n  // Do something\n}",
      "code_b": "const arr = Array.from({length: 1000000}, (_, i) => i);\narr.forEach(item => {\n  // Do something\n});"
    }
  `;

  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.TOGETHERAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ['<human>', '\n\n'],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    console.error('Failed to generate comparison:', await response.text());
    return;
  }

  const result = await response.json();
  const newComparison = JSON.parse(result.choices[0].message.content);

  const pseoData = JSON.parse(await fs.readFile(PSEO_DATA_PATH, 'utf-8'));
  pseoData.push(newComparison);

  await fs.writeFile(PSEO_DATA_PATH, JSON.stringify(pseoData, null, 2));

  console.log('Successfully generated and saved new comparison:', newComparison.title);
}

generateNewComparison();
