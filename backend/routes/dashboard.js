/**
 * @file This file defines the API routes for the user dashboard.
 * @description These routes are used to retrieve a user's dashboard data, such as a summary of their activity and a list of their recipes.
 * @module dashboardRoutes
 */

import express from 'express';
import {
    getDashboard,
    getMyRecipes,
} from '../controllers/dashboardController.js';
import { validateUserId } from '../middleware/validation.js';

// Create a new Express router instance
const router = express.Router();

// ==============================
// DASHBOARD ROUTES
// ==============================

/**
 * Route to get a summary of a user's dashboard data.
 * The `validateUserId` middleware ensures that a valid user ID is present in the request.
 * @name GET /api/dashboard
 * @function
 * @memberof module:dashboardRoutes
 * @param {string} path - Express path
 * @param {Function} validateUserId - Middleware to ensure a valid userId is provided.
 * @param {Function} getDashboard - The controller function to handle fetching dashboard data.
 */
router.get('/dashboard', validateUserId, getDashboard);

/**
 * Route to get a list of all recipes created by a specific user.
 * The `validateUserId` middleware ensures that a valid user ID is provided for the query.
 * @name GET /api/my-recipes
 * @function
 * @memberof module:dashboardRoutes
 * @param {string} path - Express path
 * @param {Function} validateUserId - Middleware to ensure a valid userId is provided.
 * @param {Function} getMyRecipes - The controller function to handle fetching the user's recipes.
 */
router.get('/my-recipes', validateUserId, getMyRecipes);

export default router;
