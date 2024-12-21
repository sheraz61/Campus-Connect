import React from 'react'
import {useNavigate} from 'react-router-dom'
function Post({ title, discription, postImg, owner,_id }) {
    const navigate= useNavigate()
    return (
        <div className="border border-orange-600 max-w-72 flex flex-col items-center p-4 m-4 hover:cursor-pointer rounded-md "
        onClick={()=>navigate(`/posts/${_id}`)}
        >
            <img
                className="rounded-md border border-orange-600 object-cover w-full h-64"
                src={postImg}
                alt="postImg"
            />
            {(owner.profileImage && owner.userName) && (<div className="flex w-full items-center gap-2 p-1">
                <div className='w-8 h-8'>
                    <img
                        className="w-full h-full object-cover rounded-full border border-black"
                        src={owner.profileImage}
                        alt=""
                    />
                </div>
                <p className="text-sm">{owner.userName}</p>
            </div>)}
            <div className="w-full p-1">
                <h3 className="font-bold text-xl line-clamp-1">{title}</h3>
                <p className="text-sm line-clamp-2">
                    {discription}
                </p>
            </div>
        </div>
    )
}

export default Post