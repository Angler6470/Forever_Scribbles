import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    const formData = await req.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) throw new Error('No image provided');

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // 1. Create the prediction explicitly
    const prediction = await replicate.predictions.create({
      model: "jagilley/controlnet-canny",
      version: "aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
      input: {
        image: dataUrl,
        prompt: "A Black and white version of this image made into a coloring book page. Same line work. No color.",
      }
    });

    // 2. Wait for it to finish
    const result = await replicate.wait(prediction);

    // 3. Extract output safely
    // The model returns an array. We access the first element directly.
    const output = (result as any).output;
    const imageUrl = Array.isArray(output) ? output[0] : output;

    console.log("FINAL URL TO LOAD:", imageUrl);

    return NextResponse.json({ result: imageUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}