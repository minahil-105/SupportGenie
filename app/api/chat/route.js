
import { NextResponse } from 'next/server';
import { model } from '@/lib/utils';

const conversationHistories = new Map();

export async function POST(request) {
  try {
    const { sessionId, message } = await request.json();
    console.log('sessionId:', sessionId, 'message:', message);

    let history = conversationHistories.get(sessionId) || [];

    history.push({ role: 'user', content: message });

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(message);

    history.push({ role: 'assistant', content: result.response.text() });

    conversationHistories.set(sessionId, history);

    return NextResponse.json({ response: result.response.text() });
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}
