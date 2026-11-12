import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // adjust to your actual path
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { id, name, email, position, lastNotificationReadAt, avatarUrl, githubUrl, linkedinUrl, notificationPreferences } = body;
    const user = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        position: users.position,
        avatarUrl: users.avatarUrl,
        githubUrl: users.githubUrl,
        linkedinUrl: users.linkedinUrl,
        lastNotificationReadAt: users.lastNotificationReadAt,
        notificationPreferences: users.notificationPreferences,
    }).from(users)
        .where(eq(users.id, id))
        .limit(1);

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const updatedUser = user[0];
    if (updatedUser.email !== email) {
        const existingUser = await db.select({
            id: users.id,
            email: users.email,
        })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        if (existingUser.length > 0) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }
    }
    if (name) {
        updatedUser.name = name;
    }
    if (email) {
        updatedUser.email = email;
    }
    if (position) {
        updatedUser.position = position;
    }
    if (avatarUrl) {
        updatedUser.avatarUrl = avatarUrl;
    }
    if (githubUrl) {
        updatedUser.githubUrl = githubUrl;
    }
    if (linkedinUrl) {
        updatedUser.linkedinUrl = linkedinUrl;
    }
    if (lastNotificationReadAt) {
        updatedUser.lastNotificationReadAt = new Date(lastNotificationReadAt);
    }
    if (notificationPreferences) {
        (updatedUser as any).notificationPreferences = notificationPreferences;
    }
    
    const userUpdate = await db.update(users)
        .set({
            name: updatedUser.name,
            email: updatedUser.email,
            position: updatedUser.position,
            avatarUrl: updatedUser.avatarUrl,
            githubUrl: updatedUser.githubUrl,
            linkedinUrl: updatedUser.linkedinUrl,
            lastNotificationReadAt: updatedUser.lastNotificationReadAt,
            notificationPreferences: (updatedUser as any).notificationPreferences || updatedUser.notificationPreferences,
        })
        .where(eq(users.id, id))
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            position: users.position,
            avatarUrl: users.avatarUrl,
            githubUrl: users.githubUrl,
            linkedinUrl: users.linkedinUrl,
            lastNotificationReadAt: users.lastNotificationReadAt,
            notificationPreferences: users.notificationPreferences,
        });
    if (userUpdate.length === 0) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
    return NextResponse.json({ user }, { status: 200 });

}
