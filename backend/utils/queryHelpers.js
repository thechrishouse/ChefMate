/**
 * @file This file contains helper functions to build query options for database operations.
 * @description The functions here are responsible for parsing HTTP request query parameters
 * into a structured format suitable for use with an ORM like Prisma for filtering, sorting, and pagination.
 * @module queryHelper
 */

import {
    VALID_SORT_FIELDS,
    VALID_SORT_ORDERS,
    DIFFICULTY_LEVELS,
} from '../constants/index.js';

/**
 * Builds a filter object for recipe queries based on request query parameters.
 * @param {object} query - The request query object (e.g., `req.query`).
 * @param {string} [query.search] - A search term to find in the recipe title or description.
 * @param {string} [query.difficulty] - The difficulty level to filter by (e.g., 'EASY', 'MEDIUM').
 * @param {string} [query.minServings] - The minimum number of servings.
 * @param {string} [query.maxServings] - The maximum number of servings.
 * @param {string} [query.maxPrepTime] - The maximum preparation time in minutes.
 * @param {string} [query.maxCookTime] - The maximum cooking time in minutes.
 * @returns {object} A Prisma-compatible filter object.
 */
function buildRecipeFilters(query) {
    // Destructure relevant query parameters from the request.
    const {
        search,
        difficulty,
        minServings,
        maxServings,
        maxPrepTime,
        maxCookTime,
    } = query;

    // Initialize an empty object to store the filter conditions.
    const filters = {};

    // --- Search filter ---
    // If a search term is provided, build a filter to check for the term in
    // the `title` or `description` fields.
    // `OR` is used to match either condition, and `mode: 'insensitive'` ensures
    // the search is case-insensitive.
    if (search) {
        filters.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    // --- Difficulty filter ---
    // If a difficulty level is provided, and it's one of the allowed values
    // defined in `DIFFICULTY_LEVELS`, add it to the filters.
    // The input is converted to uppercase for consistency with the database schema.
    if (difficulty && DIFFICULTY_LEVELS.includes(difficulty.toUpperCase())) {
        filters.difficulty = difficulty.toUpperCase();
    }

    // --- Servings filter ---
    // If either a minimum or maximum servings value is provided,
    // create a nested filter object for the `servings` field.
    if (minServings || maxServings) {
        filters.servings = {};
        // Use `gte` (greater than or equal) for minimum servings, after parsing to an integer.
        if (minServings && !isNaN(minServings))
            filters.servings.gte = parseInt(minServings);
        // Use `lte` (less than or equal) for maximum servings, after parsing to an integer.
        if (maxServings && !isNaN(maxServings))
            filters.servings.lte = parseInt(maxServings);
    }

    // --- Time filters ---
    // Filter for maximum preparation time.
    if (maxPrepTime && !isNaN(maxPrepTime)) {
        filters.prepTime = { lte: parseInt(maxPrepTime) };
    }

    // Filter for maximum cooking time.
    if (maxCookTime && !isNaN(maxCookTime)) {
        filters.cookTime = { lte: parseInt(maxCookTime) };
    }

    return filters;
}

/**
 * Builds a sort options object for Prisma based on provided field and order.
 * It uses default values if the provided options are invalid.
 * @param {string} sortBy - The field to sort by.
 * @param {string} [sortOrder='desc'] - The sort order, either 'asc' or 'desc'.
 * @returns {object} A Prisma-compatible sort object (e.g., `{ createdAt: 'desc' }`).
 */
function buildSortOptions(sortBy, sortOrder = 'desc') {
    // Validate the `sortBy` field against a predefined list of allowed fields.
    // If the field is invalid, default to sorting by `createdAt`.
    if (!VALID_SORT_FIELDS.includes(sortBy)) {
        sortBy = 'createdAt';
    }

    // Validate the `sortOrder` against allowed values ('asc' or 'desc').
    // If the order is invalid, default to descending ('desc').
    if (!VALID_SORT_ORDERS.includes(sortOrder.toLowerCase())) {
        sortOrder = 'desc';
    }

    // Return the sort options in the format required by Prisma.
    return { [sortBy]: sortOrder.toLowerCase() };
}

/**
 * Calculates pagination parameters (`skip`, `take`) and returns them with
 * validated page and limit numbers.
 * @param {string|number} [page=1] - The requested page number.
 * @param {string|number} [limit=12] - The number of items per page.
 * @returns {object} An object containing the pagination parameters: `pageNum`, `limitNum`, and `skip`.
 */
function buildPagination(page = 1, limit = 12) {
    // Validate and parse the page number, ensuring it is at least 1.
    const pageNum = Math.max(1, parseInt(page) || 1);
    // Validate and parse the limit, ensuring it is between 1 and 100.
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 12));
    // Calculate the number of records to skip to reach the desired page.
    const skip = (pageNum - 1) * limitNum;

    // Return the validated pagination parameters.
    return { pageNum, limitNum, skip };
}

export { buildRecipeFilters, buildSortOptions, buildPagination };
