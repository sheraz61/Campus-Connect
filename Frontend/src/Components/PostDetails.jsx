import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useLogin } from '../Context/Context.js'
function PostDetails() {
    const [post, setPost] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useLogin();
    useEffect(() => {
        // Fetch post details
        fetch(`http://localhost:8000/api/v1/posts/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
            },
        })
            .then(response => response.json())
            .then(data => setPost(data.data))
            .catch(error => console.error('Error fetching post:', error));
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/posts/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`,
                        'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                    },
                });

                if (response.ok) {
                    alert('Post deleted successfully');
                    navigate('/my-posts');
                } else {
                    alert('Failed to delete post');
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Error deleting post');
            }
        }
    };
    if (!post) return <div className="p-8">Loading...</div>;
    const isOwner = user?.id === post.owner // Compare logged-in user's ID with the post owner's ID
    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-orange-700 hover:text-orange-800"
            >
                <ArrowLeft className="w-5 h-5" />
                Back
            </button>

            {/* Post Content */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-1/2 ">
                    <img
                        src={post.postImage}
                        alt={post.title}
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2 p-6 flex flex-col justify-between">
                    {/* Post Details */}
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                        <p className="text-gray-700 whitespace-pre-wrap mb-6">
                            {post.discription}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    {isOwner && (
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => navigate(`/edit-post/${id}`)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}

export default PostDetails