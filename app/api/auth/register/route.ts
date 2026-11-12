import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // adjust import path based on your structure
import { users } from "@/db/schema"; // your drizzle users table
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  // Registration is temporarily disabled. Return 403 so clients cannot create new accounts.
  return NextResponse.json({ error: "Registrations are temporarily closed" }, { status: 403 })
  
  /*
  try {
    const body = await request.json();
    const { name, email, password, position } = body;
    // ... original implementation
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
  */
}
