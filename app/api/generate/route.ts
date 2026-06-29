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

    if (!(file instanceof File)) throw new Error('Image file is required');

    // Convert file to base64 data URL
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Run the model with the data URL
    const prediction = await replicate.predictions.create({
      model: "google/nano-banana-2",
      input: {
        image: dataUrl,
        prompt: 'Convert the following image into a black and white line art coloring book page. Maintain the original composition.',
      },
    });

    let finalPrediction = prediction;
    for (let i = 0; i < 20; i++) {
      finalPrediction = await replicate.predictions.get(finalPrediction.id);
      if (finalPrediction.status === 'succeeded') break;
      await new Promise(r => setTimeout(r, 1000));
    }

    return NextResponse.json({ result: finalPrediction.output });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}