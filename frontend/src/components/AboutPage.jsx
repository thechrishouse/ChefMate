import { MdPeople, MdCoffee } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

import { IoMdHeart } from "react-icons/io";
import { developers } from '../constants';


export default function AboutPage() {

    return (
        <section id="about" className="px-20 py-10 bg-cream">
            <div className="text-center">
                <span className='pr-4 pl-1 py-1 font-semibold bg-green-300 rounded-full'><span className='mx-2'><MdPeople className='inline' /><MdPeople className='inline' /></span>Meet the Team</span>
                <h2 className='text-7xl my-5 font-extrabold'>The Chefs Behind<span className='text-green-700 block'>ChefMate</span></h2>
                <p className='text-xl text-gray-600 font-medium'>We're a passionate team of developers who love both coding and cooking. <br />Our mission is to make recipe management delightful for home cooks everywhere.</p>
                <div className='mt-10 space-x-6 transition-all ease-in-out duration-200'>
                    <button className='font-semibold py-3 px-8 cursor-pointer rounded-sm text-gray-100 bg-green-600 shadow-md hover:scale-[1.01]'><span><IoMdHeart className="inline mr-4 " /></span>Join Our Team</button>
                    <button className='font-semibold py-3 px-8 cursor-pointer rounded-sm bg-gray-100 text-green-800 shadow-md hover:scale-[1.01]'><span><MdCoffee className="inline mr-4 " /></span>Buy Us A Coffee</button>
                </div>
            </div>
            <div className='my-30 text-center'>
                <h3 className='text-3xl font-bold mb-10'>Our Development Team</h3>
                <p className='text-lg text-gray-600 font-medium'>Each team member brings unique skills and perspectives to create the best recipe management experience</p>
            </div>
            <div className='flex justify-between items-center gap-2 px-10 w-full'>
                {developers.map((dev, dex) => {
                    return (
                        <div key={`developer-${dex}`} className='min-w-[230px] rounded-t-3xl shadow-[0px_-3px_10px_rgba(0,0,0,0.5)]'>
                            <img src={dev.image} alt="Profile picture" className='w-full h-60 object-cover rounded-t-3xl' />
                            <div className='w-full text-center py-4'>
                                <span className='text-lg font-semibold text-gray-700'>{dev.name}</span>
                                <div className='flex justify-evenly my-4'>
                                    <FaGithub src={dev.github} size={24} className='inline text-gray-800 cursor-pointer' />
                                    <SiGmail mailto={dev.email} size={24} className='inline text-gray-800 cursor-pointer' />
                                    <FaLinkedin src={dev.linkedin} size={24} className='inline text-gray-800 cursor-pointer' />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}