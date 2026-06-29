import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    const replicate = new Replicate();
    
    // Parse the incoming request
    const body = await req.json();
    const { image, prompt } = body;

    // Validate that we have the data we need
    if (!image || !prompt) {
      return NextResponse.json({ error: "Both image and prompt are required" }, { status: 400 });
    }

    // Run the model
    // Note: This returns the prediction object immediately
    const prediction = await replicate.run(
      "google/nano-banana-2",
      {
        input: {
          image: image,
          prompt: prompt,
        },
      }
    );

    // Return the prediction so you can track it on your Replicate dashboard
    return NextResponse.json({ 
      message: "Processing started",
      prediction: prediction 
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}