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

    // Using the stable, public Stability AI model
    const output = await replicate.run(
      "stability-ai/stable-diffusion-img2img:c46967525381f2679237090886c9b33a7e366e8574169542a2754636b04a9117",
      {
        input: {
          image: dataUrl,
          prompt: "A high-quality black and white coloring book page of the subject, clean line art, white background, no shading.",
          strength: 0.5
        }
      }
    );

    // The stable-diffusion-img2img model returns an array
    const resultUrl = Array.isArray(output) ? output[0] : output;
    
    return NextResponse.json({ result: resultUrl });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}