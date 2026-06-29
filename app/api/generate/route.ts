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

    // 1. Run the model with the exact version hash provided in the API docs
    const output: any = await replicate.run(
      "jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
      {
        input: {
          image: dataUrl,
          prompt: "A professional black and white coloring book page of the subject, clean line art, high contrast, white background.",
        }
      }
    );

    // 2. Extract the URL exactly as the documentation shows: output[0].url()
    // We check if it's an array and if the .url() method exists.
    let resultUrl = "";
    if (Array.isArray(output) && output.length > 0) {
      // If the result is an object with a .url() function, call it.
      resultUrl = typeof output[0].url === 'function' ? output[0].url() : output[0];
    } else {
      resultUrl = output;
    }

    console.log("SUCCESS! Extracted URL:", resultUrl);
    return NextResponse.json({ result: resultUrl });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}