-- Create Organization table
CREATE TABLE IF NOT EXISTS "Organization" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Add organizationId to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

-- Add organizationId to Team table
ALTER TABLE "Team" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

-- Add organizationId to Story table
ALTER TABLE "Story" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

-- Add organizationId to Message table
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

-- Add organizationId to Storytelling table
ALTER TABLE "Storytelling" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

-- Add organizationId to DirectMessage table
ALTER TABLE "DirectMessage" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

-- Create a default organization for existing data
INSERT INTO "Organization" ("id", "name", "slug", "createdAt", "updatedAt")
VALUES ('default-org-id', 'Default Organization', 'default', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Update existing records to use default organization
UPDATE "User" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;
UPDATE "Team" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;
UPDATE "Story" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;
UPDATE "Message" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;
UPDATE "Storytelling" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;
UPDATE "DirectMessage" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;

-- Add foreign key constraints (after data migration)
ALTER TABLE "User" 
  ADD CONSTRAINT "User_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Team" 
  ADD CONSTRAINT "Team_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Story" 
  ADD CONSTRAINT "Story_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message" 
  ADD CONSTRAINT "Message_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Storytelling" 
  ADD CONSTRAINT "Storytelling_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DirectMessage" 
  ADD CONSTRAINT "DirectMessage_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Make organizationId NOT NULL after migration
ALTER TABLE "User" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Team" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Story" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Message" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Storytelling" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "DirectMessage" ALTER COLUMN "organizationId" SET NOT NULL;
