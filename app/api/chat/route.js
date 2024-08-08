import { NextResponse } from 'next/server';
import { model } from '@/lib/utils';

const conversationHistories = new Map();

export async function POST(request) {
  try {
    const { sessionId, message } = await request.json();
    console.log('Received request with sessionId:', sessionId, 'and message:', message);

    // Get or initialize conversation history
    let history = conversationHistories.get(sessionId) || [];

    // Ensure the message is in the correct format
    history.push({ role: 'user', parts: [{ text: message }] });

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
    //console.log('Chat instance created:', chat);

    // Send the message and await the response
    const result = await chat.sendMessage(message);

    // Access the response text correctly
    const responseText = result.response?.text() || 'No response text available';

    // Log the response
    console.log('API response:', responseText);

    // Update history with assistant's response
    history.push({ role: 'model', parts: [{ text: responseText }] });

    // Save the updated history
    conversationHistories.set(sessionId, history);

    // Return the assistant's response
    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}