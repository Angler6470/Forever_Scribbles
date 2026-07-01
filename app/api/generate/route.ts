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

    // Patched for Flux Dev ControlNet
    // This model is much more precise and creates cleaner lines than the previous Canny model.
    // Update this section in your route.ts
const output: any = await replicate.run(
  "xlabs-ai/flux-dev-controlnet:9a8db105db745f8b11ad3afe5c8bd892428b2a43ade0b67edc4e0ccd52ff2fda",
  {
    input: {
      control_image: dataUrl,
      // We keep the prompt generic, but tell it to follow the image
      prompt: "A coloring book page of the subject in the provided image, bold thick black lines, pure white background, no shading, no grayscale.",
      guidance_scale: 2.5, 
      control_strength: 1.0, // Cranked to max to force tracing
      output_quality: 100,
      negative_prompt: "shading, gray, fuzzy, blurry, messy lines, watermark, text, distorted, low quality",
    }
  }
);

    let resultUrl = "";
    // Accessing the file URL for Flux output
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