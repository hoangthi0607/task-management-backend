import express, { NextFunction } from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { swaggerUi, specs } from "../shared/swagger/swagger.config.js";

export function createApp() {
    const app = express();

    // ✅ CORS config
    const allowedOrigins = [
        process.env.CLIENT_URL,
        "http://localhost:5173",
        "http://localhost:3000"
    ].filter(Boolean);

    const corsOptions = {
        origin: (origin: any, callback: any) => {
            if (!origin) return callback(null, true); // Postman, curl
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
        },
        methods: ["GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    };

    // ✅ CORS phải đứng trước routes
    app.use(cors(corsOptions));

    // ❌ ĐÃ XÓA: app.options("*", cors(corsOptions));

    // ✅ Log request raw
    app.use((req, res, next) => {
        console.log(`[RAW] ${req.method} ${req.url}`);
        next();
    });

    // ✅ JSON parser
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
        // 1. Cấu hình interceptor để đổi dữ liệu khi bấm nút Execute gửi đi
        const swaggerOptions = {
            swaggerOptions: {
                requestInterceptor: (req: any) => {
                    if (req.body && typeof req.body === 'string' && req.body.includes('CURRENT_TIMESTAMP')) {
                        req.body = req.body.replace(/CURRENT_TIMESTAMP/g, new Date().toISOString());
                    }
                    return req;
                }
            }
        };

        // 2. Middleware chèn Script xử lý giao diện trực tiếp vào file HTML của Swagger UI
        app.use("/api-docs", (req: express.Request, res: express.Response, next: NextFunction) => {
            const originalSend = res.send;
            res.send = function (body: any) {
                if (typeof body === 'string' && body.includes('id="swagger-ui"')) {
                    // Script thuần JavaScript chạy trực tiếp 100% dưới trình duyệt
                    const customScript = `
                        <script>
                            window.addEventListener('load', () => {
                                const injectTime = () => {
                                    const textAreas = document.querySelectorAll('textarea.body-param__text');
                                    textAreas.forEach((area) => {
                                        if (area.value && area.value.includes('CURRENT_TIMESTAMP')) {
                                            area.value = area.value.replace(/CURRENT_TIMESTAMP/g, new Date().toISOString());
                                            area.dispatchEvent(new Event('input', { bubbles: true }));
                                        }
                                    });
                                };

                                // Quét liên tục mỗi 500ms để bắt mọi sự kiện Click, Cancel, Reset, Try it out
                                injectTime();
                                setInterval(injectTime, 500);
                            });
                        </script>
                    `;
                    body = body.replace('</body>', `${customScript}</body>`);
                }
                return originalSend.call(this, body);
            };
            next();
        }, swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
    }
    // Root route
    app.get("/", (req, res) => {
        res.send("Hello, World!");
    });

    // Error handler
    app.use(errorHandler);

    return app;
}