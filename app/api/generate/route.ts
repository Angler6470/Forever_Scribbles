import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

function normalizePrompt(prompt?: string | null) {
  return prompt?.trim() || 'Turn this into a crisp, clean coloring book page outline. Black and white only.';
}

function extractImageInput(image: unknown) {
  if (typeof image === 'string') {
    return image;
  }

  if (image instanceof Buffer) {
    return image;
  }

  if (image instanceof Uint8Array) {
    return Buffer.from(image);
  }

  return null;
}

function extractResultImage(result: unknown): string | null {
  if (typeof result === 'string') {
    return result;
  }

  if (Array.isArray(result)) {
    for (const item of result) {
      const nested = extractResultImage(item);
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  if (result && typeof result === 'object') {
    const candidate = (result as Record<string, unknown>).output
      ?? (result as Record<string, unknown>).url
      ?? (result as Record<string, unknown>).image
      ?? (result as Record<string, unknown>).result
      ?? (result as Record<string, unknown>).image_url;

    if (typeof candidate === 'string') {
      return candidate;
    }

    if (Array.isArray(candidate)) {
      return extractResultImage(candidate);
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
      return NextResponse.json({ error: 'Replicate API token is not configured.' }, { status: 500 });
    }

    const replicate = new Replicate({ auth: token });
    const contentType = req.headers.get('content-type') || '';
    let imageInput: unknown = null;
    let prompt = 'Turn this into a crisp, clean coloring book page outline. Black and white only.';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('image');
      const promptValue = formData.get('prompt');

      prompt = normalizePrompt(promptValue?.toString());

      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'An image file is required.' }, { status: 400 });
      }

      imageInput = Buffer.from(await file.arrayBuffer());
    } else {
      const body = await req.json().catch(() => null);
      const image = body?.image;
      prompt = normalizePrompt(body?.prompt);

      if (!image) {
        return NextResponse.json({ error: 'An image is required.' }, { status: 400 });
      }

      imageInput = image;
    }

    const image = extractImageInput(imageInput);

    if (!image) {
      return NextResponse.json({ error: 'The uploaded image could not be processed.' }, { status: 400 });
    }

    const output = await replicate.run('google/nano-banana-2', {
      input: {
        image,
        prompt,
      },
    });

    const resultImage = extractResultImage(output);

    if (!resultImage) {
      return NextResponse.json({ error: 'Replicate returned no usable image output.' }, { status: 500 });
    }

    return NextResponse.json({ result: resultImage });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Generation failed.' }, { status: 500 });
  }
}