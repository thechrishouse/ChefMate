import UserStats from './UserStats';

export default function RecipeGrid({ recipes, title, subtitle, loading = false }) {
  if (loading) {
    return (
      <section className="min-w-3xl">
        {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700"></div>
          <p className="mt-4 text-gray-700 text-lg">Loading recipes...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-3xl">
      {title && <h2 className="text-2xl text-gray-900 font-bold">{title}</h2>}
      {subtitle && <h4 className='mb-6'>{subtitle}</h4>}
      <UserStats />
      <div className='flex justify-end items-center my-3'>
        Sort by:
        <span className='px-3 mx-2 font-semibold rounded-full border-2 border-gray-300 cursor-pointer'>Recently Added</span>
        <span className='px-3 mx-2 font-semibold rounded-full border-2 border-gray-300 cursor-pointer'>All</span>
        <span className='px-3 mx-2 font-semibold rounded-full border-2 border-gray-300 cursor-pointer'>Favorites</span>
        <span className='px-3 mx-2 font-semibold rounded-full border-2 border-gray-300 cursor-pointer'>Recently Made</span>
        <span className='px-3 mx-2 font-semibold rounded-full border-2 border-gray-300 cursor-pointer'>Easy</span>
      </div>
      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.idMeal} 
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg cursor-pointer transition"
          >
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-md text-lg text-gray-900 font-medium mb-2">{recipe.strMeal}</h3>
              <div className='mb-4 flex justify-between'>
                <span>by: Chef Name</span>
                <span>{recipe.cookTime}45 min</span>
              </div>
              <span className='px-4 py-1 bg-green-300 rounded-full'>{recipe.strArea}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
