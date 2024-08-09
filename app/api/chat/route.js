import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { model } from '../../lib/utils';

export async function POST(request) {
  try {
    const { sessionId, message } = await request.json();
    console.log('Received request with sessionId:', sessionId, 'and message:', message);

    const client = await clientPromise;
    const db = client.db('SupportGenie'); 
    const collection = db.collection('Genie');
    let historyRecord = await collection.findOne({ sessionId });
    let history;
    if (!historyRecord) {
      history = [];
    } else {
      history = historyRecord.history;
    }

    history.push({ role: 'user', parts: [{ text: message }] });
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 350,
      },
    });
    const result = await chat.sendMessage(message);
    const responseText = result.response?.text() || 'No response text available';

    history.push({ role: 'model', parts: [{ text: responseText }] });

    await collection.updateOne(
      { sessionId },
      { $set: { sessionId, history } },
      { upsert: true }
    );

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}
