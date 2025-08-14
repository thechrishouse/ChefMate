import express from "express";

const router = express.Router();
import prisma from "../db/index.js";


router.get('/', async (req, res) => {
    // Gets all the recipes from the database
    const recipes = await prisma.Recipe.findMany();
    // Responds back to the client with json with a success status and the todos array
    res.status(200).json({
        success: true,
        recipes,
    });
});

router.get('/:recipeId', async (req, res) => {
    // Gets all the recipes from the database
    const recipeId = Number(req.params.recipeId);
    console.log(recipeId)

    try {
        // Use Prisma to delete the todo with the specified ID
        const recipe = await prisma.Recipe.findUnique({
            where: {
                id: recipeId, // Match the todo based on its unique ID
            },
        });

        // Respond with a success status and confirmation of the deletion
        res.status(200).json({
            success: true,
            recipe: recipe, // Return the deleted todo's ID for reference
        });
    } catch (e) {
        // Handle any errors that occur during the deletion process
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
});

router.post('/', async (req, res) => {
    // Destructure `name` and `description` from the request body
    const { title, description, ingredients, instructions, prepTime, cookTime } = req.body;
    try {
        // Use Prisma to create a new recipe entry in the database
        const recipe = await prisma.Recipe.create({
            data: {
                title,               // Set the title of the recipe from the request
                description,        // Set the description of the todo from the request
                ingredients,
                instructions,
                prepTime,
                cookTime,
                userId: req.user.sub, // Assign the user ID
            },
        });

        // Check if the new todo was created successfully
        if (recipe) {
            // Respond with a success status and include the ID of the newly created todo
            res.status(201).json({
                success: true,
                recipe_id: recipe.id,
            });
        } else {
            // Respond with a failure status if todo creation failed
            res.status(500).json({
                success: false,
                message: "Failed to create new recipe",
            });
        }
    } catch (e) {
        // Log the error for debugging purposes
        console.log(e);
        // Respond with a generic error message if something goes wrong
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
});

router.put('/:recipeId', async (req, res) => {
    // Extract the recipe ID from the URL params and convert to a number
    const recipeId = Number(req.params.recipeId);

    // Destructure fields from the request body
    const { title, description, ingredients, instructions, prepTime, cookTime } = req.body;

    try {
        // Update the recipe in the database
        const recipe = await prisma.Recipe.update({
            where: {
                id: recipeId,
                // userId: req.user.sub // Optional: ensure only the owner can update
            },
            data: {
                title,
                description,
                ingredients,
                instructions,
                prepTime,
                cookTime
            }
        });

        // If update successful, return updated recipe
        res.status(200).json({
            success: true,
            recipe
        });
    } catch (e) {
        console.error(e);

        // If the recipe doesn't exist, Prisma throws an error
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later"
        });
    }
});


router.delete("/:recipeId", async (req, res) => {
    // Extract the `todoId` from the route parameter and convert it to a number
    const recipeId = Number(req.params.recipeId);

    try {
        // Use Prisma to delete the todo with the specified ID
        await prisma.Recipe.delete({
            where: {
                id: recipeId, // Match the todo based on its unique ID
            },
        });

        // Respond with a success status and confirmation of the deletion
        res.status(200).json({
            success: true,
            recipe: recipeId, // Return the deleted todo's ID for reference
        });
    } catch (e) {
        // Handle any errors that occur during the deletion process
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
});



export default router;