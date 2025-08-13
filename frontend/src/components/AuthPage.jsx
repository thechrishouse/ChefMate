import { useState } from 'react';

import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoMdPerson } from "react-icons/io";
import { PiChefHatBold } from "react-icons/pi";



export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Helper function that toggles password icon in form
    const togglePasswordVisibility = () => {
        setShowPassword((visible) => !visible);
    };

    const toggleFormMode = (e) => {
        e.preventDefault(); //  this just prevent navigation from the <a> tag
        setIsLogin(!isLogin);
        setShowPassword(false); // reset password visibility on mode change
    };

    return (
        <section id="auth" className="w-full text-gray-800 flex bg-[#f8f6f3] min-h-screen">
            {/* The left column of our page */}
            <div className="w-[55%] min-w-[400px] px-8 py-20">
                <span className='rounded-full py-1 px-3 bg-amber-100 font-semibold'>Join the community</span>
                <h2 className="text-4xl mt-2 mb-10 font-semibold">
                    Welcome to <br /><span className="text-green-600">CookMate</span>
                </h2>
                <p className="mb-10">
                    Join thousands of home cooks sharing recipes, planning meals, and creating amazing culinary experiences together.
                </p>
                <ul className="space-y-5 mb-10 list-none">
                    <li>
                        <div className='flex justify-start align-center gap-3'>
                            <div className='flex justify-center items-center p-3 rounded-full bg-amber-100'>
                                <FaEnvelope className='m-auto text-gray-900/50 text-3xl' />
                            </div>
                            <div>
                                <b>Save and Organize Recipes</b>
                                <p>Build your personal cookbook with recipes you love</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className='flex justify-start align-center gap-3'>
                            <div className='flex justify-center items-center p-3 rounded-full bg-amber-100'>
                                <IoMdPerson className='m-auto text-gray-900/50 text-3xl' />
                            </div>
                            <div>
                                <b>Connect with other Chefs</b>
                                <p>Share recipes and discover new favorites from the community</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className='flex justify-start align-center gap-3'>
                            <div className='flex justify-center items-center p-3 rounded-full bg-amber-100'>
                                <PiChefHatBold className='m-auto text-gray-900/50 text-3xl' />
                            </div>
                            <div>
                                <b>Smart Meal Planning</b>
                                <p>Plan your meals and generate shopping lists automatically</p>
                            </div>
                        </div>
                    </li>
                </ul>
                {/* Dummy stats could be imported using  (API) */}
                <div className='flex justify-around'>
                    <div className='flex flex-col space-y-1'>
                        <b className='text-2xl text-green-600'>50K+</b>
                        <p>Recipes</p>
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <b className='text-2xl text-green-600'>50K+</b>
                        <p>Users</p>
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <b className='text-2xl text-green-600'>50K+</b>
                        <p>Rating</p>
                    </div>
                </div>
            </div>

            {/* The right column */}
            <div className="w-[45%] min-w-[300px] px-8 py-20 flex items-center justify-center">
                <form className="w-full max-w-md space-y-6 p-10 border-2 border-gray-800/30 rounded-sm text-center" autoComplete="on">
                    <div className='flex flex-col justify-center items-center text-center space-y-4'>
                        <div className="flex justify-center items-center p-5 w-20 h-20 rounded-full bg-amber-100 border border-gray-500/30">
                            <PiChefHatBold className="text-gray-900/50 text-3xl" />
                        </div>

                        <h3 className='font-semibold text-2xl'>
                            {isLogin ? 'Welcome Back!' : 'Join CookMate!'}
                        </h3>
                        <h4>
                            {isLogin
                                ? 'Sign in to continue your culinary journey'
                                : 'Create an account and start cooking'}
                        </h4>
                    </div>


                    {/* Email Input */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            autoComplete="email"
                            className="w-full pl-10 pr-3 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                        />
                    </div>

                    {/* Conditionally render username input only on signup */}
                    {!isLogin && (
                        <div className="relative">
                            <IoMdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                autoComplete="username"
                                className="w-full pl-10 pr-3 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                            />
                        </div>
                    )}

                    {/* Password Input */}
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            className="w-full pl-10 pr-10 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Remember Me Checkbox and Forgot Password (only on the login form) */}
                    {isLogin && (
                        <div className='flex justify-between items-center'>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="remember" autoComplete="remember-me" className="w-4 h-4" />
                                Remember me
                            </label>
                            <a href="/forgot-password" className="text-green-600 hover:underline cursor-pointer">
                                Forgot Password?
                            </a>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 hover:scale-[1.05] transition cursor-pointer"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>

                    <span>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <a href="#" onClick={toggleFormMode} className="text-green-600 hover:underline cursor-pointer">
                            {isLogin ? "Sign up" : "Log in"}
                        </a>
                    </span>
                </form>
            </div>
        </section>
    );
}
