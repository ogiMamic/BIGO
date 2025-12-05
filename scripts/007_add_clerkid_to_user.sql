-- Add clerkId column to User table
-- This separates Clerk authentication ID from internal database ID

DO $$ 
BEGIN
    -- Check if clerkId column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'User' 
        AND column_name = 'clerkId'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "clerkId" TEXT UNIQUE;
        
        -- Copy existing id values to clerkId for existing users
        UPDATE "User" SET "clerkId" = id WHERE "clerkId" IS NULL;
        
        -- Make clerkId NOT NULL after migration
        ALTER TABLE "User" ALTER COLUMN "clerkId" SET NOT NULL;
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS "User_clerkId_idx" ON "User"("clerkId");
        
        RAISE NOTICE 'Successfully added clerkId column to User table';
    ELSE
        RAISE NOTICE 'clerkId column already exists in User table';
    END IF;
END $$;
