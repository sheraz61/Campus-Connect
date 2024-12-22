import React from 'react'
import { useNavigate } from 'react-router-dom'

function Post({ title, discription, paperImg, owner, _id, semester }) {
    const navigate = useNavigate()

    return (
        <div 
            className="relative border border-black max-w-[350px] max-h-[600px] flex flex-col items-center p-4 m-4 hover:cursor-pointer rounded-md hover:bg-opacity-75"
            onClick={() => navigate(`/papers/${_id}`)}
        >
            {/* Paper Image */}
            <img
                className="rounded-md border border-black object-fit w-full h-[300px] transition-opacity duration-300 ease-in-out"
                src={paperImg}
                alt="paperImg"
            />

            {/* Post Content (Title, Description, Owner Profile) */}
            <div className="absolute inset-0 flex flex-col justify-between items-center gap-4 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out bg-black bg-opacity-50 rounded-md p-4">
                {/* Title, Semester, and Description */}
                <div className="w-full p-1 text-white">
                    <h3 className="font-bold text-xl line-clamp-1">{title}</h3>
                    {semester && (<h1 className='font-bold text-md'>Semester: {semester}</h1>)}
                    <p className="text-sm line-clamp-2">{discription}</p>
                </div>

                {/* Owner Profile */}
                {(owner.profileImage && owner.fullName) && (
                    <div className="flex w-full items-center gap-2 p-1 mt-4">
                        <div className='w-8 h-8'>
                            <img
                                className="w-full h-full object-cover rounded-full border border-black"
                                src={owner.profileImage}
                                alt="Owner"
                            />
                        </div>
                        <p className="text-sm text-white">
                            {owner.fullName.split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Post;
