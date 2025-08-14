/**
 * @file This file defines the API routes for user-related actions.
 * @description It provides endpoints to retrieve user statistics, supporting both authenticated requests for the current user and public requests for a specific user ID.
 * @module userRoutes
 */

import express from 'express';
import { getUserStats } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

// Create a new Express router instance.
const router = express.Router();

// ==============================
// USER STATS ROUTES
// ==============================

/**
 * Route to get statistics for the currently authenticated user.
 * The `authenticateToken` middleware ensures a valid token is provided and populates `req.userId`.
 * @name GET /api/users/stats
 * @function
 * @memberof module:userRoutes
 * @param {string} path - Express path
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} getUserStats - The controller function to handle fetching user statistics.
 */
router.get('/stats', authenticateToken, getUserStats);

/**
 * Route to get statistics for a specific user, identified by their ID in the URL.
 * It includes a small inline middleware to validate the `userId` parameter before calling the controller.
 * @name GET /api/users/:userId/stats
 * @function
 * @memberof module:userRoutes
 * @param {string} path - Express path with a dynamic userId parameter.
 * @param {Function} middleware - Inline middleware to validate and parse the userId.
 * @param {Function} getUserStats - The controller function to handle fetching user statistics.
 */
router.get(
    '/:userId/stats',
    async (req, res, next) => {
        try {
            // Parse the userId from the URL parameters to an integer.
            const userId = parseInt(req.params.userId);

            // Check if the parsed ID is not a number. If so, return a 400 Bad Request error.
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid user ID',
                });
            }

            // Attach the validated and parsed userId to the request object.
            // This makes it accessible to the `getUserStats` controller function.
            req.userId = userId;

            // Proceed to the next middleware or route handler (in this case, getUserStats).
            next();
        } catch (error) {
            // If an error occurs during parsing or validation, pass it to the global error handler.
            next(error);
        }
    },
    getUserStats,
);

export default router;
