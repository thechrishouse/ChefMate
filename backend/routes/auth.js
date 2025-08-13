/**
 * @file This file defines the API routes for user authentication and profile management.
 * @description It includes public routes for registration, login, and token refreshing,
 * as well as protected routes that require a valid access token for user profile actions.
 * @module authRoutes
 */

import express from 'express';
import {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
    updateProfile,
    changePassword
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

// Create a new Express router instance.
const router = express.Router();

// ==============================
// PUBLIC ROUTES
// These endpoints do not require a valid access token.
// ==============================

/**
 * Route to register a new user.
 * @name POST /api/auth/register
 * @function
 * @memberof module:authRoutes
 * @param {string} path - Express path
 * @param {Function} register - The controller function to handle user registration.
 */
router.post('/register', register);

/**
 * Route to log in a user and issue new access and refresh tokens.
 * @name POST /api/auth/login
 * @function
 * @memberof module:authRoutes
 * @param {string} path - Express path
 * @param {Function} login - The controller function to handle user login.
 */
router.post('/login', login);

/**
 * Route to refresh an access token using a valid refresh token.
 * @name POST /api/auth/refresh
 * @function
 * @memberof module:authRoutes
 * @param {string} path - Express path
 * @param {Function} refreshToken - The controller function to handle token refreshing.
 */
router.post('/refresh', refreshToken);

// ==============================
// PROTECTED ROUTES
// These endpoints require the `authenticateToken` middleware to verify a valid access token.
// ==============================

/**
 * Route to log out a user.
 * It typically invalidates the refresh token on the server side.
 * @name POST /api/auth/logout
 * @function
 * @memberof module:authRoutes
 * @param {string} path - Express path
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} logout - The controller function to handle user logout.
 */
router.post('/logout', authenticateToken, logout);

/**
 * Route to get the authenticated user's profile information.
 * @name GET /api/auth/profile
 * @function
 * @memberof module:authRoutes
 * @param {string} path - Express path
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} getProfile - The controller function to retrieve the user's profile.
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * Route to update the authenticated user's profile information.
 * @name PUT /api/auth/profile
 * @function
 * @memberof module:authRoutes
 * @param {string} path - Express path
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} updateProfile - The controller function to handle profile updates.
 */
router.put('/profile', authenticateToken, updateProfile);

/**
 * Route to allow the authenticated user to change their password.
 * @name PUT /api/auth/change-password
 * @function
 * @memberof module:authRoutes
 * @param {string} path - Express path
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} changePassword - The controller function to handle password changes.
 */
router.put('/change-password', authenticateToken, changePassword);

export default router;