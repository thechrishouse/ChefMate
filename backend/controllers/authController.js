/**
 * @file This file contains the controller functions for all authentication and user account operations.
 * @description It handles business logic for user registration, login, token management, and profile updates,
 * interacting with the database and JWT utilities.
 * @module authController
 */

import bcrypt from 'bcrypt';
import prisma from '../config/database.js'; // Fixed import
import { generateTokenPair, verifyToken } from '../config/jwt.js';
import { successResponse, errorResponse } from '../utils/responseHelpers.js';

// ==============================
// AUTHENTICATION FUNCTIONS
// ==============================

/**
 * Registers a new user account.
 * It performs input validation, checks for unique email/username, hashes the password, and issues an initial token pair.
 *
 * @async
 * @function register
 * @param {import('express').Request} req - The Express request object containing user data in `req.body`.
 * @param {import('express').Response} res - The Express response object.
 * @param {Function} next - The Express error handler function.
 * @returns {Promise<void>}
 */
async function register(req, res, next) {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        // Ensure all required fields are provided in the request body.
        if (!email || !password || !firstName || !lastName) {
            return res
                .status(400)
                .json(
                    errorResponse(
                        'Email, password, firstName, and lastName are required',
                    ),
                );
        }

        // Generate a username from the email if the user does not provide one.
        // It also converts it to lowercase and trims whitespace for consistency.
        const finalUsername =
            username?.trim().toLowerCase() || email.split('@')[0].toLowerCase();

        // Enforce a minimum password length for security.
        if (password.length < 6) {
            return res
                .status(400)
                .json(errorResponse('Password must be at least 6 characters'));
        }

        // Check if a user with the same email or username already exists in the database.
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email: email.toLowerCase() }, { username: finalUsername }],
            },
        });

        // If a user is found, respond with a 409 Conflict error.
        if (existingUser) {
            return res
                .status(409)
                .json(errorResponse('User with this email or username already exists'));
        }

        // Hash the user's password with a salt round of 12 before storing it in the database.
        // This is a critical security measure to protect user passwords.
        const passwordHash = await bcrypt.hash(password, 12);

        // Create the new user record in the database.
        // The `data` object contains the user's information, including the hashed password.
        // The `select` field ensures that the password hash is not returned in the response.
        const user = await prisma.user.create({
            data: {
                username: finalUsername,
                email: email.toLowerCase(),
                passwordHash,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
            },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
            },
        });

        // Generate a new access and refresh token pair for the newly registered user.
        const { accessToken, refreshToken } = generateTokenPair(user);

        // Send a 201 Created status code with the new user data and tokens.
        res.status(201).json(
            successResponse(
                {
                    user,
                    tokens: {
                        accessToken,
                        refreshToken,
                    },
                },
                'User registered successfully',
            ),
        );
    } catch (error) {
        // Pass any caught errors to the global error handler.
        next(error);
    }
}

/**
 * Logs in an existing user by verifying their password and issuing new tokens.
 * The user can log in using either their email or username.
 *
 * @async
 * @function login
 * @param {import('express').Request} req - The Express request object containing login credentials in `req.body`.
 * @param {import('express').Response} res - The Express response object.
 * @param {Function} next - The Express error handler function.
 * @returns {Promise<void>}
 */
async function login(req, res, next) {
    try {
        const { email, username, password } = req.body;
        const loginIdentifier = email || username;

        // Check for the presence of an email/username and a password.
        if (!loginIdentifier || !password) {
            return res
                .status(400)
                .json(errorResponse('Email/username and password are required'));
        }

        // Find the user in the database by either their email or username.
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: loginIdentifier.toLowerCase() },
                    { username: loginIdentifier.toLowerCase() },
                ],
            },
        });

        // If no user is found, respond with a 401 Unauthorized error.
        if (!user) {
            return res.status(401).json(errorResponse('Invalid credentials'));
        }

        // Compare the provided password with the hashed password stored in the database.
        // `bcrypt.compare()` safely handles the password verification.
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        // If the passwords do not match, respond with a 401 Unauthorized error.
        if (!isValidPassword) {
            return res.status(401).json(errorResponse('Invalid credentials'));
        }

        // Generate a new token pair for the user's session.
        const { accessToken, refreshToken } = generateTokenPair(user);

        // Use object destructuring to safely remove the password hash from the user object before sending the response.
        const { passwordHash, ...userWithoutPassword } = user;

        // Send a successful login response with the user data (without the password) and the new tokens.
        res.json(
            successResponse(
                {
                    user: userWithoutPassword,
                    tokens: {
                        accessToken,
                        refreshToken,
                    },
                },
                'Login successful',
            ),
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Issues a new access token using a valid refresh token.
 *
 * @async
 * @function refreshToken
 * @param {import('express').Request} req - The Express request object containing the refresh token in `req.body`.
 * @param {import('express').Response} res - The Express response object.
 * @param {Function} next - The Express error handler function.
 * @returns {Promise<void>}
 */
async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json(errorResponse('Refresh token is required'));
        }

        // Verify the refresh token's validity using the `verifyToken` helper.
        const decoded = verifyToken(refreshToken);

        // Find the user associated with the `userId` from the decoded token.
        // We select specific fields to avoid returning unnecessary or sensitive data.
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
            },
        });

        // If the user does not exist, the refresh token is invalid (e.g., user was deleted).
        if (!user) {
            return res.status(401).json(errorResponse('Invalid refresh token'));
        }

        // Generate a new token pair (a new access token and a new refresh token).
        const tokens = generateTokenPair(user);

        // Send the new tokens and user data back to the client.
        res.json(
            successResponse(
                {
                    user,
                    tokens,
                },
                'Token refreshed successfully',
            ),
        );
    } catch (error) {
        // If `verifyToken` throws an error (due to an invalid or expired token),
        // we catch it and send a 401 Unauthorized response.
        return res
            .status(401)
            .json(errorResponse('Invalid or expired refresh token'));
    }
}

/**
 * Logs out the authenticated user.
 * In a stateful token management system, this function would handle revoking the refresh token.
 * In this stateless implementation, the action is primarily to acknowledge the request.
 *
 * @async
 * @function logout
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {Function} next - The Express error handler function.
 * @returns {Promise<void>}
 */
async function logout(req, res, next) {
    try {
        // This is the `userId` from the authenticated access token.
        const userId = req.userId;

        // Optional: If you implement server-side token storage (e.g., in a database),
        // you would use this section to delete or blacklist the refresh token.
        // For example, if you add a `refreshToken` field to your User model:
        // await prisma.user.update({
        //     where: { id: userId },
        //     data: {
        //         refreshToken: null
        //     },
        // });

        // Send a success response. The client is responsible for discarding the tokens.
        res.json(successResponse(null, 'Logout successful'));
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves the profile information of the currently authenticated user.
 *
 * @async
 * @function getProfile
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {Function} next - The Express error handler function.
 * @returns {Promise<void>}
 */
async function getProfile(req, res, next) {
    try {
        // Get the `userId` from the request, which was attached by the `authenticateToken` middleware.
        const userId = req.userId;

        // Fetch the user from the database by their ID.
        // The `select` field explicitly lists the fields to return, preventing sensitive data from being exposed.
        // The `_count` field is a Prisma feature that efficiently returns the count of related records.
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        recipes: true,
                        savedRecipes: true,
                        cookedRecipes: true,
                    },
                },
            },
        });

        // If the user record is not found, it indicates an issue with the token or database.
        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        // Reformat the response object to be cleaner for the client.
        // The `...user` spreads the main user properties, and then we create a `stats` object
        // from the `_count` data before setting `_count` to undefined to remove it from the final response.
        res.json(
            successResponse({
                ...user,
                stats: {
                    recipesCreated: user._count.recipes,
                    recipesSaved: user._count.savedRecipes,
                    recipesCooked: user._count.cookedRecipes,
                },
                // Remove the internal `_count` field
                _count: undefined,
            }),
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Updates the authenticated user's profile information.
 * It handles updates to `firstName`, `lastName`, and `username`, with a check for username uniqueness.
 *
 * @async
 * @function updateProfile
 * @param {import('express').Request} req - The Express request object containing the updated profile data.
 * @param {import('express').Response} res - The Express response object.
 * @param {Function} next - The Express error handler function.
 * @returns {Promise<void>}
 */
async function updateProfile(req, res, next) {
    try {
        const userId = req.userId;
        const { firstName, lastName, username } = req.body;

        // Build a dynamic `updateData` object to only include fields that were provided in the request body.
        const updateData = {};
        if (firstName !== undefined) updateData.firstName = firstName.trim();
        if (lastName !== undefined) updateData.lastName = lastName.trim();
        if (username !== undefined) {
            // If the username is being updated, first check if the new username is already taken by another user.
            const existingUser = await prisma.user.findFirst({
                where: {
                    username: username.toLowerCase(),
                    NOT: { id: userId },
                },
            });

            if (existingUser) {
                return res.status(409).json(errorResponse('Username already taken'));
            }

            updateData.username = username.toLowerCase();
        }

        // If no fields are provided to update, we could add a check here to return early.
        // e.g. `if (Object.keys(updateData).length === 0) { ... }`

        // Update the user record in the database with the provided data.
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                updatedAt: true,
            },
        });

        // Send a success response with the updated user data.
        res.json(successResponse(updatedUser, 'Profile updated successfully'));
    } catch (error) {
        next(error);
    }
}

/**
 * Changes the authenticated user's password.
 * It requires the user to provide their current password for verification before updating to a new password.
 *
 * @async
 * @function changePassword
 * @param {import('express').Request} req - The Express request object containing password data.
 * @param {import('express').Response} res - The Express response object.
 * @param {Function} next - The Express error handler function.
 * @returns {Promise<void>}
 */
async function changePassword(req, res, next) {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;

        // Validate that both the current and new passwords have been provided.
        if (!currentPassword || !newPassword) {
            return res
                .status(400)
                .json(errorResponse('Current password and new password are required'));
        }

        // Enforce the minimum password length for the new password.
        if (newPassword.length < 6) {
            return res
                .status(400)
                .json(errorResponse('New password must be at least 6 characters'));
        }

        // Retrieve the full user record from the database, including the password hash for comparison.
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        // Compare the provided current password with the stored hash to verify the user's identity.
        const isValidPassword = await bcrypt.compare(
            currentPassword,
            user.passwordHash,
        );

        // If the current password is incorrect, deny the password change.
        if (!isValidPassword) {
            return res
                .status(401)
                .json(errorResponse('Current password is incorrect'));
        }

        // Hash the new password before storing it.
        const newPasswordHash = await bcrypt.hash(newPassword, 12);

        // Update the user's password hash in the database.
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });

        // Send a success response indicating the password has been changed.
        res.json(successResponse(null, 'Password changed successfully'));
    } catch (error) {
        next(error);
    }
}

export {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
    updateProfile,
    changePassword,
};
