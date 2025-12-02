-- Add DirectMessage table for user-to-user messaging
CREATE TABLE IF NOT EXISTS "DirectMessage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "content" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "recipientId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "DirectMessage_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS "DirectMessage_senderId_recipientId_idx" ON "DirectMessage"("senderId", "recipientId");
CREATE INDEX IF NOT EXISTS "DirectMessage_recipientId_senderId_idx" ON "DirectMessage"("recipientId", "senderId");
