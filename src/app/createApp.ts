import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { swaggerUi, specs } from "../shared/swagger/swagger.config.js";

export function createApp() {
    const app = express();

    // ✅ CORS config
    const allowedOrigins = [
        process.env.CLIENT_URL,       // production FE
        "http://localhost:5173",      // dev FE
    ].filter(Boolean);

    const corsOptions = {
        origin: (origin: any, callback: any) => {
            if (!origin) return callback(null, true); // Postman, curl
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    };

    // ✅ CORS phải đứng TRƯỚC routes
    app.use(cors(corsOptions));

    // ✅ Fix preflight (QUAN TRỌNG)
    app.options("*", cors(corsOptions));

    // ✅ Log request raw
    app.use((req, res, next) => {
        console.log(`[RAW] ${req.method} ${req.url}`);
        next();
    });

    // ✅ JSON parser (chỉ dùng 1 lần)
    app.use(express.json());

    // ✅ Debug body
    app.use((req, res, next) => {
        console.log(`[Express] ${req.method} ${req.path} - Body:`, JSON.stringify(req.body));
        next();
    });

    // ✅ Routes
    app.use("/api", routes);

    // Swagger (dev only)
    if (process.env.NODE_ENV !== "production") {
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    }

    // Root route
    app.get("/", (req, res) => {
        res.send("Hello, World!");
    });

    // Error handler
    app.use(errorHandler);

    return app;
}