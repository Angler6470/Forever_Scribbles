import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) throw new Error('Token missing');

    const replicate = new Replicate({ auth: token });
    const formData = await req.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) throw new Error('No image provided');

    // Reverting to Data URL format as this is the standard for most Replicate models
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    const prediction = await replicate.predictions.create({
  // Use the model name without the specific version hash
  model: "lucataco/controlnet-canny", 
  input: {
    image: dataUrl,
    prompt: "A Black and white coloring book page. Same line work as the original. No color, no shading, clean lines.",
    num_inference_steps: 20
  },
});

    const result = await replicate.wait(prediction);
    return NextResponse.json({ result: result.output });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}