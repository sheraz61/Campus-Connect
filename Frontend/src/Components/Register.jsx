import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        userName: '',
        fullName: '',
        email: '',
        password: '',
        profileImage: null,
        coverImage: null,
    });
    const [imagePreviews, setImagePreviews] = useState({
        profileImage: null,
        coverImage: null,
    });

    const profileImageRef = useRef(null);
    const coverImageRef = useRef(null);

    const onInputChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file' && files && files[0]) {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => ({ ...prev, [name]: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (error) setError('');
    };

    const removeImage = (type) => {
        setFormData(prev => ({ ...prev, [type]: null }));
        setImagePreviews(prev => ({ ...prev, [type]: null }));
        if (type === 'profileImage' && profileImageRef.current) {
            profileImageRef.current.value = '';
        }
        if (type === 'coverImage' && coverImageRef.current) {
            coverImageRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== null) {
                    data.append(key, formData[key]);
                }
            });

            const response = await fetch('http://localhost:8000/api/v1/users/register', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register');
            }

            toast.success('Registration successful! Please login.');
            setTimeout(() => navigate('/login'), 100); // Delay navigation to allow toast to show
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Your Account</h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">
                        Join our community and start sharing
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1">
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                                User Name
                            </label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={onInputChange}
                                placeholder="Enter user name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter full name"
                                value={formData.fullName}
                                onChange={onInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={onInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={onInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1">
                            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                                Profile Image
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    name="profileImage"
                                    ref={profileImageRef}
                                    onChange={onInputChange}
                                    accept="image/*"
                                    className="hidden"
                                    id="profileImage"
                                />
                                <label
                                    htmlFor="profileImage"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Choose Profile Image</span>
                                </label>
                                {imagePreviews.profileImage && (
                                    <div className="mt-2 relative">
                                        <img
                                            src={imagePreviews.profileImage}
                                            alt="Profile preview"
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage('profileImage')}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                                Cover Image
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    name="coverImage"
                                    ref={coverImageRef}
                                    onChange={onInputChange}
                                    accept="image/*"
                                    className="hidden"
                                    id="coverImage"
                                />
                                <label
                                    htmlFor="coverImage"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Choose Cover Image</span>
                                </label>
                                {imagePreviews.coverImage && (
                                    <div className="mt-2 relative">
                                        <img
                                            src={imagePreviews.coverImage}
                                            alt="Cover preview"
                                            className="w-full h-24 rounded-md object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage('coverImage')}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center rounded-md bg-orange-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-orange-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="text-[#C84C32] hover:text-[#B33D25] font-medium transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
