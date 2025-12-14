-- Create Organization table (separate from column additions)
CREATE TABLE "Organization" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create a default organization
INSERT INTO "Organization" ("id", "name", "slug", "createdAt", "updatedAt")
VALUES ('default-org-id', 'Default Organization', 'default', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Update existing records to use default organization
UPDATE "User" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;
UPDATE "Team" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;
UPDATE "Story" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;
UPDATE "Message" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;
UPDATE "Storytelling" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;
UPDATE "DirectMessage" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;

-- Add foreign key constraints
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
