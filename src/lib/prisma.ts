import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

try {
  if (process.env.DATABASE_URL) {
    prisma = new PrismaClient();
    console.log("[DB] ✅ Prisma Client initialized");
  } else {
    console.warn("[DB] ⚠️ No DATABASE_URL found. Running in fallback mode.");
  }
} catch (err) {
  console.error("[DB] ❌ Failed to initialize Prisma Client, fallback enabled:", err);
  prisma = null;
}

// Only export named export, remove default export to avoid confusion
export { prisma };