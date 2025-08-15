/**
 * @file This file contains the controller functions for user-related data.
 * @description It provides API endpoints to retrieve user statistics and recent activity, such as created, saved, and cooked recipes.
 * @module userController
 */

import prisma from '../config/database.js';
import { successResponse } from '../utils/responseHelpers.js';

/**
 * Retrieves an authenticated user's key statistics and recent activity.
 *
 * @param {object} req - The Express request object, which must contain the `userId`.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 * @returns {void} Responds with a JSON object containing the user's statistics and recent activity.
 */
async function getUserStats(req, res, next) {
    try {
        // User ID from the authentication middleware
        const userId = req.userId;

        // Use Promise.all to concurrently fetch all necessary data in two main groups:
        // 1. Basic counts (recipes created, saved, cooked).
        // 2. Recent activity lists (most recent 3 of each category).
        const [userStats, recentActivity] = await Promise.all([
            // This inner Promise.all gets the count for each category
            Promise.all([
                prisma.recipe.count({ where: { userId } }),
                prisma.savedRecipe.count({ where: { userId } }),
                prisma.cookedRecipe.count({ where: { userId } })
            ]).then(([created, saved, cooked]) => ({
                // Map the results to a clear object structure
                recipesCreated: created,
                recipesSaved: saved,
                recipesCooked: cooked
            })),

            // This inner Promise.all fetches the most recent 3 items for each activity type
            Promise.all([
                // Get recently created recipes
                prisma.recipe.findMany({
                    where: { userId },
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                    select: { id: true, title: true, createdAt: true }
                }),
                // Get recently created recipes// Get recently saved recipes
                prisma.savedRecipe.findMany({
                    where: { userId },
                    orderBy: { savedAt: 'desc' },
                    take: 3,
                    include: {
                        recipe: { select: { id: true, title: true } }
                    }
                }),
                // Get recently cooked recipes
                prisma.cookedRecipe.findMany({
                    where: { userId },
                    orderBy: { cookedAt: 'desc' },
                    take: 3,
                    include: {
                        recipe: { select: { id: true, title: true } }
                    }
                })
            ])
        ]);

        const [recentCreated, recentSaved, recentCooked] = recentActivity;

        // Combine the statistics and recent activity into a single, cohesive response object.
        res.json(successResponse({
            ...userStats,
            recentActivity: {
                recentlyCreated: recentCreated,
                recentlySaved: recentSaved,
                recentlyCooked: recentCooked
            }
        }));

    } catch (error) {
        next(error);
    }
}

export { getUserStats }