import { NextResponse } from "next/server";
import { sendResetEmail } from "@/lib/mail";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Provide ?email=you@domain" }, { status: 400 });
    }

    const testToken = "TEST_TOKEN_" + Date.now();
    try {
      const resp = await sendResetEmail(email, testToken);
      return NextResponse.json({ ok: true, resp });
    } catch (err: any) {
      console.error("[/api/test-send] sendResetEmail failed:", err?.message || err);
      return NextResponse.json({ error: err?.message || "send failed" }, { status: 500 });
    }
  } catch (err: any) {
    console.error("[/api/test-send] error:", err?.message || err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
