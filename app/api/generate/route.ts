import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    const formData = await req.formData();
    const file = formData.get('image');
    if (!(file instanceof File)) throw new Error('No image provided');

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // We use a modern, robust model that treats your input as a "structural guide"
    // rather than an optional hint.
    const output: any = await replicate.run(
      "black-forest-labs/flux-1.1-pro", 
      {
        input: {
          prompt: "A clean, high-contrast, black-and-white coloring book page of this subject. Solid black lines, white background, no shading, no grayscale.",
          prompt_upsampling: true,
          image: dataUrl,
          // This ensures the output sticks strictly to the structure of your doodle
          control_strength: 0.9 
        }
      }
    );

    return NextResponse.json({ result: output });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}