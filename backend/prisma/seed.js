import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';    

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create sample users
    const users = [];

    // Create user 1
    const user1 = await prisma.user.create({
        data: {
            username: 'chef_alice',
            email: 'alice@example.com',
            passwordHash: await bcrypt.hash('password123', 10),
            firstName: 'Alice',
            lastName: 'Johnson',
        },
    });
    users.push(user1);

    // Create user 2
    const user2 = await prisma.user.create({
        data: {
            username: 'cooking_bob',
            email: 'bob@example.com',
            passwordHash: await bcrypt.hash('password123', 10),
            firstName: 'Bob',
            lastName: 'Smith',
        },
    });
    users.push(user2);

    // Create user 3
    const user3 = await prisma.user.create({
        data: {
            username: 'foodie_carol',
            email: 'carol@example.com',
            passwordHash: await bcrypt.hash('password123', 10),
            firstName: 'Carol',
            lastName: 'Davis',
        },
    });
    users.push(user3);

    console.log(`✅ Created ${users.length} users`);

    // Create sample recipes
    const recipes = [];

    const recipe1 = await prisma.recipe.create({
        data: {
            title: 'Classic Spaghetti Carbonara',
            description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta',
            imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500',
            prepTime: 10,
            cookTime: 15,
            servings: 4,
            difficulty: 'MEDIUM',
            isPublic: true,
            userId: user1.id,
            ingredients: [
                { name: 'Spaghetti', amount: '400g', unit: 'grams' },
                { name: 'Pancetta', amount: '200g', unit: 'grams' },
                { name: 'Eggs', amount: '4', unit: 'large' },
                { name: 'Pecorino Romano cheese', amount: '100g', unit: 'grams' },
                { name: 'Black pepper', amount: '1', unit: 'tsp' },
                { name: 'Salt', amount: 'to taste', unit: '' }
            ],
            instructions: [
                { step: 1, text: 'Cook spaghetti in salted boiling water until al dente' },
                { step: 2, text: 'Meanwhile, cook pancetta in a large pan until crispy' },
                { step: 3, text: 'Whisk eggs with grated cheese and black pepper' },
                { step: 4, text: 'Drain pasta, reserving 1 cup pasta water' },
                { step: 5, text: 'Add hot pasta to pancetta pan, remove from heat' },
                { step: 6, text: 'Add egg mixture, tossing quickly. Add pasta water if needed' },
                { step: 7, text: 'Serve immediately with extra cheese and pepper' }
            ]
        },
    });
    recipes.push(recipe1);

    const recipe2 = await prisma.recipe.create({
        data: {
            title: 'Chocolate Chip Cookies',
            description: 'Soft and chewy homemade chocolate chip cookies',
            imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500',
            prepTime: 15,
            cookTime: 12,
            servings: 24,
            difficulty: 'EASY',
            isPublic: true,
            userId: user2.id,
            ingredients: [
                { name: 'All-purpose flour', amount: '2¼', unit: 'cups' },
                { name: 'Baking soda', amount: '1', unit: 'tsp' },
                { name: 'Salt', amount: '1', unit: 'tsp' },
                { name: 'Butter', amount: '1', unit: 'cup' },
                { name: 'Brown sugar', amount: '¾', unit: 'cup' },
                { name: 'White sugar', amount: '¼', unit: 'cup' },
                { name: 'Eggs', amount: '2', unit: 'large' },
                { name: 'Vanilla extract', amount: '2', unit: 'tsp' },
                { name: 'Chocolate chips', amount: '2', unit: 'cups' }
            ],
            instructions: [
                { step: 1, text: 'Preheat oven to 375°F (190°C)' },
                { step: 2, text: 'Mix flour, baking soda, and salt in a bowl' },
                { step: 3, text: 'Cream butter and sugars until fluffy' },
                { step: 4, text: 'Beat in eggs and vanilla' },
                { step: 5, text: 'Gradually add flour mixture' },
                { step: 6, text: 'Stir in chocolate chips' },
                { step: 7, text: 'Drop spoonfuls onto baking sheet' },
                { step: 8, text: 'Bake 9-11 minutes until golden brown' }
            ]
        },
    });
    recipes.push(recipe2);

    const recipe3 = await prisma.recipe.create({
        data: {
            title: 'Beef Wellington',
            description: 'An elegant beef tenderloin wrapped in puff pastry',
            imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500',
            prepTime: 45,
            cookTime: 30,
            servings: 6,
            difficulty: 'HARD',
            isPublic: true,
            userId: user1.id,
            ingredients: [
                { name: 'Beef tenderloin', amount: '2', unit: 'lbs' },
                { name: 'Puff pastry', amount: '1', unit: 'sheet' },
                { name: 'Mushrooms', amount: '1', unit: 'lb' },
                { name: 'Prosciutto', amount: '6', unit: 'slices' },
                { name: 'Dijon mustard', amount: '2', unit: 'tbsp' },
                { name: 'Egg yolk', amount: '1', unit: 'large' },
                { name: 'Olive oil', amount: '2', unit: 'tbsp' }
            ],
            instructions: [
                { step: 1, text: 'Sear beef tenderloin on all sides until browned' },
                { step: 2, text: 'Brush with Dijon mustard and let cool' },
                { step: 3, text: 'Sauté mushrooms until moisture evaporates' },
                { step: 4, text: 'Lay prosciutto on plastic wrap' },
                { step: 5, text: 'Spread mushroom mixture over prosciutto' },
                { step: 6, text: 'Wrap beef in prosciutto and mushrooms' },
                { step: 7, text: 'Wrap in puff pastry and brush with egg' },
                { step: 8, text: 'Bake at 400°F for 25-30 minutes' }
            ]
        },
    });
    recipes.push(recipe3);

    console.log(`✅ Created ${recipes.length} recipes`);

    // Create saved recipes (users saving each other's recipes)
    await prisma.savedRecipe.create({
        data: {
            userId: user2.id,
            recipeId: recipe1.id, // Bob saves Alice's Carbonara
        },
    });

    await prisma.savedRecipe.create({
        data: {
            userId: user3.id,
            recipeId: recipe2.id, // Carol saves Bob's Cookies
        },
    });

    await prisma.savedRecipe.create({
        data: {
            userId: user3.id,
            recipeId: recipe1.id, // Carol saves Alice's Carbonara
        },
    });

    console.log('✅ Created saved recipes');

    // Create cooked recipes with ratings
    await prisma.cookedRecipe.create({
        data: {
            userId: user2.id,
            recipeId: recipe1.id,
            rating: 5,
            cookedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
    });

    await prisma.cookedRecipe.create({
        data: {
            userId: user3.id,
            recipeId: recipe2.id,
            rating: 4,
            cookedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
    });

    await prisma.cookedRecipe.create({
        data: {
            userId: user1.id,
            recipeId: recipe2.id,
            rating: 5,
            cookedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
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