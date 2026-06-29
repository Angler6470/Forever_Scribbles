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
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // REMOVED THE VERSION HASH. 
    // Using just {owner}/{model} ensures you are always using the current, valid version.
    const output: any = await replicate.run(
      "paappraiser/retro-coloring-book",
      {
        input: {
          image: dataUrl, // Pass your image as input
          prompt: "A simple, clean coloring book page. Minimal black lines, white background, thick outlines, easy to color.",
          negative_prompt: "complex, realistic, color, gradient, shading, texture, wavy lines"
        }
      }
    );

    // Extract the URL safely
    const resultUrl = Array.isArray(output) ? output[0] : output;
    
    return NextResponse.json({ result: resultUrl });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}