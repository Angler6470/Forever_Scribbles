import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Replicate API token is not configured.' }, { status: 500 });
    }

    const replicate = new Replicate({ auth: token });
    const formData = await req.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'An image file is required.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Use prediction creation to avoid Vercel timeouts
    const prediction = await replicate.predictions.create({
      model: "google/nano-banana-2",
      input: {
        image: buffer,
        prompt: 'Turn this into a crisp, clean coloring book page outline. Black and white only.',
      },
    });

    // Simple polling for result
    let finalPrediction = prediction;
    for (let i = 0; i < 20; i++) {
      finalPrediction = await replicate.predictions.get(finalPrediction.id);
      if (finalPrediction.status === 'succeeded') break;
      if (finalPrediction.status === 'failed') throw new Error("Generation failed");
      await new Promise(r => setTimeout(r, 1000));
    }

    if (finalPrediction.status !== 'succeeded') throw new Error("Generation timed out");

    return NextResponse.json({ result: finalPrediction.output });
  } catch (error: any) {
    console.error('API Error:', error);
    // Ensure we always return JSON, never HTML
    return NextResponse.json({ error: error.message || 'Generation failed.' }, { status: 500 });
  }
}