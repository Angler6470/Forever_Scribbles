import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    
    const output = await replicate.run(
      "google/nano-banana:5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa",
      {
        input: {
          image_input: image,
          prompt: "Convert this drawing to a clean black and white coloring page outline"
        }
      }
    );
    
    return NextResponse.json({ result: output });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}