/**
 * @file This file contains the controller functions for managing recipes.
 * It handles CRUD operations for recipes and user interactions like saving and marking as cooked.
 * @module recipeController
 */

import prisma from '../config/database.js';
import {
    successResponse,
    errorResponse,
    paginationResponse,
} from '../utils/responseHelpers.js';
import {
    buildRecipeFilters,
    buildSortOptions,
    buildPagination,
} from '../utils/queryHelpers.js';
import { DIFFICULTY_LEVELS } from '../constants/index.js';

/**
 * Retrieves a paginated list of all public recipes, with optional filtering and sorting.
 * If a user is authenticated, it also includes whether they have saved or cooked each recipe.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 * @returns {void} Responds with a JSON object containing the list of public recipes and pagination metadata.
 */
async function getAllRecipes(req, res, next) {
    try {
        // userId is optional as this endpoint can be accessed by unauthenticated users
        const userId = req.userId;
        // Destructure and set default values for sorting and filter parameters
        const {
            sortBy = 'createdAt',
            sortOrder = 'desc',
            ...filterParams
        } = req.query;

        // Build the query filters, ensuring only public recipes are fetched
        const filters = {
            ...buildRecipeFilters(filterParams),
            isPublic: true,
        };

        // Build sorting and pagination options
        const sortOptions = buildSortOptions(sortBy, sortOrder);
        const { pageNum, limitNum, skip } = buildPagination(
            req.query.page,
            req.query.limit,
        );

        // Fetch recipes and total count concurrently using Promise.all
        const [recipes, totalCount] = await Promise.all([
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
                    // Conditionally include savedBy data if a user is logged in
                    savedBy: userId
                        ? {
                            where: { userId },
                            select: { id: true },
                        }
                        : false,
                    // Conditionally include cookedBy data based on authentication state
                    cookedBy: userId
                        ? {
                            where: { userId },
                            select: { id: true, rating: true, cookedAt: true },
                        }
                        : {
                            // For public view without auth, just get ratings to calculate average
                            select: { rating: true },
                        },
                    _count: {
                        select: { savedBy: true, cookedBy: true },
                    },
                },
            }),
            prisma.recipe.count({ where: filters }),
        ]);

        // Transform the fetched recipes into the desired response format
        const transformedRecipes = recipes.map((recipe) => ({
            ...recipe,
            // Check if the recipe is saved by the user (only if authenticated)
            isSavedByUser: userId ? recipe.savedBy?.length > 0 : false,
            // Check if the recipe has been cooked by the user (only if authenticated)
            isCookedByUser: userId
                ? recipe.cookedBy?.some((cook) => cook.rating !== undefined)
                : false,
            // Get the user's specific rating and cooked date, if available
            userRating:
                userId && recipe.cookedBy?.length > 0
                    ? recipe.cookedBy[0].rating
                    : null,
            userCookedAt:
                userId && recipe.cookedBy?.length > 0
                    ? recipe.cookedBy[0].cookedAt
                    : null,
            totalSaves: recipe._count.savedBy,
            totalCooked: recipe._count.cookedBy,
            // Calculate the average rating from all cookedBy entries that have a rating
            averageRating:
                recipe.cookedBy.length > 0
                    ? (
                        recipe.cookedBy.reduce(
                            (sum, cook) => sum + (cook.rating || 0),
                            0,
                        ) / recipe.cookedBy.filter((cook) => cook.rating).length
                    ).toFixed(1)
                    : null,
            // Clean up the response by removing the raw relational data
            savedBy: undefined,
            cookedBy: undefined,
            _count: undefined,
        }));

        // Create a paginated response object
        const paginatedData = paginationResponse(
            transformedRecipes,
            totalCount,
            pageNum,
            limitNum,
        );

        // Send a success response with the paginated data
        res.json(successResponse(paginatedData));
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves a single recipe by its ID.
 * It also handles access control for private recipes and includes user-specific data if the user is authenticated.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 * @returns {void} Responds with a JSON object containing the recipe details.
 */
async function getRecipe(req, res, next) {
    try {
        const recipeId = req.recipeId;
        const userId = req.userId; // From optional auth middleware

        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                // Conditionally include savedBy data for the authenticated user
                savedBy: userId
                    ? {
                        where: { userId },
                        select: { id: true, savedAt: true },
                    }
                    : false,
                // Conditionally include cookedBy data for the authenticated user
                cookedBy: userId
                    ? {
                        where: { userId },
                        select: { id: true, rating: true, cookedAt: true, notes: true },
                    }
                    : {
                        select: { rating: true },
                    },
                _count: {
                    select: { savedBy: true, cookedBy: true },
                },
            },
        });

        if (!recipe) {
            return res.status(404).json(errorResponse('Recipe not found'));
        }

        // Check if the recipe is private and if the user has permission to view it
        if (!recipe.isPublic && (!userId || recipe.userId !== userId)) {
            return res
                .status(403)
                .json(errorResponse('Access denied to private recipe'));
        }

        // Transform the recipe data to be more client-friendly
        const transformedRecipe = {
            ...recipe,
            isSavedByUser: userId ? recipe.savedBy?.length > 0 : false,
            isCookedByUser: userId ? recipe.cookedBy?.length > 0 : false,
            userRating:
                userId && recipe.cookedBy?.length > 0
                    ? recipe.cookedBy[0].rating
                    : null,
            userCookedAt:
                userId && recipe.cookedBy?.length > 0
                    ? recipe.cookedBy[0].cookedAt
                    : null,
            userNotes:
                userId && recipe.cookedBy?.length > 0 ? recipe.cookedBy[0].notes : null,
            totalSaves: recipe._count.savedBy,
            totalCooked: recipe._count.cookedBy,
            averageRating:
                recipe.cookedBy.length > 0
                    ? (
                        recipe.cookedBy.reduce(
                            (sum, cook) => sum + (cook.rating || 0),
                            0,
                        ) / recipe.cookedBy.filter((cook) => cook.rating).length
                    ).toFixed(1)
                    : null,
            savedBy: undefined,
            cookedBy: undefined,
            _count: undefined,
        };

        res.json(successResponse(transformedRecipe));
    } catch (error) {
        next(error);
    }
}

/**
 * Creates a new recipe.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {function} next - The next middleware function.
 * @returns {void} Responds with a JSON object of the newly created recipe.
 */
async function createRecipe(req, res, next) {
    try {
        const userId = req.userId;
        const {
            title,
            description,
            imageUrl,
            prepTime,
            cookTime,
            servings,
            difficulty = 'EASY',
            isPublic = true,
            ingredients,
            instructions,
        } = req.body;

        // Perform basic validation on required fields and data types
        if (!title?.trim()) {
            return res.status(400).json(errorResponse('Recipe title is required'));
        }

        if (
            !ingredients ||
            !Array.isArray(ingredients) ||
            ingredients.length === 0
        ) {
            return res
                .status(400)
                .json(errorResponse('At least one ingredient is required'));
        }

        if (
            !instructions ||
            !Array.isArray(instructions) ||
            instructions.length === 0
        ) {
            return res
                .status(400)
                .json(errorResponse('At least one instruction is required'));
        }

        if (difficulty && !DIFFICULTY_LEVELS.includes(difficulty.toUpperCase())) {
            return res.status(400).json(errorResponse('Invalid difficulty level'));
        }

        // Validate numeric fields
        if (prepTime && (isNaN(prepTime) || prepTime < 0)) {
            return res
                .status(400)
                .json(errorResponse('Prep time must be a positive number'));
        }

        if (cookTime && (isNaN(cookTime) || cookTime < 0)) {
            return res
                .status(400)
                .json(errorResponse('Cook time must be a positive number'));
        }

        if (servings && (isNaN(servings) || servings < 1)) {
            return res
                .status(400)
                .json(errorResponse('Servings must be a positive number'));
        }

        // Create the new recipe in the database
        const recipe = await prisma.recipe.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                imageUrl: imageUrl?.trim() || null,
                prepTime: prepTime ? parseInt(prepTime) : null,
                cookTime: cookTime ? parseInt(cookTime) : null,
                servings: servings ? parseInt(servings) : null,
                difficulty: difficulty.toUpperCase(),
                isPublic: Boolean(isPublic),
                ingredients: ingredients,
                instructions: instructions,
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                _count: {
                    select: { savedBy: true, cookedBy: true },
                },
            },
        });

        // Respond with the newly created recipe and a 201 status code
        res.status(201).json(
            successResponse(
                {
                    ...recipe,
                    totalSaves: recipe._count.savedBy,
                    totalCooked: recipe._count.cookedBy,
                    _count: undefined,
                },
                'Recipe created successfully',
            ),
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Updates an existing recipe.
 * The user must be the owner of the recipe to update it.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 * @returns {void} Responds with a JSON object of the updated recipe.
 */
async function updateRecipe(req, res, next) {
    try {
        const recipeId = req.recipeId;
        const userId = req.userId;
        const updateData = req.body;

        // Check if recipe exists and user owns it
        const existingRecipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: { userId: true },
        });

        if (!existingRecipe) {
            return res.status(404).json(errorResponse('Recipe not found'));
        }

        if (existingRecipe.userId !== userId) {
            return res
                .status(403)
                .json(errorResponse('You can only update your own recipes'));
        }

        // Build update object
        const cleanUpdateData = {};

        if (updateData.title?.trim())
            cleanUpdateData.title = updateData.title.trim();
        if (updateData.description !== undefined)
            cleanUpdateData.description = updateData.description?.trim() || null;
        if (updateData.imageUrl !== undefined)
            cleanUpdateData.imageUrl = updateData.imageUrl?.trim() || null;
        if (updateData.prepTime !== undefined)
            cleanUpdateData.prepTime = updateData.prepTime
                ? parseInt(updateData.prepTime)
                : null;
        if (updateData.cookTime !== undefined)
            cleanUpdateData.cookTime = updateData.cookTime
                ? parseInt(updateData.cookTime)
                : null;
        if (updateData.servings !== undefined)
            cleanUpdateData.servings = updateData.servings
                ? parseInt(updateData.servings)
                : null;
        if (
            updateData.difficulty &&
            DIFFICULTY_LEVELS.includes(updateData.difficulty.toUpperCase())
        ) {
            cleanUpdateData.difficulty = updateData.difficulty.toUpperCase();
        }
        if (updateData.isPublic !== undefined)
            cleanUpdateData.isPublic = Boolean(updateData.isPublic);
        if (updateData.ingredients)
            cleanUpdateData.ingredients = updateData.ingredients;
        if (updateData.instructions)
            cleanUpdateData.instructions = updateData.instructions;

        const updatedRecipe = await prisma.recipe.update({
            where: { id: recipeId },
            data: cleanUpdateData,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                _count: {
                    select: { savedBy: true, cookedBy: true },
                },
            },
        });

        res.json(
            successResponse(
                {
                    ...updatedRecipe,
                    totalSaves: updatedRecipe._count.savedBy,
                    totalCooked: updatedRecipe._count.cookedBy,
                    _count: undefined,
                },
                'Recipe updated successfully',
            ),
        );
    } catch (error) {
        next(error);
    }
}

// Delete recipe
async function deleteRecipe(req, res, next) {
    try {
        const recipeId = req.recipeId;
        const userId = req.userId;

        // Check if recipe exists and user owns it
        const existingRecipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: { userId: true, title: true },
        });

        if (!existingRecipe) {
            return res.status(404).json(errorResponse('Recipe not found'));
        }

        if (existingRecipe.userId !== userId) {
            return res
                .status(403)
                .json(errorResponse('You can only delete your own recipes'));
        }

        await prisma.recipe.delete({
            where: { id: recipeId },
        });

        res.json(
            successResponse(
                null,
                `Recipe "${existingRecipe.title}" deleted successfully`,
            ),
        );
    } catch (error) {
        next(error);
    }
}

// Save recipe (bookmark)
async function saveRecipe(req, res, next) {
    try {
        const recipeId = req.recipeId;
        const userId = req.userId;

        // Check if recipe exists and is accessible
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: { id: true, isPublic: true, userId: true, title: true },
        });

        if (!recipe) {
            return res.status(404).json(errorResponse('Recipe not found'));
        }

        if (!recipe.isPublic && recipe.userId !== userId) {
            return res.status(403).json(errorResponse('Cannot save private recipe'));
        }

        // Check if already saved
        const existingSave = await prisma.savedRecipe.findFirst({
            where: { userId, recipeId },
        });

        if (existingSave) {
            return res.status(409).json(errorResponse('Recipe already saved'));
        }

        const savedRecipe = await prisma.savedRecipe.create({
            data: { userId, recipeId },
        });

        res
            .status(201)
            .json(
                successResponse(
                    { id: savedRecipe.id, savedAt: savedRecipe.savedAt },
                    `Recipe "${recipe.title}" saved successfully`,
                ),
            );
    } catch (error) {
        next(error);
    }
}

// Unsave recipe
async function unsaveRecipe(req, res, next) {
    try {
        const recipeId = req.recipeId;
        const userId = req.userId;

        const savedRecipe = await prisma.savedRecipe.findFirst({
            where: { userId, recipeId },
            include: { recipe: { select: { title: true } } },
        });

        if (!savedRecipe) {
            return res
                .status(404)
                .json(errorResponse('Recipe not found in saved recipes'));
        }

        await prisma.savedRecipe.delete({
            where: { id: savedRecipe.id },
        });

        res.json(
            successResponse(
                null,
                `Recipe "${savedRecipe.recipe.title}" removed from saved recipes`,
            ),
        );
    } catch (error) {
        next(error);
    }
}

// Mark recipe as cooked
async function cookRecipe(req, res, next) {
    try {
        const recipeId = req.recipeId;
        const userId = req.userId;
        const { rating, notes } = req.body;

        // Validate rating
        if (rating && (isNaN(rating) || rating < 1 || rating > 5)) {
            return res
                .status(400)
                .json(errorResponse('Rating must be between 1 and 5'));
        }

        // Check if recipe exists and is accessible
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: { id: true, isPublic: true, userId: true, title: true },
        });

        if (!recipe) {
            return res.status(404).json(errorResponse('Recipe not found'));
        }

        if (!recipe.isPublic && recipe.userId !== userId) {
            return res.status(403).json(errorResponse('Cannot cook private recipe'));
        }

        const cookedRecipe = await prisma.cookedRecipe.create({
            data: {
                userId,
                recipeId,
                rating: rating ? parseInt(rating) : null,
                notes: notes?.trim() || null,
            },
        });

        res.status(201).json(
            successResponse(
                {
                    id: cookedRecipe.id,
                    rating: cookedRecipe.rating,
                    notes: cookedRecipe.notes,
                    cookedAt: cookedRecipe.cookedAt,
                },
                `Recipe "${recipe.title}" marked as cooked`,
            ),
        );
    } catch (error) {
        next(error);
    }
}

// Get user's saved recipes
async function getSavedRecipes(req, res, next) {
    try {
        const userId = req.userId;
        const { pageNum, limitNum, skip } = buildPagination(
            req.query.page,
            req.query.limit,
        );

        const [savedRecipes, totalCount] = await Promise.all([
            prisma.savedRecipe.findMany({
                where: { userId },
                orderBy: { savedAt: 'desc' },
                skip,
                take: limitNum,
                include: {
                    recipe: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                            _count: {
                                select: { savedBy: true, cookedBy: true },
                            },
                        },
                    },
                },
            }),
            prisma.savedRecipe.count({ where: { userId } }),
        ]);

        const transformedRecipes = savedRecipes.map((saved) => ({
            ...saved.recipe,
            savedAt: saved.savedAt,
            totalSaves: saved.recipe._count.savedBy,
            totalCooked: saved.recipe._count.cookedBy,
            _count: undefined,
        }));

        const paginatedData = paginationResponse(
            transformedRecipes,
            totalCount,
            pageNum,
            limitNum,
        );
        res.json(successResponse(paginatedData));
    } catch (error) {
        next(error);
    }
}

// Get user's cooked recipes
async function getCookedRecipes(req, res, next) {
    try {
        const userId = req.userId;
        const { pageNum, limitNum, skip } = buildPagination(
            req.query.page,
            req.query.limit,
        );

        const [cookedRecipes, totalCount] = await Promise.all([
            prisma.cookedRecipe.findMany({
                where: { userId },
                orderBy: { cookedAt: 'desc' },
                skip,
                take: limitNum,
                include: {
                    recipe: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                            _count: {
                                select: { savedBy: true, cookedBy: true },
                            },
                        },
                    },
                },
            }),
            prisma.cookedRecipe.count({ where: { userId } }),
        ]);

        const transformedRecipes = cookedRecipes.map((cooked) => ({
            ...cooked.recipe,
            cookedAt: cooked.cookedAt,
            userRating: cooked.rating,
            userNotes: cooked.notes,
            totalSaves: cooked.recipe._count.savedBy,
            totalCooked: cooked.recipe._count.cookedBy,
            _count: undefined,
        }));

        const paginatedData = paginationResponse(
            transformedRecipes,
            totalCount,
            pageNum,
            limitNum,
        );
        res.json(successResponse(paginatedData));
    } catch (error) {
        next(error);
    }
}

export {
    getAllRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    saveRecipe,
    unsaveRecipe,
    cookRecipe,
    getSavedRecipes,
    getCookedRecipes,
};
