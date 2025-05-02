import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function ChangeCover({ updateTrigger, setUpdateTrigger, closeModal }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [cover, setCover] = useState({
        coverImage: null,
    });
    const coverImgRef = useRef(null);

    const onChangeCover = (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            const file = files[0];
            setCover(prev => ({ ...prev, [name]: file }));
            
            // Create image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        setError(''); // Clear error when new file is selected
    };

    const removeImage = () => {
        setCover(prev => ({ ...prev, coverImage: null }));
        setImagePreview(null);
        if (coverImgRef.current) coverImgRef.current.value = '';
    };

    const handleCoverSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append("coverImage", cover.coverImage);

            const response = await fetch('http://localhost:8000/api/v1/users/cover-image', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                },
                body: data,
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update cover image');
            }

            toast.success('Cover image updated successfully!');
            setUpdateTrigger(updateTrigger + 1);
            if (closeModal) closeModal();
            navigate('/profile');
        } catch (error) {
            setError(error.message);
            toast.error(error.message || 'Failed to update cover image');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleCoverSubmit} className="flex flex-col gap-6 max-w-md mx-auto">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Image Upload Section */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Cover Image
                </label>
                <div className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10">
                    {imagePreview ? (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-48 rounded-lg object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" />
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                    htmlFor="coverImage"
                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-[#C84C32] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#C84C32] focus-within:ring-offset-2 hover:text-[#B33D25]"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        id="coverImage"
                                        name="coverImage"
                                        type="file"
                                        className="sr-only"
                                        onChange={onChangeCover}
                                        ref={coverImgRef}
                                        required
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="mt-4 px-6 py-2.5 bg-[#C84C32] text-white rounded-full hover:bg-[#B33D25] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                    </>
                ) : (
                    'Update Cover Image'
                )}
            </button>
        </form>
    );
}

export default ChangeCover;