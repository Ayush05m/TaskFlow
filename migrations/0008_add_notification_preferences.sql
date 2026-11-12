-- Add notification_preferences column to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "notification_preferences" jsonb DEFAULT '{"emailNotifications": true, "taskAssigned": true, "taskUpdated": true, "taskCompleted": true}'::jsonb;
--> statement-breakpoint

