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

    // Using SDXL ControlNet Canny - the gold standard for tracing
    const output: any = await replicate.run(
      "xlabs-ai/controlnet-canny:c1561084209587422f6d2e617d1e89df94682499d6910609b45667104b2a647d",
      {
        input: {
          image: dataUrl,
          prompt: "A high-quality coloring book page of an elephant, bold black lines, pure white background, crisp vector art, no shading, no gray, high contrast.",
          num_inference_steps: 30,
          guidance_scale: 5,
          controlnet_conditioning_scale: 1.0, 
        }
      }
    );

    let resultUrl = Array.isArray(output) ? output[0] : output;
    return NextResponse.json({ result: resultUrl });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}