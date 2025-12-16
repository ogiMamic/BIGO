-- Make organizationId columns nullable in all tables
ALTER TABLE "User" ALTER COLUMN "organizationId" DROP NOT NULL;
ALTER TABLE "Team" ALTER COLUMN "organizationId" DROP NOT NULL;
ALTER TABLE "Story" ALTER COLUMN "organizationId" DROP NOT NULL;
ALTER TABLE "Storytelling" ALTER COLUMN "organizationId" DROP NOT NULL;
ALTER TABLE "Message" ALTER COLUMN "organizationId" DROP NOT NULL;
ALTER TABLE "DirectMessage" ALTER COLUMN "organizationId" DROP NOT NULL;
