/**
 * @file This file contains the global error handling middleware for the Express application.
 * @description It provides a centralized and structured way to handle all application errors,
 * logging them and sending standardized, user-friendly JSON responses based on the error type.
 * @module errorHandler
 */

import { errorResponse } from '../utils/responseHelpers.js';

/**
 * Express error handling middleware.
 * This function catches errors thrown by any route handler or middleware.
 * It identifies the error type and sends an appropriate HTTP status code and JSON response.
 *
 * @param {object} error - The error object passed from the previous middleware.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function (required by Express for error handlers, even if not used).
 * @returns {void}
 */
function errorHandler(error, req, res, next) {

    // Log the full error to the console for debugging purposes.
    // This provides a stack trace and is essential for developers to debug issues.
    console.error('Unhandled error:', error);

    // --- Handle Prisma-specific database errors ---
    // Prisma errors are identified by a unique error code (e.g., 'P2002').
    if (error.code) {
        switch (error.code) {
            // Prisma code 'P2002': Unique constraint failed.
            // This happens when you try to create a record that already exists with a unique value.
            // A 409 Conflict status code is the most appropriate response.
            case 'P2002':
                return res.status(409).json(errorResponse('Duplicate entry'));
            // Prisma code 'P2025': Record not found.
            // This occurs when a unique record (like by ID) is not found for an update or delete operation.
            // A 404 Not Found status code is the standard response for this situation.
            case 'P2025':
                return res.status(404).json(errorResponse('Record not found'));
            // Catch any other Prisma errors that aren't explicitly handled.
            // Send a generic 500 Internal Server Error with the specific error message for more detail.
            default:
                return res
                    .status(500)
                    .json(errorResponse('Database error', error.message));
        }
    }

    // --- Handle application-level validation errors ---
    // This checks for a custom error type, often thrown by a validation library (like Joi or Zod).
    // A 400 Bad Request status code indicates that the client sent an invalid request.
    if (error.name === 'ValidationError') {
        return res
            .status(400)
            .json(errorResponse('Validation error', error.message));
    }

    // --- Default error response ---
    // This is the catch-all for any other unhandled errors.
    // It's a safety net to ensure every error results in a standardized response.
    // A 500 Internal Server Error is used for unexpected server-side issues.
    res.status(500).json(errorResponse('Internal server error', error.message));
}

export { errorHandler };
