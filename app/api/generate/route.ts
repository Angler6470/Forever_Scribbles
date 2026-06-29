import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) throw new Error("REPLICATE_API_TOKEN is missing in Vercel!");

    const replicate = new Replicate({ auth: token });
    const body = await req.json();
    
    // Ensure we are using the most current model ID string
    const prediction = await replicate.run(
      "google/nano-banana:5c7d5dc68e3678589f816cc1005a3034d60e7f78198f6d62862d514a6021650d",
      { input: { image: body.image } }
    );

    return NextResponse.json({ result: prediction });
  } catch (error: any) {
    // This returns the exact error from Replicate/Node to your terminal
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}