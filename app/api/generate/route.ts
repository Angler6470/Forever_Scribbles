import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) throw new Error('API token not configured');

    const replicate = new Replicate({ auth: token });
    const formData = await req.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) throw new Error('No image provided');

    // Convert file to base64 Data URL
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Using the official edge-guided flux-canny-pro model
    // This model is optimized to preserve your sketch's structure
    const output = await replicate.run(
      "black-forest-labs/flux-canny-pro",
      {
        input: {
          image: dataUrl,
          prompt: "A crisp, professional black and white coloring book page. High contrast, clean thick lines, white background, no shading, no color.",
          control_strength: 1.0, // Ensures it strictly follows your sketch
          aspect_ratio: "1:1"
        }
      }
    );

    // The output is an array of strings
    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ result: imageUrl });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}