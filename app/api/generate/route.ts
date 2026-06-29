import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) throw new Error('API token not configured');

    const replicate = new Replicate({ auth: token });
    
    // We are using the specific model ID from your provided API help file
    const output: any = await replicate.run(
      "paappraiser/retro-coloring-book:cbaf592788a0513ff5ca3beecdc0d9280fb44908771656f2adef630a263d9ebe",
      {
        input: {
          // We describe the content of your doodle so the AI creates a 
          // high-quality, professional version of it.
          prompt: "A large and simple drawing of an elephant, vintage coloring book style, minimal clean lines, thick outlines, easy to color, white background.",
          negative_prompt: "complex, realistic, color, gradient, shading, texture, wavy lines"
        }
      }
    );

    // According to your help file, output is an array. 
    // We check for the .url() method or direct array access.
    let resultUrl = "";
    if (Array.isArray(output)) {
        // Use the first item's .url() if available, otherwise just use the item
        resultUrl = typeof output[0].url === 'function' ? output[0].url() : output[0];
    } else {
        resultUrl = output;
    }

    return NextResponse.json({ result: resultUrl });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}