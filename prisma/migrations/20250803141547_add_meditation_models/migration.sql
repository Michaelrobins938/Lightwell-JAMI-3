-- CreateTable
CREATE TABLE "MeditationCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MeditationInstructor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "credentials" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MeditationSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "audioUrl" TEXT NOT NULL,
    "averageRating" REAL NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "categoryId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    CONSTRAINT "MeditationSession_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MeditationCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MeditationSession_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "MeditationInstructor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MeditationSessionTag" (
    "sessionId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("sessionId", "tagId"),
    CONSTRAINT "MeditationSessionTag_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "MeditationSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MeditationSessionTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "MeditationTag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MeditationTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MeditationSessionPlay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    CONSTRAINT "MeditationSessionPlay_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "MeditationSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MeditationSessionPlay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MeditationProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "rating" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MeditationProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MeditationProgress_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "MeditationSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MeditationSessionRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MeditationSessionRating_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "MeditationSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MeditationSessionRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MeditationCategory_name_key" ON "MeditationCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MeditationTag_name_key" ON "MeditationTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MeditationProgress_userId_sessionId_key" ON "MeditationProgress"("userId", "sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "MeditationSessionRating_sessionId_userId_key" ON "MeditationSessionRating"("sessionId", "userId");
