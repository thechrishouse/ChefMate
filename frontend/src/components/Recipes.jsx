import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../client';
import axiosInstance from '../axios-instance';

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth');
                return;
            }
            
            // Fetch recipes from backend
            try {
                const response = await axiosInstance.get('/recipes');
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
                // For now, set some dummy data if backend is not available
                setRecipes([
                    {
                        id: 1,
                        title: "Spaghetti Carbonara",
                        description: "Classic Italian pasta dish with eggs, cheese, and pancetta",
                        cookingTime: 20
                    },
                    {
                        id: 2,
                        title: "Chicken Stir Fry",
                        description: "Quick and healthy Asian-inspired dish",
                        cookingTime: 15
                    }
                ]);
            }
            setLoading(false);
        };

        checkAuth();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-green-600">CookMate</h1>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => navigate('/chat')}
                                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Chat
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Recipes</h2>
                    
                    {recipes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-4">
                                No recipes yet. Start building your cookbook!
                            </div>
                            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                                Add Your First Recipe
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recipes.map((recipe) => (
                                <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {recipe.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {recipe.description}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                {recipe.cookingTime} mins
                                            </span>
                                            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                                                View Recipe
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
