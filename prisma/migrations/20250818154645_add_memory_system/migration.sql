-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "importance" INTEGER NOT NULL DEFAULT 5,
    "emotionalValence" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "referenceCount" INTEGER NOT NULL DEFAULT 0,
    "lastReferenced" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Memory_userId_type_idx" ON "Memory"("userId", "type");

-- CreateIndex
CREATE INDEX "Memory_userId_isActive_idx" ON "Memory"("userId", "isActive");

-- CreateIndex
CREATE INDEX "Memory_userId_importance_idx" ON "Memory"("userId", "importance");

-- CreateIndex
CREATE INDEX "Memory_userId_lastReferenced_idx" ON "Memory"("userId", "lastReferenced");
