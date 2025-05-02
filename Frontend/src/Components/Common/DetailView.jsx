import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft, Home, BookOpen } from 'lucide-react';
import { useLogin } from '../../Context/Context';
import toast from 'react-hot-toast';

function DetailView({ 
    type = 'update', // 'update' or 'resource'
    apiEndpoint = 'posts',
    editPath = '/edit-post',
    redirectPath = '/my-posts',
    additionalFields = []
}) {
    const [item, setItem] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useLogin();
    const mainSectionPath = type === 'resource' ? '/resource' : '/update';

    useEffect(() => {
        fetch(`http://localhost:8000/api/v1/${apiEndpoint}/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
            },
        })
            .then(response => response.json())
            .then(data => setItem(data.data))
            .catch(error => console.error(`Error fetching ${type}:`, error));
    }, [id, apiEndpoint, type]);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/${apiEndpoint}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`,
                        'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                    },
                });

                if (response.ok) {
                    toast.success(`${type === 'resource' ? 'Resource' : 'Post'} deleted successfully`);
                    navigate(mainSectionPath);
                } else {
                    toast.error(`Failed to delete ${type}`);
                }
            } catch (error) {
                console.error(`Error deleting ${type}:`, error);
                toast.error(`Error deleting ${type}`);
            }
        }
    };

    if (!item) return <div className="p-8">Loading...</div>;
    const isOwner = user?.id === item.owner;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(mainSectionPath)}
                                className="flex items-center gap-2 text-[#C84C32] hover:text-[#B33D25] transition-colors font-medium"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden sm:inline">Back to {type === 'resource' ? 'Resources' : 'Posts'}</span>
                                <span className="sm:hidden">Back</span>
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/"
                                className="flex items-center gap-2 text-gray-600 hover:text-[#C84C32] transition-colors"
                            >
                                <Home className="w-5 h-5" />
                                <span className="hidden sm:inline">Home</span>
                            </Link>
                            {isOwner && (
                                <Link 
                                    to="/my-posts"
                                    className="flex items-center gap-2 text-[#C84C32] hover:text-[#B33D25] transition-colors"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    <span className="hidden sm:inline">My Posts</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Image Section */}
                        <div className="lg:w-1/2">
                            <img
                                src={item[type === 'resource' ? 'paperImage' : 'postImage']}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-t-lg lg:rounded-l-lg"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="lg:w-1/2 p-6 flex flex-col justify-between">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-4">{item.title}</h1>
                                {additionalFields.map(field => (
                                    <div key={field.name} className="mb-2">
                                        <h3 className='font-bold text-base sm:text-lg'>{field.label}: {item[field.name]}</h3>
                                    </div>
                                ))}
                                <p className="text-gray-700 whitespace-pre-wrap mb-6 text-sm sm:text-base">
                                    {item.discription}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            {isOwner && (
                                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
                                    <button
                                        onClick={() => navigate(`${editPath}/${id}`)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors w-full sm:w-auto"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailView; 