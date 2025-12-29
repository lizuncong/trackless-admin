import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";

// 从环境变量获取数据库连接字符串
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL 环境变量未设置");
}

// 全局单例模式，避免在开发环境中创建多个 Prisma Client 实例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// PrismaMariaDb 可以直接接受连接字符串或 PoolConfig
const adapter = new PrismaMariaDb(connectionString);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma as PrismaClient;
