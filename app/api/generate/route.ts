import { NextResponse, NextRequest } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) return NextResponse.json({ error: 'Token missing' }, { status: 500 });

    const replicate = new Replicate({ auth: token });
    const formData = await req.formData();
    const file = formData.get('image');
    
    if (!(file instanceof File)) return NextResponse.json({ error: 'File missing' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a prediction (asynchronous)
    const prediction = await replicate.predictions.create({
      model: "google/nano-banana-2",
      input: { image: buffer, prompt: "Turn this into a crisp, clean coloring book page outline. Black and white only." },
    });

    // Poll for completion (max 10 seconds for this demo)
    let finalPrediction = prediction;
    for (let i = 0; i < 10; i++) {
        finalPrediction = await replicate.predictions.get(finalPrediction.id);
        if (finalPrediction.status === 'succeeded') break;
        if (finalPrediction.status === 'failed') throw new Error("Generation failed");
        await new Promise(r => setTimeout(r, 1000));
    }

    return NextResponse.json({ result: finalPrediction.output });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}