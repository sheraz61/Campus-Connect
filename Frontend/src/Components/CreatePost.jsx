import React from 'react'
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
function CreatePost({ updateTrigger, setUpdateTrigger,setIsCreatePost,isCreatePost }) {
    const [newPost, setNewPost] = useState({
        title: '',
        discription: '',
        postImage: null,
    })
    const navigate = useNavigate()
    const postImgRef = useRef(null);
    const onInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setNewPost((prev) => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value,
        }));
    };
    //handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Create FormData object dynamically
        const data = new FormData();
        Object.keys(newPost).forEach((key) => {
            data.append(key, newPost[key]);
        });

        try {
            const response = await fetch('http://localhost:8000/api/v1/posts/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                },
                body: data, // FormData automatically handles file upload
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.ok) {
                navigate('/profile')
                setUpdateTrigger(updateTrigger + 1)
                setIsCreatePost(!isCreatePost)
                setNewPost({
                    title: '',
                    discription: '',
                    postImage: null,
                });
            }

            if (postImgRef.current) postImgRef.current.value = '';
            alert('post create successfully!');
        } catch (error) {
            console.error('Failed to create post:', error.message);
        }
    };
    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className="flex items-center  justify-between w-full">
                <label htmlFor="userName" className="text-left w-32">
                    Post Image
                </label>
                <input
                    type="file"
                    name="postImage"
                    onChange={onInputChange}
                    ref={postImgRef}
                    required
                    className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                />
            </div>
            <div className='flex items-center justify-between w-full'>
                <label htmlFor="userName" className="text-left w-32">
                    Post Title
                </label>
                <input
                    type="text"
                    name="title"
                    placeholder='Enter Post Title'
                    onChange={onInputChange}
                    value={newPost.title}
                    required
                    className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                />
            </div>
            <div className="flex items-center justify-between w-full">
                <label htmlFor="discription" className="text-left w-32">
                    Discription
                </label>
                <textarea
                    name='discription'
                    className='w-full h-28 p-4 border border-gray-300 rounded-md'
                    placeholder='Write your post discription here...'
                    value={newPost.discription}
                    onChange={onInputChange}

                />
            </div>
            <button
                type='Submit'
                className='mt-4 px-6 py-2 bg-orange-700 text-white rounded-full hover:bg-orange-800'
            >
                Submit Post
            </button>
        </form>
    )
}

export default CreatePost