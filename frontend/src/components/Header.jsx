import { NavLink } from 'react-router-dom';
import { PiChefHat, PiChefHatBold } from "react-icons/pi";

export default function Header() {

    // Dynamically changes link styles bases on active/inactive states
    const linkClasses = "transition px-2 py-1 rounded-md";
    const activeClasses = "text-black font-semibold border-b-2 border-orange-500";


    return (
        <header id='header' className='z-50 sticky top-0 left-0 w-full flex justify-between items-center py-4 px-10 md:px-18 text-gray-900  backdrop-blur-md shadow-[0px_4px_16px_rgba(0,0,0,0.3)]'>
            <div>
                <NavLink to='/' className='flex justify-between items-center space-x-4 text-green-700'>
                    <PiChefHatBold size={52} className='cursor-pointer' />
                    <h1 className='font-bold text-2xl cursor-pointer'>CookMate</h1>
                </NavLink>
            </div>

            <nav>
                <ul className="flex font-medium space-x-4 items-center">
                    <li>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                isActive ? `${linkClasses} ${activeClasses}` : linkClasses
                            }
                        >
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                isActive ? `${linkClasses} ${activeClasses}` : linkClasses
                            }
                        >
                            Contact
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/auth"
                            className={({ isActive }) =>
                                isActive
                                    ? `${linkClasses} ${activeClasses} border px-6 py-2 rounded-md`
                                    : `${linkClasses} border px-6 py-2 rounded-md  bg-green-800 text-white`
                            }
                        >
                            Sign Up
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}