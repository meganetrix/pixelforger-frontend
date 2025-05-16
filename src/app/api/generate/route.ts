import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { prompt, model } = await request.json();
    const completion = await openai.chat.completions.create({
      model: model || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    return NextResponse.json({
      text: completion.choices[0].message.content
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('OpenAI error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
