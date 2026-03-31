import dotenv from "dotenv";
import { createApp } from "./app/createApp.js";
import { testDatabaseConnection } from "./shared/prisma/prisma.service.js";

dotenv.config();

async function connectDatabase(maxRetries = 5, retryDelayMs = 5000): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const connected = await testDatabaseConnection();
      if (connected) return true;

      console.error(
        `❌ Database connection attempt ${attempt} failed. Retrying in ${retryDelayMs / 1000}s...`
      );
    } catch (err) {
      console.error(`❌ Database connection attempt ${attempt} error:`, err);
    }

    await new Promise((res) => setTimeout(res, retryDelayMs));
  }

  console.error(`❌ Could not connect to database after ${maxRetries} attempts.`);
  return false;
}

function startServer(app: any, port = 3000): void {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`🌐 Allowed origin: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`\n[Server] ${signal} received, shutting down...`);
    server.close(() => {
      console.log("[Server] HTTP server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
}

async function bootstrap(): Promise<void> {
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  const dbConnected = await connectDatabase();
  if (!dbConnected) return;

  const app = createApp(); // ✅ tất cả middleware nằm trong đây

  startServer(app, PORT);
}

bootstrap();