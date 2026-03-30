
import dotenv from "dotenv";
import cors from "cors";
import express, { Express, Request, Response, NextFunction } from "express";
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

function setupMiddleware(app: Express): void {
  app.use(express.json());

  const allowedOrigins = [
    process.env.CLIENT_URL,  // production
    "http://localhost:5173", // frontend dev
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow cURL, Postman
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  // Preflight handler
  app.options(/.*/, cors());

  // Debug body
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === "POST" || req.method === "PUT") {
      console.log(`[Request] ${req.method} ${req.url} - Body:`, req.body);
    }
    next();
  });
}

function startServer(app: Express, port = 3000): void {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`🌐 CORS allowed for origin: ${process.env.CLIENT_URL || "*"}`);
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

  const app: Express = await createApp();

  setupMiddleware(app);

  startServer(app, PORT);
}

bootstrap();