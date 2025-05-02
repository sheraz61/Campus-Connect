import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLogin } from '../../Context/Context';
import { ArrowLeft, ImageIcon, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

function EditForm({ 
    type = 'update', // 'update' or 'resource'
    title = 'Edit Post',
    imageField = 'postImage',
    apiEndpoint = 'posts',
    additionalFields = []
}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useLogin();
    
    const [formData, setFormData] = useState({
        title: '',
        discription: '',
        [imageField]: '',
        ...additionalFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
    });
    
    const [imagePreview, setImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/${apiEndpoint}/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`,
                        'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                    },
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to fetch data');
                }

                const data = await response.json();
                
                if (!data.data) {
                    throw new Error('No data received');
                }

                setFormData(data.data);
                setImagePreview(data.data[imageField]);
            } catch (error) {
                console.error(`Error fetching ${type}:`, error);
                setError(error.message || 'Failed to load content. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, apiEndpoint, imageField, type]);

    const onInputChange = (e) => {
        const { name, value, type: inputType, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: inputType === 'file' ? files[0] : value,
        }));

        if (inputType === 'file' && files[0]) {
            handleFileChange(files[0]);
        }
        setError('');
    };

    const handleFileChange = (file) => {
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setError('Please upload a valid image file (JPG, PNG, or GIF)');
                return;
            }

            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                setError('File size should be less than 10MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.onerror = () => {
                setError('Error reading file. Please try again.');
            };
            reader.readAsDataURL(file);
            
            setFormData(prev => ({
                ...prev,
                [imageField]: file
            }));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileChange(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, [imageField]: '' }));
        setImagePreview('');
        // Reset file input if exists
        const fileInput = document.getElementById(imageField);
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        // Validate form data
        if (!formData.title.trim()) {
            setError('Title is required');
            setIsSaving(false);
            return;
        }

        if (!formData.discription.trim()) {
            setError('Description is required');
            setIsSaving(false);
            return;
        }

        const formDataToSend = new FormData();
        
        try {
            // Handle image data
            if (typeof formData[imageField] === 'object' && formData[imageField] instanceof File) {
                formDataToSend.append(imageField, formData[imageField]);
            } else if (formData[imageField]) {
                // If it's a URL string from existing image
                formDataToSend.append('existingImage', formData[imageField]);
            }

            // Append other form data
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('discription', formData.discription.trim());

            // Add additional fields if any
            additionalFields.forEach(field => {
                if (formData[field.name]) {
                    formDataToSend.append(field.name, formData[field.name]);
                }
            });

            const response = await fetch(`http://localhost:8000/api/v1/${apiEndpoint}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed to update ${type}`);
            }

            toast.success('Updated successfully!');
            navigate(-1);
        } catch (error) {
            console.error(`Error updating ${type}:`, error);
            setError(error.message || `Error updating ${type}. Please try again.`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] p-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#C84C32]" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-4 sm:mb-6 text-[#C84C32] hover:text-[#B33D25] transition-colors relative z-10"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm sm:text-base font-medium">Back</span>
            </button>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">{title}</h1>
                
                {error && (
                    <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="space-y-1 sm:space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={onInputChange}
                            placeholder="Enter title"
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors"
                            required
                        />
                    </div>

                    {additionalFields.map(field => (
                        <div key={field.name} className="space-y-1 sm:space-y-2">
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                                {field.label}
                            </label>
                            <input
                                type={field.type || 'text'}
                                id={field.name}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={onInputChange}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors"
                                required={field.required}
                            />
                        </div>
                    ))}

                    <div className="space-y-1 sm:space-y-2">
                        <label htmlFor="discription" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="discription"
                            name="discription"
                            value={formData.discription}
                            onChange={onInputChange}
                            placeholder="Enter description"
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors min-h-[120px]"
                            rows="5"
                            required
                        />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            {type === 'resource' ? 'Paper Image' : 'Post Image'}
                        </label>
                        <div 
                            className={`mt-1 flex justify-center rounded-lg border-2 border-dashed transition-colors ${
                                isDragOver ? 'border-[#C84C32] bg-red-50' : 'border-gray-300'
                            } px-4 sm:px-6 py-6 sm:py-8`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {imagePreview ? (
                                <div className="relative w-full max-w-xs mx-auto">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-h-48 rounded-lg object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center w-full">
                                    <ImageIcon className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-300" />
                                    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-0 text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor={imageField}
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-[#C84C32] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#C84C32] focus-within:ring-offset-2 hover:text-[#B33D25]"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id={imageField}
                                                name={imageField}
                                                type="file"
                                                accept="image/*"
                                                onChange={onInputChange}
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="sm:pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600 mt-2">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-[#C84C32] text-white rounded-full hover:bg-[#B33D25] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditForm; 