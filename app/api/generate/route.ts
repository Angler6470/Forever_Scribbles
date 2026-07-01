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

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Using the official hash and input structure
    const output: any = await replicate.run(
      "xlabs-ai/flux-controlnet:017ca9c50e6f53e6510c8b1859ea112fbb83ee266c5ef6f461c05b4f1cc5bf63",
      {
        input: {
          image: dataUrl,
          prompt: "coloring book page of an elephant, bold black lines, clean white background, high contrast, crisp lines, vector style, no shading, no gray",
          // The API expects these specific settings
          guidance_scale: 2.5,
          output_quality: 100,
        }
      }
    );

    // Replicate returns an array of output URLs
    let resultUrl = Array.isArray(output) ? output[0] : output;
    return NextResponse.json({ result: resultUrl });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}