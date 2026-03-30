import dotenv from "dotenv";
import { createApp } from "./app/createApp.js";
import { testDatabaseConnection } from "./shared/prisma/prisma.service.js";

// ✅ Load environment variables BEFORE importing modules that need them
dotenv.config();

async function bootstrap() {
  try {
    // ✅ Test database connection before starting server
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      console.error("❌ Failed to connect to database. Exiting...");
      process.exit(1);
    }

    const app = await createApp();
    const PORT = process.env.PORT || 3000;
    
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

    // ✅ Graceful shutdown for express server
    process.on("SIGINT", () => {
      console.log("\n[Server] Shutting down gracefully...");
      server.close(() => {
        console.log("[Server] HTTP server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Bootstrap error:", error);
    process.exit(1);
  }
}

bootstrap();