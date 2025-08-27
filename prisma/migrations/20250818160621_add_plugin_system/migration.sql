-- CreateTable
CREATE TABLE "Plugin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "author" TEXT,
    "icon" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "config" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PluginAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pluginId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'GET',
    "parameters" TEXT,
    "headers" TEXT,
    "authType" TEXT NOT NULL DEFAULT 'none',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PluginAction_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "Plugin" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PluginExecution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "parameters" TEXT,
    "result" TEXT,
    "error" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "duration" INTEGER,
    CONSTRAINT "PluginExecution_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "PluginAction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PluginExecution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PluginExecution_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatSession" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PluginUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pluginId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionId" TEXT,
    "count" INTEGER NOT NULL DEFAULT 1,
    "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PluginUsage_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "Plugin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PluginUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Plugin_name_key" ON "Plugin"("name");

-- CreateIndex
CREATE INDEX "Plugin_isEnabled_idx" ON "Plugin"("isEnabled");

-- CreateIndex
CREATE INDEX "Plugin_isSystem_idx" ON "Plugin"("isSystem");

-- CreateIndex
CREATE INDEX "PluginAction_isEnabled_idx" ON "PluginAction"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "PluginAction_pluginId_name_key" ON "PluginAction"("pluginId", "name");

-- CreateIndex
CREATE INDEX "PluginExecution_userId_idx" ON "PluginExecution"("userId");

-- CreateIndex
CREATE INDEX "PluginExecution_conversationId_idx" ON "PluginExecution"("conversationId");

-- CreateIndex
CREATE INDEX "PluginExecution_status_idx" ON "PluginExecution"("status");

-- CreateIndex
CREATE INDEX "PluginExecution_startedAt_idx" ON "PluginExecution"("startedAt");

-- CreateIndex
CREATE INDEX "PluginUsage_userId_idx" ON "PluginUsage"("userId");

-- CreateIndex
CREATE INDEX "PluginUsage_lastUsed_idx" ON "PluginUsage"("lastUsed");

-- CreateIndex
CREATE UNIQUE INDEX "PluginUsage_pluginId_userId_actionId_key" ON "PluginUsage"("pluginId", "userId", "actionId");
