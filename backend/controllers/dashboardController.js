/**
 * @file This file contains the controller functions for the dashboard routes.
 * It handles fetching and processing recipe data and user statistics for the main dashboard and the user's personal recipe list.
 * @module dashboardController
 */

import prisma from '../config/database.js';
import {
    buildRecipeFilters,
    buildSortOptions,
    buildPagination,
} from '../utils/queryHelpers.js';
import {
    successResponse,
    errorResponse,
    paginationResponse,
} from '../utils/responseHelpers.js';

/**
 * Fetches key statistics for a user, including the count of recipes created, saved, and cooked.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} An object containing the counts of recipes created, saved, and cooked.
 */
async function getUserStats(userId) {
    // Use Promise.all to concurrently fetch counts for created, saved, and cooked recipes
    const [createdCount, savedCount, cookedCount] = await Promise.all([
        prisma.recipe.count({ where: { userId } }),
        prisma.savedRecipe.count({ where: { userId } }),
        prisma.cookedRecipe.count({ where: { userId } }),
    ]);

    return {
        recipesCreated: createdCount,
        recipesSaved: savedCount,
        recipesCooked: cookedCount,
    };
}

/**
 * Handles the request for the main dashboard, which displays public recipes with pagination,
 * filtering, and sorting, along with the user's personal stats.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 * @returns {void} Responds with a JSON object containing the dashboard data.
 */
async function getDashboard(req, res, next) {
    try {
        // Retrieve the user ID from the request object (assuming it's set by a previous middleware)
        const userId = req.userId;
        // Destructure and set default values for sorting and filter parameters from the query string
        const {
            sortBy = 'createdAt',
            sortOrder = 'desc',
            ...filterParams
        } = req.query;

        // Build the query filters, ensuring only public recipes are displayed on the main dashboard
        const filters = {
            ...buildRecipeFilters(filterParams),
            isPublic: true,
        };

        // Build sorting and pagination options from the query parameters
        const sortOptions = buildSortOptions(sortBy, sortOrder);
        const { pageNum, limitNum, skip } = buildPagination(
            req.query.page,
            req.query.limit,
        );

        // Use Promise.all to concurrently fetch recipes, total count, and user statistics
        const [recipes, totalCount, userStats] = await Promise.all([
            // Fetch a paginated list of recipes with related user and interaction data
            prisma.recipe.findMany({
                where: filters,
                orderBy: sortOptions,
                skip,
                take: limitNum,
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    // Check if the current user has saved this recipe
                    savedBy: {
                        where: { userId },
                        select: { id: true },
                    },
                    // Check if the current user has cooked this recipe and retrieve their rating
                    cookedBy: {
                        where: { userId },
                        select: { id: true, rating: true, cookedAt: true },
                    },
                    // Get the total counts of saves and cooks for each recipe
                    _count: {
                        select: { savedBy: true, cookedBy: true },
                    },
                },
            }),
            // Get the total count of recipes that match the filters
            prisma.recipe.count({ where: filters }),
            // Get the user's personal stats using the helper function
            getUserStats(userId),
        ]);

        // Transform the recipe data to a more user-friendly format
        const transformedRecipes = recipes.map((recipe) => ({
            ...recipe,
            // Add boolean flags to indicate if the user has saved or cooked the recipe
            isSavedByUser: recipe.savedBy.length > 0,
            isCookedByUser: recipe.cookedBy.length > 0,
            // Extract the user's rating and cooked date, if available
            userRating: recipe.cookedBy.length > 0 ? recipe.cookedBy[0].rating : null,
            userCookedAt:
                recipe.cookedBy.length > 0 ? recipe.cookedBy[0].cookedAt : null,
            // Use the counts from the Prisma query
            totalSaves: recipe._count.savedBy,
            totalCooked: recipe._count.cookedBy,
            // Remove the raw relational data from the final response to keep it clean
            savedBy: undefined,
            cookedBy: undefined,
            _count: undefined,
        }));

        // Format the response with pagination metadata
        const paginatedData = paginationResponse(
            transformedRecipes,
            totalCount,
            pageNum,
            limitNum,
        );

        // Send a successful JSON response with the paginated recipes, user stats, and filter info
        res.json(
            successResponse({
                ...paginatedData,
                userStats,
                filters: {
                    appliedFilters: filterParams,
                    sorting: { sortBy, sortOrder },
                },
            }),
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Handles the request for a user's personal recipe list, which includes recipes they have created.
 * It also supports pagination, filtering, and sorting.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 * @returns {void} Responds with a JSON object containing the user's recipes.
 */
async function getMyRecipes(req, res, next) {
    try {
        // Retrieve the user ID from the request object
        const userId = req.userId;
        // Destructure and set default values for sorting and filter parameters from the query string
        const {
            sortBy = 'createdAt',
            sortOrder = 'desc',
            ...filterParams
        } = req.query;

        // Build the query filters, filtering specifically for recipes created by the current user
        const filters = {
            ...buildRecipeFilters(filterParams),
            userId,
        };

        // Build sorting and pagination options from the query parameters
        const sortOptions = buildSortOptions(sortBy, sortOrder);
        const { pageNum, limitNum, skip } = buildPagination(
            req.query.page,
            req.query.limit,
        );

        // Use Promise.all to concurrently fetch the user's recipes, total count, and their stats
        const [recipes, totalCount, userStats] = await Promise.all([
            // Fetch a paginated list of the user's recipes with related interaction data
            prisma.recipe.findMany({
                where: filters,
                orderBy: sortOptions,
                skip,
                take: limitNum,
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    // Include all users who saved this recipe
                    savedBy: {
                        select: {
                            id: true,
                            user: { select: { username: true } },
                        },
                    },
                    // Include all users who cooked and rated this recipe
                    cookedBy: {
                        select: {
                            id: true,
                            rating: true,
                            cookedAt: true,
                            user: { select: { username: true } },
                        },
                    },
                    // Get the total counts of saves and cooks
                    _count: {
                        select: { savedBy: true, cookedBy: true },
                    },
                },
            }),
            // Get the total count of recipes that match the filters
            prisma.recipe.count({ where: filters }),
            // Get the user's personal stats
            getUserStats(userId),
        ]);

        // Transform the recipe data for the response
        const transformedRecipes = recipes.map((recipe) => ({
            ...recipe,
            totalSaves: recipe._count.savedBy,
            totalCooked: recipe._count.cookedBy,
            // Calculate the average rating from all 'cookedBy' entries
            averageRating:
                recipe.cookedBy.length > 0
                    ? (
                        recipe.cookedBy.reduce(
                            (sum, cook) => sum + (cook.rating || 0),
                            0,
                        ) / recipe.cookedBy.length
                    ).toFixed(1)
                    : null,
            recentActivity: {
                // Get the most recent save and cook activity
                lastSaved:
                    recipe.savedBy.length > 0
                        ? recipe.savedBy[recipe.savedBy.length - 1]
                        : null,
                lastCooked:
                    recipe.cookedBy.length > 0
                        ? recipe.cookedBy[recipe.cookedBy.length - 1]
                        : null,
            },
            // Remove the raw relational data from the final response
            _count: undefined,
        }));

        // Format the response with pagination metadata
        const paginatedData = paginationResponse(
            transformedRecipes,
            totalCount,
            pageNum,
            limitNum,
        );

        // Send a successful JSON response with the paginated recipes, user stats, and filter info
        res.json(
            successResponse({
                ...paginatedData,
                userStats,
                filters: {
                    appliedFilters: filterParams,
                    sorting: { sortBy, sortOrder },
                },
            }),
        );
    } catch (error) {
        // Pass any errors to the error handling middleware
        next(error);
    }
}

export { getDashboard, getMyRecipes };
