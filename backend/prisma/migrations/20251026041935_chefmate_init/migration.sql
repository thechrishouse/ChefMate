/*
  Warnings:

  - A unique constraint covering the columns `[userId,recipeId]` on the table `SavedRecipe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CookedRecipe" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "CookedRecipe_userId_idx" ON "public"."CookedRecipe"("userId");

-- CreateIndex
CREATE INDEX "CookedRecipe_recipeId_idx" ON "public"."CookedRecipe"("recipeId");

-- CreateIndex
CREATE INDEX "Recipe_userId_idx" ON "public"."Recipe"("userId");

-- CreateIndex
CREATE INDEX "Recipe_isPublic_idx" ON "public"."Recipe"("isPublic");

-- CreateIndex
CREATE INDEX "Recipe_difficulty_idx" ON "public"."Recipe"("difficulty");

-- CreateIndex
CREATE INDEX "Recipe_createdAt_idx" ON "public"."Recipe"("createdAt");

-- CreateIndex
CREATE INDEX "SavedRecipe_userId_idx" ON "public"."SavedRecipe"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedRecipe_userId_recipeId_key" ON "public"."SavedRecipe"("userId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");
