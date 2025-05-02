import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function ChangePassword({ setUpdateTrigger, updateTrigger, closeModal }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false
    });
    const [forgetPassword, setForgetPassword] = useState({
        oldPassword: '',
        newPassword: '',
    });

    const onChngeForget = (e) => {
        const { name, value } = e.target;
        setForgetPassword((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(''); // Clear error when user types
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleForgetSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/v1/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                },
                body: JSON.stringify({
                    oldPassword: forgetPassword.oldPassword,
                    newPassword: forgetPassword.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }
            toast.success('Password updated successfully!');
            setUpdateTrigger(updateTrigger + 1);
            if (closeModal) closeModal();
            navigate('/profile');
        } catch (error) {
            setError(error.message);
            toast.error(error.message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleForgetSubmit} className="flex flex-col gap-6 max-w-md mx-auto">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Old Password */}
            <div className="space-y-2">
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword.oldPassword ? "text" : "password"}
                        name="oldPassword"
                        id="oldPassword"
                        placeholder="Enter your current password"
                        onChange={onChngeForget}
                        value={forgetPassword.oldPassword}
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#C84C32] sm:text-sm sm:leading-6"
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('oldPassword')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        {showPassword.oldPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                    </button>
                </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword.newPassword ? "text" : "password"}
                        name="newPassword"
                        id="newPassword"
                        placeholder="Enter your new password"
                        onChange={onChngeForget}
                        value={forgetPassword.newPassword}
                        autoComplete="new-password"
                        required
                        className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#C84C32] sm:text-sm sm:leading-6"
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('newPassword')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        {showPassword.newPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                    </button>
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
                        Changing Password...
                    </>
                ) : (
                    'Change Password'
                )}
            </button>
        </form>
    );
}

export default ChangePassword;