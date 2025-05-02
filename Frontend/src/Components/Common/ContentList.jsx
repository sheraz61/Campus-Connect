import React, { useState, useEffect } from 'react';
import { useLogin } from '../../Context/Context';
import { Loader2, AlertCircle, Lock } from 'lucide-react';

function ContentList({ 
    type, // 'resource' or 'update'
    apiEndpoint, // 'papers' or 'posts'
    ItemComponent, // ResourceItem or UpdateItem component
    emptyMessage = 'No items found',
    loginMessage = 'Please login to view content'
}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useLogin();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`http://localhost:8000/api/v1/${apiEndpoint}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access')}`,
                        'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch ${type}s`);
                }

                const data = await response.json();
                setItems(data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchItems();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn, apiEndpoint, type]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#C84C32]" />
                <p className="mt-4 text-gray-600">Loading {type}s...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-red-500 text-center">{error}</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <Lock className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-600 text-center">{loginMessage}</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <p className="text-gray-600 text-center">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {items.map((item) => (
                    <ItemComponent
                        key={item._id}
                        title={item.title}
                        discription={item.discription}
                        owner={item.createdBy}
                        _id={item._id}
                        {...(type === 'resource' ? {
                            paperImg: item.paperImage,
                            semester: item.semester
                        } : {
                            postImg: item.postImage
                        })}
                    />
                ))}
            </div>
        </div>
    );
}

export default ContentList; 