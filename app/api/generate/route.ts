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

    // Patched input for high accuracy and clean lines
    const output: any = await replicate.run(
      "jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
      {
        input: {
          image: dataUrl,
          prompt: "Professional coloring book page, bold thick black lines, pure white background, extremely clean, no noise, vector art style, high contrast, centered.",
          num_inference_steps: 40,
          guidance_scale: 7.0, // Slightly reduced to prevent hallucination
          canny_low_threshold: 150, // Higher threshold forces AI to ignore faint noise
          canny_high_threshold: 250, // Higher threshold keeps only the solid lines
        }
      }
    );

    let resultUrl = "";
    // Robust URL extraction for Replicate output
    if (Array.isArray(output) && output.length > 0) {
      resultUrl = typeof output[0] === 'string' ? output[0] : output[0].url();
    } else {
      resultUrl = output;
    }

    return NextResponse.json({ result: resultUrl });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}