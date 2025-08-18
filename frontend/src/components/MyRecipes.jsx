import { useEffect, useState } from 'react';
import RecipeGrid from './RecipeGrid';
import UserStats from './UserStats';
import { fetchRandomRecipes } from '../api/recipes';

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const fetched = await fetchRandomRecipes(6);
        setRecipes(fetched);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    getRecipes();
  }, []);

  return (
    <div className=''>
      <RecipeGrid key={recipes.idMeal} loading={loading} recipes={recipes} title="My Recipe Collections" subtitle="Manage and organize your saved recipes" />
    </div>
  );
}
