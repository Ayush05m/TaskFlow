import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mail";

// Simple in-memory rate limiter (per server instance)
// Limits by IP and by email to reduce abuse
const WINDOW_SECONDS = parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS || "3600", 10); // 1 hour
const MAX_REQUESTS = parseInt(process.env.CONTACT_RATE_LIMIT_MAX || "5", 10); // 5 per window

type Bucket = { count: number; windowStart: number };
const ipBuckets = new Map<string, Bucket>();
const emailBuckets = new Map<string, Bucket>();

function hitLimit(map: Map<string, Bucket>, key: string): boolean {
  const now = Date.now();
  const windowMs = WINDOW_SECONDS * 1000;
  const bucket = map.get(key);
  if (!bucket) {
    map.set(key, { count: 1, windowStart: now });
    return false;
  }
  if (now - bucket.windowStart > windowMs) {
    // reset window
    bucket.count = 1;
    bucket.windowStart = now;
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_REQUESTS;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, message } = body || {};

    if (!email || !message) {
      return NextResponse.json({ error: "Email and message are required" }, { status: 400 });
    }

    // Rate limit by IP and email
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "").split(",")[0].trim() || "unknown";
    if (hitLimit(ipBuckets, ip) || hitLimit(emailBuckets, String(email).toLowerCase())) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    await sendContactEmail(name || "", String(email), String(message));

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[/api/contact] error:", err?.message || err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

