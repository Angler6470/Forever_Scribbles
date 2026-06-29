import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    const replicate = new Replicate();

    const body = await req.json();
    const { image, prompt } = body;

    if (!image || !prompt) {
      return NextResponse.json({ error: "Both image and prompt are required" }, { status: 400 });
    }

    const output = await replicate.run(
      "google/nano-banana-2",
      {
        input: {
          image: image,
          prompt: prompt,
        },
      }
    );

    return NextResponse.json({ result: output });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}