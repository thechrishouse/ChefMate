import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaYoutube, FaHeart, FaRegHeart, FaClock, FaUtensils, FaUserFriends } from "react-icons/fa";

export default function RecipePage() {
  // { id } represents tail end of url navigating to recipe's ID
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals && data.meals.length > 0) {
          setRecipe(data.meals[0]);
          console.log(data.meals[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!recipe) {
    return <p className="text-center mt-10">Loading recipe...</p>;
  }

  // Ingredients array
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ing) {
      ingredients.push(`${measure} ${ing}`.trim());
    }
  }

  // Generate short description for recipes the recipe submissions that lack a description (first 25 words of instructions)
  const shortDescription = recipe.strInstructions
    ? recipe.strInstructions.split(" ").slice(0, 25).join(" ") + "..."
    : "";

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Recipe Image */}
        <div className="md:w-1/2">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 space-y-6">
          <span className="px-4 py-0.5 rounded-full font-semibold bg-green-300/50">
            {recipe.strArea}
          </span>
          <h1 className="text-4xl my-5 font-bold">{recipe.strMeal}</h1>

          {/* Auto short description */}
          <p className="text-gray-600 text-lg">{shortDescription}</p>

          {/* Info row */}
          <div className="flex gap-6 text-gray-700 text-sm">
            <div className="flex items-center gap-2">
              <FaClock className="text-green-600" />
              <span>— mins</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUserFriends className="text-green-600" />
              <span>— servings</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUtensils className="text-green-600" />
              <span>{recipe.strCategory}</span>
            </div>
          </div>

          {/* Like & Share Buttons (will replace later w/ RecipeActions) */}
          <div className="flex justify-between gap-2 py-6">
            <button className="py-2 w-1/2 border-2 font-medium rounded-md border-gray-500/30 cursor-pointer">
              Like Recipe
            </button>
            <button className="py-2 w-1/2 border-2 font-medium rounded-md border-gray-500/30 cursor-pointer">
              Share Recipe
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients + Instructions side by side */}
      <div className="flex flex-col md:flex-row gap-8 mt-10">
        {/* Ingredients (narrower) */}
        <div className="md:w-1/3 p-5 font-medium border-2 border-gray-500/30 rounded-md text-gray-900">
          <h2 className="text-2xl text-gray-950 font-semibold">Ingredients</h2>
          <p className="font-medium mb-5">
            For optimal outcome, only use the finest ingredients (organic preferably)
          </p>
          <ul className="text-gray-500 font-semibold list-disc list-inside space-y-1">
            {ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>

        {/* Instructions (wider) */}
        <div className="md:w-2/3 p-5 font-medium border-2 border-gray-500/30 rounded-md text-gray-900">
          <h2 className="text-2xl font-semibold">Instructions</h2>
          <p className="font-medium mb-5">
            Follow these steps to create the perfect {recipe.strMeal}
          </p>
          <p className="text-gray-500 font-semibold leading-relaxed whitespace-pre-line">
            {recipe.strInstructions}
          </p>
        </div>
      </div>
    </section>

  );
}
