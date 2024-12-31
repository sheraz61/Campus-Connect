import React from 'react'
import { useNavigate } from 'react-router-dom'

function UpdateItem({ title, discription, postImg, owner, _id }) {
    const navigate = useNavigate()

    return (
        <div 
            className="relative border-black border max-w-[400px] max-h-[600px] flex flex-col items-center p-4 m-4 hover:cursor-pointer rounded-md hover:bg-opacity-75"
            onClick={() => navigate(`/posts/${_id}`)}
        >
            {/* Post Image */}
            <img
                className="rounded-md border border-black object-cover w-full h-[300px] transition-opacity duration-300 ease-in-out"
                src={postImg}
                alt="postImg"
            />
            
            {/* Post Content */}
            <div className="absolute inset-0 flex flex-col justify-between items-center gap-4 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out bg-black bg-opacity-50 rounded-md p-4">
                {/* Title and Description */}
                <div className="w-full p-1 text-white">
                    <h3 className="font-bold text-xl line-clamp-1">{title}</h3>
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

export default UpdateItem;
