-- CreateTable
CREATE TABLE "ServiceWaiver" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "signature" TEXT NOT NULL,
    "signedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "termsAccepted" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceWaiver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ServiceWaiver_email_idx" ON "ServiceWaiver"("email");

-- CreateIndex
CREATE INDEX "ServiceWaiver_signedAt_idx" ON "ServiceWaiver"("signedAt");

-- CreateIndex
CREATE INDEX "ServiceWaiver_isActive_idx" ON "ServiceWaiver"("isActive");
