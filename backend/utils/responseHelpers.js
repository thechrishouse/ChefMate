/**
 * @file This file contains helper functions for creating standardized API response objects.
 * @description These utilities help maintain a consistent response format across the application for success, error, and paginated data.
 * @module responseHelpers
 */

/**
 * Creates a standardized success response object.
 * This function is used for successful API calls to wrap the data in a consistent format.
 *
 * @param {any} data - The primary data payload to be returned.
 * @param {string} [message='Success'] - A descriptive success message.
 * @returns {object} A success response object with `success: true`, a message, and the data payload.
 */
function successResponse(data, message = 'Success') {
    return {
        success: true,
        message,
        data
    };
}

/**
 * Creates a standardized error response object.
 * This function is used to handle and format errors in a consistent way.
 * It includes an optional `details` field that is only shown in development environments for security.
 *
 * @param {string} message - A user-friendly error message.
 * @param {any} [details=null] - Optional detailed error information (e.g., stack trace), visible only in development.
 * @returns {object} An error response object with `success: false` and an error message.
 */
function errorResponse(message, details = null) {
    const response = {
        success: false,
        error: message
    };

    // Attach detailed error information only if in a development environment.
    // This prevents sensitive information from being exposed in production.
    if (details && process.env.NODE_ENV === 'development') {
        response.details = details;
    }

    return response;
}

/**
 * Creates a standardized response object for paginated data.
 * This helper function structures the response to include the list of items
 * and metadata about the pagination state.
 *
 * @param {Array} items - The array of items for the current page.
 * @param {number} totalCount - The total number of items across all pages.
 * @param {number} page - The current page number.
 * @param {number} limit - The number of items per page.
 * @returns {object} A paginated response object including the items and pagination metadata.
 */
function paginationResponse(items, totalCount, page, limit) {
    // Calculate the total number of pages based on the total count and items per page.
    const totalPages = Math.ceil(totalCount / limit);

    return {
        items,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalCount,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    };
}

export { successResponse, errorResponse, paginationResponse }