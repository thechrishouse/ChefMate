import { useState, useEffect } from 'react';
import { fetchRandomRecipes } from '../api/recipes';
import { RecipeGrid } from '../components';

export default function DashboardHome() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecipes = async () => {
      const fetched = await fetchRandomRecipes(6);
      setRecipes(fetched);
      setLoading(false);
    };
    getRecipes();
  }, []);

  return (
    <div>
      <RecipeGrid recipes={recipes} title='Discover New Recipes' loading={loading} />
    </div>
  );
}
