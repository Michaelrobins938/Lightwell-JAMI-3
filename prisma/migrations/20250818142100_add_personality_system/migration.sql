-- CreateTable
CREATE TABLE "PersonalityProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "therapeuticApproach" TEXT,
    "specialization" TEXT,
    "coreInstructions" TEXT NOT NULL,
    "safetyProtocols" TEXT NOT NULL,
    "therapeuticTechniques" TEXT,
    "boundarySettings" TEXT,
    "crisisIntervention" TEXT,
    "communicationStyle" TEXT,
    "responseLength" TEXT,
    "empathyLevel" TEXT,
    "directiveLevel" TEXT,
    "safetyChecks" TEXT,
    "crisisKeywords" TEXT,
    "escalationProtocols" TEXT,
    "disclaimers" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "lastReviewed" DATETIME,
    "complianceStatus" TEXT NOT NULL DEFAULT 'pending',
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PersonalityProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PersonalityUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "personalityId" TEXT NOT NULL,
    "sessionId" TEXT,
    "conversationId" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "duration" INTEGER,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "crisisDetected" BOOLEAN NOT NULL DEFAULT false,
    "escalationTriggered" BOOLEAN NOT NULL DEFAULT false,
    "userSatisfaction" INTEGER,
    "feedback" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PersonalityUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PersonalityUsage_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "PersonalityProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SystemPersonality" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "therapeuticApproach" TEXT,
    "specialization" TEXT,
    "coreInstructions" TEXT NOT NULL,
    "safetyProtocols" TEXT NOT NULL,
    "therapeuticTechniques" TEXT,
    "boundarySettings" TEXT,
    "crisisIntervention" TEXT,
    "communicationStyle" TEXT,
    "responseLength" TEXT,
    "empathyLevel" TEXT,
    "directiveLevel" TEXT,
    "safetyChecks" TEXT,
    "crisisKeywords" TEXT,
    "escalationProtocols" TEXT,
    "disclaimers" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "preferences" TEXT,
    "settings" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isExpert" BOOLEAN NOT NULL DEFAULT false,
    "isModerator" BOOLEAN NOT NULL DEFAULT false,
    "credentials" TEXT,
    "specialization" TEXT,
    "joinDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "activePersonalityId" TEXT,
    CONSTRAINT "User_activePersonalityId_fkey" FOREIGN KEY ("activePersonalityId") REFERENCES "PersonalityProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "credentials", "currentStreak", "email", "helpfulCount", "id", "image", "isExpert", "isModerator", "joinDate", "longestStreak", "name", "password", "postCount", "preferences", "resetToken", "resetTokenExpiry", "settings", "specialization", "updatedAt") SELECT "createdAt", "credentials", "currentStreak", "email", "helpfulCount", "id", "image", "isExpert", "isModerator", "joinDate", "longestStreak", "name", "password", "postCount", "preferences", "resetToken", "resetTokenExpiry", "settings", "specialization", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PersonalityProfile_userId_name_key" ON "PersonalityProfile"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SystemPersonality_name_key" ON "SystemPersonality"("name");
