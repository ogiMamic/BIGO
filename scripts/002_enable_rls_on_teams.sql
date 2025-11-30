-- Adding Row Level Security policies for the Team table
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own teams
CREATE POLICY "Allow users to view their own teams" ON "Team" 
  FOR SELECT USING (auth.uid()::text = "ownerId");

-- Allow users to create teams where they are the owner
CREATE POLICY "Allow users to create their own teams" ON "Team" 
  FOR INSERT WITH CHECK (auth.uid()::text = "ownerId");

-- Allow users to update their own teams
CREATE POLICY "Allow users to update their own teams" ON "Team" 
  FOR UPDATE USING (auth.uid()::text = "ownerId");

-- Allow users to delete their own teams
CREATE POLICY "Allow users to delete their own teams" ON "Team" 
  FOR DELETE USING (auth.uid()::text = "ownerId");
