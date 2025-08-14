// =============================
// This file defines and exports shared constants used across multiple controllers.
// It helps keep validation rules and defaults consistent throughout the API.
// =============================

// Allowed fields that clients can use for sorting recipe results.
// Prevents arbitrary DB queries on non-indexed fields, improving performance and security
const VALID_SORT_FIELDS = [
    'createdAt',    // When the recipe was created
    'title',        // Recipe title (alphabetical sort)
    'prepTime',     // Minutes required for preparation
    'cookTime',     // Minutes required for cooking
    'servings',     // Number of servings the recipe makes
    'difficulty',   // Difficulty level (EASY, MEDIUM, HARD)
];

// Accepted sort order directions for API queries.
const VALID_SORT_ORDERS = ['asc', 'desc'];

// Standardized difficulty levels for recipes.
const DIFFICULTY_LEVELS = ['EASY', 'MEDIUM', 'HARD'];

// Default pagination size for API responses.
const DEFAULT_PAGE_SIZE = 12;

// Maximum allowed pagination size to prevent overly large DB queries.
const MAX_PAGE_SIZE = 100;

export {
    VALID_SORT_FIELDS,
    VALID_SORT_ORDERS,
    DIFFICULTY_LEVELS,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
};
