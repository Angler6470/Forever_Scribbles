import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Replicate API token is not configured.' }, { status: 500 });
    }

    const replicate = new Replicate({ auth: token });
    const body = await req.json();
    
    // Ensure prompt and image exist
    const image = body.image;
    const prompt = body.prompt || 'Turn this into a crisp, clean coloring book page outline. Black and white only.';

    if (!image) {
      return NextResponse.json({ error: 'An image is required.' }, { status: 400 });
    }

    // Run the model
    const output = await replicate.run('google/nano-banana-2', {
      input: {
        image: image,
        prompt: prompt,
      },
    });

    console.log("Replicate Raw Output:", JSON.stringify(output));

    // For nano-banana-2, the output is typically an array of strings (URLs)
    let resultImage: string | null = null;
    
    if (Array.isArray(output) && output.length > 0) {
      resultImage = output[0];
    } else if (typeof output === 'string') {
      resultImage = output;
    }

    if (!resultImage) {
      return NextResponse.json({
        error: 'Replicate returned an empty result.',
        debug: output
      }, { status: 500 });
    }

    return NextResponse.json({ result: resultImage });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Generation failed.' }, { status: 500 });
  }
}