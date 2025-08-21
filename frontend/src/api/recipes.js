import axios from "axios";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const fetchRandomRecipes = async (number = 6) => {
  try {
    // TheMealDB returns 1 random recipe per request
    const requests = Array.from({ length: number }, () => axios.get(`${BASE_URL}/random.php`));

    const responses = await Promise.all(requests);

    // Extract just the meal object from each response along with the ingredients and measurements for each
    const recipes = responses.map((res) => {
      const meal = res.data.meals[0];
      return {
        ...meal,
        ingredients: formatIngredients(meal),
      };
    });
    

    console.log("Fetched recipes:", recipes); // <-- logs full array of recipe objects

    return recipes;
  } catch (error) {
    console.error("There was an error while fetching recipes:", error);
    return [];
  }
};

const formatIngredients = (recipe) => {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure });
    }
  }

  return ingredients;
};
