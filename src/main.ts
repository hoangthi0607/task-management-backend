import dotenv from "dotenv";
import cors from "cors";
import express from "express"; // cần để thêm express.json()
import { createApp } from "./app/createApp.js";
import { testDatabaseConnection } from "./shared/prisma/prisma.service.js";

// ✅ Load environment variables BEFORE anything else
dotenv.config();

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const MAX_DB_RETRIES = 5;
  const RETRY_DELAY_MS = 5000; // 5 giây giữa các lần thử

  let dbConnected = false;
  for (let attempt = 1; attempt <= MAX_DB_RETRIES; attempt++) {
    try {
      dbConnected = await testDatabaseConnection();
      if (dbConnected) break;
      console.error(
        `❌ Database connection attempt ${attempt} failed. Retrying in ${RETRY_DELAY_MS / 1000}s...`
      );
    } catch (err) {
      console.error(`❌ Database connection attempt ${attempt} error:`, err);
    }
    await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
  }

  if (!dbConnected) {
    console.error(
      `❌ Could not connect to database after ${MAX_DB_RETRIES} attempts. Exiting...`
    );
    process.exit(1);
  }

  const app = await createApp();

  // ✅ Thêm middleware parse JSON
  app.use(express.json());

  // ✅ Thêm CORS middleware chuẩn
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "*", // domain frontend dev hoặc deploy
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"], // bắt buộc cho preflight JSON
      credentials: true,
    })
  );

  // ✅ Xử lý preflight request cho tất cả route
  app.options(/.*/, cors());

  // ✅ Log request body để debug payload
  app.use((req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
      console.log(`[Request] ${req.method} ${req.url} - Body:`, req.body);
    }
    next();
  });

  // ✅ Server luôn listen trên PORT
  const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 CORS allowed for origin: ${process.env.CLIENT_URL || "*"}`);
  });

  // ✅ Graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n[Server] Shutting down gracefully...");
    server.close(() => {
      console.log("[Server] HTTP server closed");
      process.exit(0);
    });
  });

  process.on("SIGTERM", () => {
    console.log("\n[Server] SIGTERM received, shutting down...");
    server.close(() => process.exit(0));
  });
}

bootstrap();