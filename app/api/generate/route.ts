import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    const replicate = new Replicate();
    
    // Parse the body
    const body = await req.json();
    const { image, prompt } = body;

    // Validate inputs
    if (!image || !prompt) {
      return NextResponse.json({ error: "Both image and prompt are required" }, { status: 400 });
    }

    // Call the model with the prompt
    const prediction = await replicate.run(
      "google/nano-banana-2",
      {
        input: {
          image: image,
          prompt: prompt, // We now include the prompt!
        },
      }
    );

    return NextResponse.json({ result: prediction });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}