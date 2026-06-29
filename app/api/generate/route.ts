import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) throw new Error('Replicate API token is not configured.');

    const replicate = new Replicate({ auth: token });
    const formData = await req.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'An image file is required.' }, { status: 400 });
    }

    // Convert file to buffer as required by nano-banana-2
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // EXACTLY matching Replicate's recommended structure:
    const output = await replicate.run("google/nano-banana-2", {
      input: {
        image: buffer,
        prompt: "A Black and white version of this image made into a coloring book page. Same line work. No color.",
      }
    });

    // Handle the output correctly based on Replicate's docs:
    // If output is an object with a URL() method, use it.
    let imageUrl: string;
    if (typeof output === 'object' && output !== null && 'url' in output) {
        imageUrl = (output as any).url();
    } else {
        imageUrl = String(output);
    }

    return NextResponse.json({ result: imageUrl });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Generation failed.' }, { status: 500 });
  }
}