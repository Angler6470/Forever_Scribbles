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

    // This model traces the edges of your provided image.
    // We add a 'control_guidance_strength' to keep the trace tight and clean.
    const output: any = await replicate.run(
      "jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
      {
        input: {
          image: dataUrl,
          prompt: "High-quality vector-style coloring book page, crisp solid black lines, pure white background, no shading, no texture.",
          negative_prompt: "wavy lines, messy, paint texture, shading, gradient, realistic, complex, color",
          // Adjusting control guidance ensures it ignores the paint texture 
          // and focuses on the structural edges.
          control_guidance_strength: 1.0,
          canny_low_threshold: 100,
          canny_high_threshold: 200
        }
      }
    );

    // Extract the URL safely from the output array
    const resultUrl = Array.isArray(output) ? output[0] : output;
    
    return NextResponse.json({ result: resultUrl });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}