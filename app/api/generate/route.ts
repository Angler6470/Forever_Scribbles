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

    // Convert file to base64 Data URL for Replicate
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // We are using a public, stable image-to-image model.
    // Note: If you want a different model, find the exact model:version string
    // on the Replicate website under the 'API' tab for that specific model.
    const model = "stability-ai/stable-diffusion-img2img:c46967525381f2679237090886c9b33a7e366e8574169542a2754636b04a9117";

    const output: any = await replicate.run(model, {
      input: {
        image: dataUrl,
        prompt: "A clean black and white coloring book page of this drawing, high contrast, solid lines, white background, no shading.",
        strength: 0.5 // Controls how much it follows your original drawing
      }
    });

    // The output is an array of strings
    const imageUrl = Array.isArray(output) ? output[0] : output;
    
    return NextResponse.json({ result: imageUrl });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}