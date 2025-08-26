import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const handleExploreRecipes = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        } else {
            navigate("/auth"); // send them to login/signup page first
        }
    };

    const handleCreateRecipe = () => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard/add-recipe"); // user is logged in
        } else {
            navigate("/auth"); // not logged in, send to auth first
        }
    };
    return(
        <section id="home" className='bg-picnic-pattern z-0'>
            <div className='py-20 px-10 text-center z-10'>
                <span className='px-4 py-1 font-semibold bg-green-300 rounded-full'>Your personal cooking companion</span>
                <h2 className='text-7xl my-5 font-extrabold'>Discover, Cook & Share <span className='text-green-700 block'>Amazing Recipes</span></h2>
                <p>Build your personal cookbook, discover new flavors from around the world, and share your culinary creations with a community of food lovers</p>
                <div className='mt-10 space-x-6 transition-all ease-in-out duration-200'>
                    <button onClick={handleExploreRecipes} className='font-semibold py-3 px-10 cursor-pointer rounded-sm text-gray-100 bg-green-600 shadow-md hover:scale-[1.01]'>Explore Recipes</button>
                    <button onClick={handleCreateRecipe} className='font-semibold py-3 px-10 cursor-pointer rounded-sm bg-gray-100 text-green-800 shadow-md hover:scale-[1.01]'>Create Recipe</button>
                </div>
                <div className='mt-10 flex justify-around text-gray-800'>
                    <div className='flex flex-col space-y-1'>
                        <b className='text-2xl text-green-700'>50K+</b>
                        <p>Recipes</p>
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <b className='text-2xl text-green-700'>25K+</b>
                        <p>Home Cooks</p>
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <b className='text-2xl text-green-700'>100+</b>
                        <p>Cuisines</p>
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <b className='text-2xl text-green-700'>50K+</b>
                        <p>Rating</p>
                    </div>
                </div>
            </div>
        </section>
    )
}