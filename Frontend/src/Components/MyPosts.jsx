import React, { useEffect, useState } from 'react'
import Post from './Post'
import { useLogin } from '../Context/Context'
function MyPosts() {
    const [postData, setPostData] = useState({})
    const { isLoggedIn } = useLogin()
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
        <div className='flex flex-wrap '>
            
            {isLoggedIn ? (
                postData.length > 0 ? (
                    postData.map((post, index) => (
                        <Post
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
    )
}

export default MyPosts