import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

/**
 * Prisma client singleton for InternFlow AI.
 *
 * Setup:
 *   1. Set DATABASE_URL in .env (PostgreSQL)
 *   2. npx prisma migrate deploy
 *   3. npx prisma generate
 *
 * @see backend/prisma/DATABASE_DESIGN.md
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/** Graceful shutdown helper for server.ts */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
