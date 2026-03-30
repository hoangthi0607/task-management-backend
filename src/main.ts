import dotenv from "dotenv";
import cors from "cors"; // ✅ import cors
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
        `❌ Database connection attempt ${attempt} failed. Retrying in ${RETRY_DELAY_MS / 1000
        }s...`
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
    process.exit(1); // chỉ exit nếu chắc chắn db không connect
  }

  const app = await createApp();

  // ✅ Thêm CORS middleware trực tiếp tại đây
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "*", // frontend domain hoặc "*" nếu muốn mở
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true, // nếu frontend gửi cookie
    })
  );

  // ✅ Xử lý preflight request cho tất cả route đúng chuẩn Express 5
  app.options(/(.*)/, cors());

  // ✅ Server always listens on Render-provided PORT
  const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
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