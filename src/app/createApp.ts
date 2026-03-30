import express from 'express';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { swaggerUi, specs } from '../shared/swagger/swagger.config.js';

export function createApp() {
    const app = express();
    
    // Log BEFORE json parsing
    app.use((req, res, next) => {
        console.log(`[RAW] ${req.method} ${req.url}`);
        next();
    });
    
    app.use(express.json());
    
    // Debug middleware AFTER json parsing
    app.use((req, res, next) => {
        console.log(`[Express] ${req.method} ${req.path} - Body:`, JSON.stringify(req.body));
        next();
    });
    
    app.use("/api", routes);

    // Swagger documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    // Error handling middleware
    app.use(errorHandler);

    // Define your routes here
    app.get('/', (req, res) => {
        res.send('Hello, World!');
    });

    return app;
}