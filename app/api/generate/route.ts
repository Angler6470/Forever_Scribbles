import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) return NextResponse.json({ error: 'Token missing' }, { status: 500 });

    const replicate = new Replicate({ auth: token });
    const formData = await req.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    // Convert file to base64 Data URL
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "google/nano-banana-2",
      input: {
        image: dataUrl,
        prompt: "A Black and white version of this image made into a coloring book page. Same line work. No color.",
      },
    });

    // Wait for the result
    const result = await replicate.wait(prediction);

    if (!result.output) throw new Error("No output from model");

    // Return the URL directly
    return NextResponse.json({ result: result.output });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}