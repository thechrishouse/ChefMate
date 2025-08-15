import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data to ensure a fresh seed every time
    await prisma.cookedRecipe.deleteMany({});
    await prisma.savedRecipe.deleteMany({});
    await prisma.recipe.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('🗑️  Existing data cleared.');

    // =========================================================
    // 1. Create Sample Users
    // =========================================================
    console.log('✨ Creating sample users...');

    const passwordHash = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.create({
        data: {
            username: 'chef_alice',
            email: 'alice@example.com',
            passwordHash,
            firstName: 'Alice',
            lastName: 'Johnson',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: 'cooking_bob',
            email: 'bob@example.com',
            passwordHash,
            firstName: 'Bob',
            lastName: 'Smith',
        },
    });

    const user3 = await prisma.user.create({
        data: {
            username: 'foodie_carol',
            email: 'carol@example.com',
            passwordHash,
            firstName: 'Carol',
            lastName: 'Davis',
        },
    });

    // Create new users as requested
    const user4 = await prisma.user.create({
        data: {
            username: 'bryan',
            email: 'bryan@example.com',
            passwordHash,
            firstName: 'Bryan',
            lastName: 'Williams',
        },
    });

    const user5 = await prisma.user.create({
        data: {
            username: 'binu',
            email: 'binu@example.com',
            passwordHash,
            firstName: 'Binu',
            lastName: 'Patel',
        },
    });

    const user6 = await prisma.user.create({
        data: {
            username: 'chris',
            email: 'chris@example.com',
            passwordHash,
            firstName: 'Chris',
            lastName: 'Evans',
        },
    });

    const user7 = await prisma.user.create({
        data: {
            username: 'kiraah',
            email: 'kiraah@example.com',
            passwordHash,
            firstName: 'Kiraah',
            lastName: 'Singh',
        },
    });

    const allUsers = [user1, user2, user3, user4, user5, user6, user7];
    console.log(`✅ Created ${allUsers.length} users`);

    // =========================================================
    // 2. Create Sample Recipes
    // =========================================================
    console.log('✨ Creating sample recipes...');

    // Existing Recipes
    const recipes = [
        await prisma.recipe.create({
            data: {
                title: 'Classic Spaghetti Carbonara',
                description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta',
                imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500',
                prepTime: 10, cookTime: 15, servings: 4, difficulty: 'MEDIUM', isPublic: true,
                userId: user1.id,
                ingredients: [{ name: 'Spaghetti', amount: '400g' }, { name: 'Pancetta', amount: '200g' }, { name: 'Eggs', amount: '4' }],
                instructions: [{ step: 1, text: 'Cook spaghetti.' }, { step: 2, text: 'Fry pancetta.' }],
            },
        }),
        await prisma.recipe.create({
            data: {
                title: 'Chocolate Chip Cookies',
                description: 'Soft and chewy homemade chocolate chip cookies',
                imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500',
                prepTime: 15, cookTime: 12, servings: 24, difficulty: 'EASY', isPublic: true,
                userId: user2.id,
                ingredients: [{ name: 'Flour', amount: '2¼ cups' }, { name: 'Chocolate chips', amount: '2 cups' }],
                instructions: [{ step: 1, text: 'Mix dry ingredients.' }, { step: 2, text: 'Cream butter and sugar.' }],
            },
        }),
        await prisma.recipe.create({
            data: {
                title: 'Beef Wellington',
                description: 'An elegant beef tenderloin wrapped in puff pastry',
                imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500',
                prepTime: 45, cookTime: 30, servings: 6, difficulty: 'HARD', isPublic: true,
                userId: user1.id,
                ingredients: [{ name: 'Beef tenderloin', amount: '2 lbs' }, { name: 'Puff pastry', amount: '1 sheet' }],
                instructions: [{ step: 1, text: 'Sear beef.' }, { step: 2, text: 'Wrap in pastry and bake.' }],
            },
        }),
    ];

    // New recipes for the new users (5 recipes each)
    const newRecipes = [
        // Recipes for Bryan (user4)
        { title: 'Spicy Chicken Tacos', description: 'Quick and easy chicken tacos with a kick', prepTime: 20, cookTime: 10, servings: 2, difficulty: 'EASY', userId: user4.id, imageUrl: 'https://images.unsplash.com/photo-1552332386-da2425501300?w=500' },
        { title: 'Mushroom Risotto', description: 'Creamy Italian rice dish with mushrooms and parmesan', prepTime: 15, cookTime: 30, servings: 4, difficulty: 'MEDIUM', userId: user4.id, imageUrl: 'https://images.unsplash.com/photo-1594950462719-7561858a7413?w=500' },
        { title: 'Homemade Pizza', description: 'Classic pepperoni pizza made from scratch', prepTime: 20, cookTime: 15, servings: 4, difficulty: 'MEDIUM', userId: user4.id, imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc0208226?w=500' },
        { title: 'Lemon Herb Roasted Chicken', description: 'A flavorful whole chicken roasted to perfection', prepTime: 10, cookTime: 90, servings: 4, difficulty: 'MEDIUM', userId: user4.id, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500' },
        { title: 'Simple Tomato Soup', description: 'A comforting and easy-to-make tomato soup', prepTime: 5, cookTime: 25, servings: 2, difficulty: 'EASY', userId: user4.id, imageUrl: 'https://images.unsplash.com/photo-1543339321-c7d01869e574?w=500' },

        // Recipes for Binu (user5)
        { title: 'Dal Makhani', description: 'A creamy and rich lentil dish from Northern India', prepTime: 20, cookTime: 60, servings: 4, difficulty: 'MEDIUM', userId: user5.id, imageUrl: 'https://images.unsplash.com/photo-1628122108119-948967f62d47?w=500' },
        { title: 'Palak Paneer', description: 'Indian cottage cheese in a spinach gravy', prepTime: 15, cookTime: 30, servings: 4, difficulty: 'EASY', userId: user5.id, imageUrl: 'https://images.unsplash.com/photo-1668853400585-70335e360b0e?w=500' },
        { title: 'Chicken Tikka Masala', description: 'Marinated and grilled chicken in a creamy curry sauce', prepTime: 20, cookTime: 30, servings: 4, difficulty: 'MEDIUM', userId: user5.id, imageUrl: 'https://images.unsplash.com/photo-1626082928646-6b2c2b0c3f59?w=500' },
        { title: 'Aloo Gobi', description: 'A dry curry made with potatoes and cauliflower', prepTime: 10, cookTime: 25, servings: 4, difficulty: 'EASY', userId: user5.id, imageUrl: 'https://images.unsplash.com/photo-1610427389278-f404e4c935d2?w=500' },
        { title: 'Garlic Naan', description: 'Soft flatbread with garlic and cilantro', prepTime: 15, cookTime: 10, servings: 4, difficulty: 'EASY', userId: user5.id, imageUrl: 'https://images.unsplash.com/photo-1616490333333-e99e0573e047?w=500' },

        // Recipes for Chris (user6)
        { title: 'Sushi Rolls', description: 'Homemade California-style sushi rolls', prepTime: 30, cookTime: 0, servings: 2, difficulty: 'HARD', userId: user6.id, imageUrl: 'https://images.unsplash.com/photo-1563262606-d01d4a04e542?w=500' },
        { title: 'Thai Green Curry', description: 'A vibrant and aromatic Thai curry with chicken', prepTime: 20, cookTime: 20, servings: 4, difficulty: 'MEDIUM', userId: user6.id, imageUrl: 'https://images.unsplash.com/photo-1614749667756-31a89c4501a3?w=500' },
        { title: 'Tuna Poke Bowl', description: 'A fresh and healthy Hawaiian tuna bowl', prepTime: 15, cookTime: 0, servings: 2, difficulty: 'EASY', userId: user6.id, imageUrl: 'https://images.unsplash.com/photo-1507421160840-77a83d47c431?w=500' },
        { title: 'Pad Thai', description: 'Stir-fried rice noodles with shrimp and tofu', prepTime: 25, cookTime: 15, servings: 2, difficulty: 'MEDIUM', userId: user6.id, imageUrl: 'https://images.unsplash.com/photo-1596700055273-00e95c1a7d65?w=500' },
        { title: 'Summer Rolls', description: 'Fresh rice paper rolls with vegetables and dipping sauce', prepTime: 20, cookTime: 0, servings: 2, difficulty: 'EASY', userId: user6.id, imageUrl: 'https://images.unsplash.com/photo-1510629906660-f1c5c7d0d087?w=500' },

        // Recipes for Kiraah (user7)
        { title: 'Vegan Black Bean Burgers', description: 'Hearty and flavorful homemade vegan burgers', prepTime: 20, cookTime: 20, servings: 4, difficulty: 'MEDIUM', userId: user7.id, imageUrl: 'https://images.unsplash.com/photo-1600891823136-4d51a6693a7d?w=500' },
        { title: 'Lentil Soup', description: 'A warm and comforting plant-based soup', prepTime: 10, cookTime: 40, servings: 6, difficulty: 'EASY', userId: user7.id, imageUrl: 'https://images.unsplash.com/photo-1616719124445-667d4f9f60f6?w=500' },
        { title: 'Vegetable Lasagna', description: 'Layered pasta with roasted vegetables and cheese', prepTime: 30, cookTime: 45, servings: 8, difficulty: 'HARD', userId: user7.id, imageUrl: 'https://images.unsplash.com/photo-1603598585150-13d2f2d2b5f7?w=500' },
        { title: 'Quinoa Salad', description: 'A fresh salad with quinoa, vegetables, and a lemon vinaigrette', prepTime: 15, cookTime: 15, servings: 4, difficulty: 'EASY', userId: user7.id, imageUrl: 'https://images.unsplash.com/photo-1604505047814-7d5d7d740c08?w=500' },
        { title: 'Cauliflower Steaks', description: 'Thick cauliflower slices roasted with spices', prepTime: 10, cookTime: 25, servings: 2, difficulty: 'MEDIUM', userId: user7.id, imageUrl: 'https://images.unsplash.com/photo-1600293121516-01584c0a5b82?w=500' },
    ];

    // Use Promise.all to efficiently create all new recipes in parallel
    const createdNewRecipes = await Promise.all(newRecipes.map(recipeData => {
        // Add default ingredients and instructions if none are provided
        if (!recipeData.ingredients) {
            recipeData.ingredients = [{ name: 'Placeholder ingredient', amount: '1', unit: 'unit' }];
        }
        if (!recipeData.instructions) {
            recipeData.instructions = [{ step: 1, text: 'Placeholder instruction' }];
        }
        return prisma.recipe.create({ data: recipeData });
    }));

    // Add new recipes to the main recipes array
    recipes.push(...createdNewRecipes);
    console.log(`✅ Created ${recipes.length} recipes in total`);

    // =========================================================
    // 3. Create Saved and Cooked Recipes
    // =========================================================
    console.log('✨ Creating saved and cooked recipes...');

    // Existing saved recipes
    await prisma.savedRecipe.createMany({
        data: [
            { userId: user2.id, recipeId: recipes[0].id }, // Bob saves Alice's Carbonara
            { userId: user3.id, recipeId: recipes[1].id }, // Carol saves Bob's Cookies
            { userId: user3.id, recipeId: recipes[0].id }, // Carol saves Alice's Carbonara
        ]
    });

    // New saved recipes for the new users
    await prisma.savedRecipe.createMany({
        data: [
            { userId: user4.id, recipeId: recipes[1].id }, // Bryan saves Bob's Cookies
            { userId: user5.id, recipeId: recipes[3].id }, // Binu saves Bryan's Tacos
            { userId: user6.id, recipeId: recipes[4].id }, // Chris saves Bryan's Risotto
            { userId: user7.id, recipeId: recipes[10].id }, // Kiraah saves Binu's Aloo Gobi
        ]
    });

    console.log('✅ Created saved recipes');

    // Existing cooked recipes
    await prisma.cookedRecipe.createMany({
        data: [
            { userId: user2.id, recipeId: recipes[0].id, rating: 5, cookedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            { userId: user3.id, recipeId: recipes[1].id, rating: 4, cookedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
            { userId: user1.id, recipeId: recipes[1].id, rating: 5, cookedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        ]
    });

    // New cooked recipes with ratings for new users
    await prisma.cookedRecipe.createMany({
        data: [
            { userId: user4.id, recipeId: recipes[10].id, rating: 4, notes: 'Needed a bit more spice.', cookedAt: new Date() },
            { userId: user5.id, recipeId: recipes[12].id, rating: 5, notes: 'Perfect for a weeknight dinner.', cookedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { userId: user6.id, recipeId: recipes[2].id, rating: 3, notes: 'A bit difficult to get right.', cookedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        ]
    });

    console.log('✅ Created cooked recipes with ratings');

    console.log('🎉 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });