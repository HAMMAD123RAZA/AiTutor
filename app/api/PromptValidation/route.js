import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure dynamic function

// const TOGETHER_API_KEY = 'tgp_v1_PnbHUS8vyIYl6tLYTJv6bvXRZca9yfBe44C7y2otFU4';
const TOGETHER_API_KEY =process.env.together_Api;

// tgp_v1_P8gfTAkO71AyXTSqJcEGfWRL9Q6egGUvTM5Iyf3--bU
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    const systemPrompt = `
You are a strict AI filter. Only approve prompts that are clearly about programming or programming courses (e.g., JavaScript, Python, coding tutorials, algorithms, etc.).
If the prompt is not related to programming, respond with: "❌ Not a programming-related prompt."
If the prompt is related, respond with: "✅ Programming prompt."
`;

    const res = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.2,
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || '';

    const isValid = reply.includes('✅');

    return NextResponse.json({
      valid: isValid,
      message: isValid ? 'Prompt is valid and related to programming.' : '❌ Sorry, enter a prompt related to programming.',
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
