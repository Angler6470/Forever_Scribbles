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

    // SWITCHED TO LINEART MODEL: This model ignores texture and focuses on outlines.
    const prediction = await replicate.predictions.create({
      model: "jagilley/controlnet-lineart",
      version: "f4284523315a091533036413d7d748f2195821c97793d56d10c0e5a8767e7550",
      input: {
        image: dataUrl,
        prompt: "A professional coloring book page outline, clean thick solid lines, white background, no shading, no texture, high contrast.",
      }
    });

    const result = await replicate.wait(prediction);

    const output = (result as any).output;
    const imageUrl = Array.isArray(output) ? output[0] : output;

    console.log("FINAL URL TO LOAD:", imageUrl);

    return NextResponse.json({ result: imageUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}