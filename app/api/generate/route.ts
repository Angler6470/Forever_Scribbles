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

    // Convert to raw base64 string without the prefix
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "google/nano-banana-2",
      input: {
        image: base64, 
        prompt: "A Black and white version of this image made into a coloring book page. Same line work. No color.",
      },
    });

    // Wait for the result
    const result = await replicate.wait(prediction);

    if (!result.output) throw new Error("No output from model");

    return NextResponse.json({ result: result.output });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}