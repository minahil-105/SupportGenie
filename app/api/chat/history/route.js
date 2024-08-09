import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('SupportGenie');
    const collection = db.collection('Genie');
    const histories = await collection.find({}).toArray();

    return NextResponse.json({ chats: histories });
  } catch (error) {
    console.log('Error fetching history:', error);
    return NextResponse.json({ error: 'Error fetching history' }, { status: 500 });
  }
}
