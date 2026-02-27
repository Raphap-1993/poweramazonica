import { PrismaClient } from "@prisma/client";

declare global {
  var prismaClientSingleton: PrismaClient | undefined;
}

const prisma =
  globalThis.prismaClientSingleton ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClientSingleton = prisma;
}

export { prisma };
