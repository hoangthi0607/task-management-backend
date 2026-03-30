// ✅ NOTE: dotenv.config() is called in main.ts BEFORE importing this module
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../../generated/prisma/client.js"

const connectionString = process.env.DATABASE_URL ?? "mysql://root:123456@localhost:3306/task-management"
const url = new URL(connectionString)

// ✅ FIXED: Configure connection pool properly
const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port),
    user: url.username,
    password: url.password,
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: 10,  // ✅ Maximum concurrent connections
})

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// ✅ FIX: Graceful shutdown - đảm bảo kết nối được đóng đúng cách
if (typeof process !== "undefined") {
  process.on("SIGINT", async () => {
    console.log("\n[Prisma] Disconnecting...")
    await prisma.$disconnect()
    process.exit(0)
  })

  process.on("SIGTERM", async () => {
    console.log("\n[Prisma] Disconnecting...")
    await prisma.$disconnect()
    process.exit(0)
  })
}

// ✅ Optional: Test connection khi server bắt đầu (NOT on import)
export async function testDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log("✅ Database connected successfully")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}