// pages/api/geminiChat/route.js

import { NextResponse } from 'next/server';
import { model } from '@/lib/utls';

// export async function POST(req) {
//   try {
//     const { messages } = await req.json();
//     const response = await fetch('https://api.gemini.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: '1.5flash', 
//         messages: messages
//       })
//     });
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



export async function POST(request) {
  try {
    const { message } = await request.json();
    console.log('message: ' + message);

    const chat = model.startChat({ history: [] });

    const result = await chat.sendMessage(message);

    return NextResponse.json({ response: result.response.text() });
    // return NextResponse.json({ response: message });
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}
