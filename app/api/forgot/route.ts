import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, passwordResets } from "@/db/schema";
import { eq, desc, ilike } from "drizzle-orm";
import { genToken, hashToken } from "@/lib/hash";
import { sendResetEmail } from "@/lib/mail";

const TOKEN_EXPIRE_MINUTES = parseInt(process.env.RESET_TOKEN_EXPIRE_MINUTES || "60", 10);
const RESEND_COOLDOWN_SECONDS = parseInt(process.env.RESET_RESEND_COOLDOWN_SECONDS || "30", 10);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // find user - verify email is registered (case-insensitive check)
    const normalizedEmail = email.trim();
    console.log(`[/api/forgot] Checking if email is registered: ${normalizedEmail}`);
    
    const found = await db
      .select()
      .from(users)
      .where(ilike(users.email, normalizedEmail))
      .limit(1);
    
    console.log(`[/api/forgot] Database query result: ${found.length > 0 ? 'User found' : 'User not found'}`);
    
    if (found.length === 0) {
      // Email not registered - return error so frontend can display appropriate message
      console.log(`[/api/forgot] Password reset requested for unregistered email: ${normalizedEmail}`);
      return NextResponse.json({ error: "No account found with this email address" }, { status: 404 });
    }
    
    const user = found[0];
    console.log(`[/api/forgot] User found with ID: ${user.id}, email: ${user.email}, proceeding with password reset`);

    // cooldown check using latest reset row
    const recent = await db
      .select()
      .from(passwordResets)
      .where(eq(passwordResets.userId, user.id))
      .orderBy(desc(passwordResets.createdAt))
      .limit(1);

    const now = new Date();
    if (recent.length > 0) {
      const lastSent = recent[0].lastSentAt as Date | null;
      if (lastSent && (now.getTime() - lastSent.getTime()) / 1000 < RESEND_COOLDOWN_SECONDS) {
        return NextResponse.json({ ok: true, cooldown: true });
      }
    }

    // create token (raw for email), store hash
    const rawToken = genToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(now.getTime() + TOKEN_EXPIRE_MINUTES * 60 * 1000);

    await db.insert(passwordResets).values({
      userId: user.id,
      tokenHash,
      expiresAt,
      used: false,
      lastSentAt: now,
    });

    // send email — log errors but always return success to user
    try {
      await sendResetEmail(email, rawToken);
    } catch (err: any) {
      // Log error for debugging but don't expose to user
      console.error("[/api/forgot] sendResetEmail failed:", err?.message || err);
      // Still return success to prevent information leakage
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[/api/forgot] error:", err?.message || err);
    // Always return success even on internal errors
    return NextResponse.json({ ok: true });
  }
}
