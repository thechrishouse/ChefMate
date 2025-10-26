/**
 * @file This is the main entry point for the Express backend server.
 * @description It sets up the core server functionalities, including middleware, API routing, and error handling, and starts the server.
 * @module server
 */

import 'dotenv/config';  // // Load environment variables from .env for local development. This ensures JWT_SECRET and other vars are available when running server.js.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';
// import chatRouter from "./routes/chatbot.js"
// import verifyToken from "./middleware/auth.js";

// Load environment variables from .env file into process.env.
// This allows access to configuration variables like database connection strings and port numbers.
dotenv.config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 8080;


// ==============================
// MIDDLEWARE
// ==============================
// Middleware functions are executed in the order they are added.

// `express.json()`: Built-in middleware to parse incoming JSON payloads.
// It populates `req.body` with the parsed JSON data.

// `cors()`: Middleware to enable Cross-Origin Resource Sharing.
// It allows requests from different origins, which is essential for a frontend-backend split.


app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.RENDER_BACKEND_URL,
        process.env.RENDER_FRONTEND_URL,
    ],
    credentials: true,
}));


// ==============================
// API ROUTES
// ==============================

/**
 * Main API router.
 * All requests to paths starting with `/api` will be handled by the `routes` module.
 * @name use /api
 * @function
 * @memberof module:server
 */
app.use('/api', routes);
// app.use("/recipes", verifyToken, recipeRouter);
// app.use("/chat", chatRouter);



// ==============================
// ERROR HANDLING
// ==============================

// `errorHandler`: Custom middleware to handle all errors thrown during request processing.
// It should always be the last `app.use` call before the server starts listening.
app.use(errorHandler);

/**
 * Health check endpoint.
 * This endpoint is used by deployment environments to check if the server is running and responsive.
 * @name GET /health
 * @function
 * @memberof module:server
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} A JSON object indicating the server's status and timestamp.
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
    });
});

//// Message to confirm server is running in development AND production
app.get('/', (req, res) => {
    res.send('ChefMate backend is up and running!');
  });
  


// ==============================
// START SERVER
// ==============================

/**
 * Starts the server and listens for incoming requests on the specified port.
 * @listens PORT
 */
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`⛑️  Health check endpoint http://localhost:${PORT}/health`);
    // console.log(`🔌 API endpoint http://localhost:${PORT}/api`);
});

