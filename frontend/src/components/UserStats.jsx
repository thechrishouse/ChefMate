import { FaRegBookmark } from "react-icons/fa6";


export default function UserStats() {

    return (
        <div className='flex justify-between py-6'>
            <div className='flex text-lg w-[260px] justify-between items-center p-6 cursor-pointer rounded-lg bg-gray-100 border-2 border-gray-200'>
                <div>
                    <h6>Saved Recipes</h6>
                    <p className='text-green text-3xl font-semibold'>24</p>
                </div>
                <FaRegBookmark />
            </div>
            <div className='flex text-lg w-[260px] justify-between items-center p-6 cursor-pointer rounded-lg bg-gray-100 border-2 border-gray-200'>
                <div>
                    <h6>Created Recipes</h6>
                    <p className='text-green text-3xl font-semibold'>8</p>
                </div>
                <FaRegBookmark />
            </div>
            <div className='flex text-lg w-[260px] justify-between items-center p-6 cursor-pointer rounded-lg bg-gray-100 border-2 border-gray-200'>
                <div>
                    <h6>Meal Plans</h6>
                    <p className='text-green text-3xl font-semibold'>7</p>
                </div>
                <FaRegBookmark />
            </div>
            <div className='flex text-lg w-[260px] justify-between items-center p-6 cursor-pointer rounded-lg bg-gray-100 border-2 border-gray-200'>
                <div>
                    <h6>Total Chefs</h6>
                    <p className='text-green text-3xl font-semibold'>7</p>
                </div>
                <FaRegBookmark />
            </div>
        </div>
    )
}