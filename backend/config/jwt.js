/**
 * @file This file provides centralized utility functions for creating, signing, and verifying JSON Web Tokens (JWTs).
 * @description It handles the generation of both access and refresh tokens with specific expiration times and a consistent payload structure.
 * @module jwt
 */

import jwt from 'jsonwebtoken';

// ==============================
// ENVIRONMENT VARIABLES
// ==============================

// Load environment variables for JWT.
// These must be set in the `.env` file for the application to run.
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// A critical check to ensure the secret key is provided.
// The application cannot function securely without a secret, so it should exit immediately if missing.
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

// ==============================
// TOKEN GENERATION FUNCTIONS
// ==============================

/**
 * Generate a short-lived access token
 * @param {Object} payload - Data to embed in the token (e.g., userId, username, email)
 * @returns {string} Signed JWT string
 */
function generateAccessToken(payload) {
    // `jwt.sign()` creates a new token with the provided payload, secret, and options.
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'recipe-api',
        audience: 'recipe-app',
    });
}

/**
 * Generates a long-lived refresh token.
 * This token is used to obtain a new access token without requiring the user to re-authenticate.
 * The payload is kept minimal (typically just the user ID) to reduce security risks if the token is compromised.
 *
 * @param {object} payload - A minimal data payload, usually containing only the user ID.
 * @returns {string} The signed JWT string.
 */
function generateRefreshToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        issuer: 'recipe-api',
        audience: 'recipe-app',
    });
}

/**
 * Verifies a JWT's validity and decodes its payload.
 * It checks the signature, expiration date, issuer, and audience.
 *
 * @param {string} token - The JWT string from the request headers (e.g., "Bearer <token>").
 * @returns {object} The decoded token payload.
 * @throws {Error} Throws an error if the token is invalid (e.g., signature mismatch, expired, or malformed).
 */
function verifyToken(token) {
    try {
        // `jwt.verify()` checks the token's signature and expiration.
        return jwt.verify(token, JWT_SECRET, {
            issuer: 'recipe-api',
            audience: 'recipe-app',
        });
    } catch (error) {
        // Catch any errors from `jwt.verify` and throw a more generic, user-friendly error.
        throw new Error('Invalid or expired token');
    }
}

/**
 * Generates both a short-lived access token and a long-lived refresh token.
 * This is a convenience function to create the full token pair needed for a new user session.
 *
 * @param {object} user - The user object from the database, containing essential user information.
 * @returns {object} An object containing both the `accessToken` and `refreshToken`.
 */
function generateTokenPair(user) {
    // Create the detailed payload for the access token.
    const payload = {
        userId: user.id,
        username: user.username,
        email: user.email,
    };

    // Generate the two tokens. The refresh token uses a minimal payload.
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ userId: user.id });

    // Return the pair of tokens as a single object.
    return { accessToken, refreshToken };
}

export {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    generateTokenPair,
};
