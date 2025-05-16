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
  } catch (err: any) {
    console.error('OpenAI error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
