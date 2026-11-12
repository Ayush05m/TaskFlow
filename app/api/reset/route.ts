import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, passwordResets } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { hashToken, hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  try {
    const { token, email, password } = await req.json();
    if (!token || !email || !password) {
      return NextResponse.json({ error: "token, email and password are required" }, { status: 400 });
    }

    // find user
    const found = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (found.length === 0) {
      return NextResponse.json({ error: "Invalid token or email" }, { status: 400 });
    }
    const user = found[0];

    const tokenHash = hashToken(token);

    // find the matching token row (userId + tokenHash)
    const resets = await db
      .select()
      .from(passwordResets)
      .where(and(eq(passwordResets.userId, user.id), eq(passwordResets.tokenHash, tokenHash)))
      .limit(1);

    if (resets.length === 0) {
      return NextResponse.json({ error: "Invalid token or email" }, { status: 400 });
    }

    const resetRow = resets[0] as any;
    if (resetRow.used) {
      return NextResponse.json({ error: "Token already used" }, { status: 400 });
    }
    if (new Date(resetRow.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // hash new password and update user
    const newHash = await hashPassword(password);
    await db.update(users).set({ password: newHash, updatedAt: new Date() }).where(eq(users.id, user.id));

    // mark token used
    await db.update(passwordResets).set({ used: true }).where(eq(passwordResets.id, resetRow.id));

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[/api/reset] error:", err?.message || err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
