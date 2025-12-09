-- Add lastSeen and isOnline columns to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastSeen" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isOnline" BOOLEAN NOT NULL DEFAULT false;

-- Update existing users to set their lastSeen to their updatedAt timestamp
UPDATE "User" SET "lastSeen" = "updatedAt" WHERE "lastSeen" IS NULL;
