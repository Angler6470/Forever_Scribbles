import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    // The library automatically detects process.env.REPLICATE_API_TOKEN
    const replicate = new Replicate();
    
    const body = await req.json();
    const { image } = body;

    // Use the updated model slug "google/nano-banana-2"
    const prediction = await replicate.run(
      "google/nano-banana-2",
      {
        input: {
          image: image,
        },
      }
    );

    return NextResponse.json({ result: prediction });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}