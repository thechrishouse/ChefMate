/**
 * @file This file contains middleware functions for validating incoming request parameters.
 * @description These functions ensure that required IDs (e.g., userId, recipeId) are present and in the correct format before the request proceeds to the route handler.
 * @module validationMiddleware
 */

/**
 * Middleware to validate a `userId` from either query parameters or URL parameters.
 * It checks if the `userId` is present and if it is a valid number.
 * If validation passes, it parses the `userId` into an integer and attaches it to the request object.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
function validateUserId(req, res, next) {
    // Attempt to get the userId from either query parameters (e.g., /?userId=123)
    // or URL parameters (e.g., /users/123).
    const userId = req.query.userId || req.params.userId;

    // Check if the userId is missing entirely.
    if (!userId) {
        return res.status(400).json({
            success: false,
            error: 'userId is required'
        });
    }

    // Check if the userId is not a number. The `isNaN` function is used for this.
    if (isNaN(userId)) {
        return res.status(400).json({
            success: false,
            error: 'userId must be a valid number'
        });
    }

    // If validation passes, parse the userId string into an integer and attach it to the request object.
    // This ensures consistency and proper data type for subsequent operations (e.g., database queries).
    req.userId = parseInt(userId);

    // Proceed to the next middleware or route handler.
    next();
}

/**
 * Middleware to validate a `recipeId` from URL parameters.
 * It checks if the `recipeId` is present and if it is a valid number.
 * If validation passes, it parses the `recipeId` into an integer and attaches it to the request object.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
function validateRecipeId(req, res, next) {
    // Get the recipeId from the URL parameters (e.g., /recipes/123)
    const recipeId = req.params.id;

    // Combine checks for both a missing or non-numeric ID.
    if (!recipeId || isNaN(recipeId)) {
        return res.status(400).json({
            success: false,
            error: 'Valid recipe ID is required'
        });
    }

    // Parse the recipeId string into an integer and attach it to the request.
    req.recipeId = parseInt(recipeId);

    // Proceed to the next middleware or route handler.
    next();
}

export { validateUserId, validateRecipeId }