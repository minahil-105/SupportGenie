import { NextResponse } from 'next/server';
import { model } from '@/lib/utils';

const conversationHistories = new Map();

export async function POST(request) {
  try {
    const { sessionId, message } = await request.json();
    console.log('Received request with sessionId:', sessionId, 'and message:', message);

    // Get or initialize conversation history
    let history = conversationHistories.get(sessionId) || [];

    // Update history to use 'parts' property and ensure it is an array
    history.push({ role: 'user', parts: [message] });

    // Log the updated history
    console.log('Updated history:', JSON.stringify(history, null, 2));

    // Start chat with the updated history
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 350,
      },
    });

    // Log the chat instance
    console.log('Chat instance created:', chat);

    // Send the message and await the response
    const result = await chat.sendMessage(message);

    // Log the response
    console.log('API response:', result);

    // Update history with assistant's response
    history.push({ role: 'assistant', parts: [result.response.text()] });

    // Save the updated history
    conversationHistories.set(sessionId, history);

    // Return the assistant's response
    return NextResponse.json({ response: result.response.text() });
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}
