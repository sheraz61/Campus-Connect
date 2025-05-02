import React, { useEffect, useState } from 'react'
import UpdateItem from './UpdateItem'
import { useLogin } from '../../Context/Context'
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
function MyUpdates() {
    const [postData, setPostData] = useState({})
    const { isLoggedIn } = useLogin()
    const navigate = useNavigate()
    useEffect(() => {
        fetch('http://localhost:8000/api/v1/dashboard/posts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
            },
        }).then(response => response.json()).then(data => setPostData(data.data))
    }, [])
    return (
        <div>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 m-2 text-orange-700 hover:text-orange-800"
            >
                <ArrowLeft className="w-5 h-5" />
                Back
            </button>
            <div className='flex flex-wrap '>
                {isLoggedIn ? (
                    postData.length > 0 ? (
                        postData.map((post, index) => (
                            <UpdateItem
                                key={post._id || post.id || index} // Try multiple possible unique identifiers
                                title={post.title}
                                postImg={post.postImage}
                                discription={post.discription}
                                owner={post.owner}
                                _id={post._id}
                            />
                        ))
                    ) : (
                        <p className='p-12'>No posts available</p>
                    )
                ) : (
                    <p className='p-12'>Please Login First Then See the Updates</p>
                )}
            </div>
        </div>
    )
}

export default MyUpdates