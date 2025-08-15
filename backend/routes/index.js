/**
 * @file This file serves as the main entry point for all API routes.
 * @description It consolidates and organizes different route modules (e.g., auth, recipes, users)
 * under specific base paths, creating a single, cohesive API surface.
 * @module apiRouter
 */
import express from 'express';
import authRoutes from './auth.js';
import recipeRoutes from './recipes.js';
import userRoutes from './users.js';
import dashboardRoutes from './dashboard.js';

// Create a new Express router instance.
const router = express.Router();

// ==============================
// ROUTE REGISTRATION
// Mount different route modules under specific URL paths.
// ==============================

/**
 * Mounts the authentication routes.
 * All routes defined in `auth.js` will be prefixed with `/auth`.
 * @name use /api/auth
 * @function
 * @memberof module:apiRouter
 */
router.use('/auth', authRoutes);

/**
 * Mounts the recipe-related routes.
 * All routes defined in `recipes.js` will be prefixed with `/recipes`.
 * @name use /api/recipes
 * @function
 * @memberof module:apiRouter
 */
router.use('/recipes', recipeRoutes);

/**
 * Mounts the user-related routes.
 * All routes defined in `users.js` will be prefixed with `/users`.
 * @name use /api/users
 * @function
 * @memberof module:apiRouter
 */
router.use('/users', userRoutes);

/**
 * Mounts the dashboard routes at the root of the API (`/`).
 * This makes the dashboard endpoints directly accessible under `/api/`.
 * @name use /api/
 * @function
 * @memberof module:apiRouter
 */
router.use('/', dashboardRoutes); // dashboard routes at root level

export default router;
