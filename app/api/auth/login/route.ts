import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // adjust to your actual path
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { comparePassword } from "@/lib/hash";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    console.log("Attempting login for:", email);

    // Look up user by email
    const userResult = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        position: users.position,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        password: users.password,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const user = userResult[0];

    // Compare password using bcrypt (handles both hashed and plain text passwords for backward compatibility)
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log("Login successful for:", userWithoutPassword.email);

    const cookieValue = encodeURIComponent(JSON.stringify(userWithoutPassword));

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Login successful",
    });

    response.cookies.set({
      name: 'user',
      value: cookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30 * 5, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
