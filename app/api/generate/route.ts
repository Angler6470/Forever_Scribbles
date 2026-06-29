import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({ auth: 'r8_VvuFOdsJ0ODFqeWP7XeBRJ5zWlM4zMe2zqBRN'
 });

// Simple in-memory store for rate limiting (Note: This resets when Vercel restarts)
const requestCounts = new Map<string, { count: number; lastReset: number }>();

export async function POST(req: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: "API Token is missing in environment!" }, { status: 500 });
  }
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  const masterPassword = req.headers.get('x-master-password');

  // 1. Bypass check for Super Users
  if (masterPassword === process.env.MASTER_PASSWORD) {
    return runReplicate(req);
  }

  // 2. Simple Rate Limiting (3 uploads per hour)
  const now = Date.now();
  const userStat = requestCounts.get(ip) || { count: 0, lastReset: now };

  if (now - userStat.lastReset > 3600000) { // 1 hour
    userStat.count = 0;
    userStat.lastReset = now;
  }

  if (userStat.count >= 3) {
    return NextResponse.json({ error: "Limit reached. Please wait an hour." }, { status: 429 });
  }

  // Increment and save
  userStat.count++;
  requestCounts.set(ip, userStat);

  return runReplicate(req);
}

async function runReplicate(req: Request) {
  try {
    const { image } = await req.json();
    const output = await replicate.run(
      "google/nano-banana:5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa",
      { input: { image_input: image, prompt: "Convert this drawing to a clean black and white coloring page outline" } }
    );
    return NextResponse.json({ result: output });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}