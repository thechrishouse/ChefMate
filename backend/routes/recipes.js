import express from 'express';
import {
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
} from '../controllers/recipeController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateRecipeId } from '../middleware/validation.js';

// Create a new Express router instance.
const router = express.Router();

// ==============================
// PUBLIC ROUTES
// These endpoints are publicly accessible.
// `optionalAuth` is used to attach user context if a token is present,
// allowing for personalized responses (e.g., showing if a recipe is already saved).
// ==============================

/**
 * Route to get a list of all recipes.
 * @name GET /api/recipes
 * @function
 * @memberof module:recipeRoutes
 * @param {string} path - Express path
 * @param {Function} optionalAuth - Middleware to optionally authenticate the user.
 * @param {Function} getAllRecipes - The controller function to handle fetching all recipes.
 */
router.get('/', optionalAuth, getAllRecipes);

/**
 * Route to get a single recipe by its ID.
 * @name GET /api/recipes/:id
 * @function
 * @memberof module:recipeRoutes
 * @param {string} path - Express path with a dynamic ID parameter.
 * @param {Function} validateRecipeId - Middleware to ensure the recipe ID is a valid number.
 * @param {Function} optionalAuth - Middleware to optionally authenticate the user.
 * @param {Function} getRecipe - The controller function to handle fetching a single recipe.
 */
router.get('/:id', validateRecipeId, optionalAuth, getRecipe);

// ==============================
// PROTECTED ROUTES (CRUD)
// These endpoints require a valid access token to perform actions.
// `authenticateToken` middleware is used to enforce authentication.
// ==============================

/**
 * Route to create a new recipe.
 * @name POST /api/recipes
 * @function
 * @memberof module:recipeRoutes
 * @param {string} path - Express path
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} createRecipe - The controller function to handle recipe creation.
 */
router.post('/', authenticateToken, createRecipe);

/**
 * Route to update an existing recipe by its ID.
 * @name PUT /api/recipes/:id
 * @function
 * @memberof module:recipeRoutes
 * @param {string} path - Express path with a dynamic ID parameter.
 * @param {Function} validateRecipeId - Middleware to ensure the recipe ID is valid.
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} updateRecipe - The controller function to handle recipe updates.
 */
router.put('/:id', validateRecipeId, authenticateToken, updateRecipe);

/**
 * Route to delete a recipe by its ID.
 * @name DELETE /api/recipes/:id
 * @function
 * @memberof module:recipeRoutes
 * @param {string} path - Express path with a dynamic ID parameter.
 * @param {Function} validateRecipeId - Middleware to ensure the recipe ID is valid.
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} deleteRecipe - The controller function to handle recipe deletion.
 */
router.delete('/:id', validateRecipeId, authenticateToken, deleteRecipe);

// ==============================
// USER INTERACTION ROUTES
// These endpoints allow authenticated users to interact with recipes.
// `authenticateToken` is required for these actions.
// ==============================

/**
 * Route to save a recipe for the authenticated user.
 * @name POST /api/recipes/:id/save
 * @function
 * @memberof module:recipeRoutes
 * @param {string} path - Express path with a dynamic ID parameter.
 * @param {Function} validateRecipeId - Middleware to ensure the recipe ID is valid.
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} saveRecipe - The controller function to handle saving a recipe.
 */
router.post('/:id/save', validateRecipeId, authenticateToken, saveRecipe);

/**
 * Route to unsave a recipe for the authenticated user.
 * @name DELETE /api/recipes/:id/save
 * @function
 * @memberof module:recipeRoutes
 * @param {string} path - Express path with a dynamic ID parameter.
 * @param {Function} validateRecipeId - Middleware to ensure the recipe ID is valid.
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} unsaveRecipe - The controller function to handle unsaving a recipe.
 */
router.delete('/:id/save', validateRecipeId, authenticateToken, unsaveRecipe);


/**
 * Route to mark a recipe as cooked for the authenticated user.
 * @name POST /api/recipes/:id/cook
 * @function
 * @memberof module:recipeRoutes
 * @param {string} path - Express path with a dynamic ID parameter.
 * @param {Function} validateRecipeId - Middleware to ensure the recipe ID is valid.
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} cookRecipe - The controller function to handle marking a recipe as cooked.
 */
router.post('/:id/cook', validateRecipeId, authenticateToken, cookRecipe);

// ==============================
// USER RECIPE COLLECTIONS
// These endpoints retrieve lists of recipes interacted with by the user.
// ==============================

/**
 * Route to get a list of all recipes saved by the authenticated user.
 * @name GET /api/recipes/saved/list
 * @function
 * @memberof module:recipeRoutes
 * @param {string} path - Express path
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} getSavedRecipes - The controller function to fetch saved recipes.
 */
router.get('/saved/list', authenticateToken, getSavedRecipes);

/**
 * Route to get a list of all recipes cooked by the authenticated user.
 * @name GET /api/recipes/cooked/list
 * @function
 * @memberof module:recipeRoutes
 * @param {string} path - Express path
 * @param {Function} authenticateToken - Middleware to ensure the user is authenticated.
 * @param {Function} getCookedRecipes - The controller function to fetch cooked recipes.
 */
router.get('/cooked/list', authenticateToken, getCookedRecipes);

export default router;
