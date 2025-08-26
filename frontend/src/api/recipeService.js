import api from './axios-instance';



export const addRecipe = async (recipeData) => {
  return api.post('/api/recipes', recipeData); // Adjust the route if backend differs
};

export const getRecipes = async () => {
  return api.get('/api/recipes');
};

export const getRecipeById = async (id) => {
  return api.get(`/api/recipes/${id}`);
};

export const updateRecipe = async (id, recipeData) => {
  return api.put(`/api/recipes/${id}`, recipeData);
};

export const deleteRecipe = async (id) => {
  return api.delete(`/api/recipes/${id}`);
};
