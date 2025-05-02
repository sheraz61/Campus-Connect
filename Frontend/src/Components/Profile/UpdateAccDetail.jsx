import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function UpdateAccDetail({ updateTrigger, setUpdateTrigger, closeModal }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [accountDetails, setAccountDetails] = useState({
        fullName: '',
        email: '',
    });

    const onChangeDetails = (e) => {
        const { name, value } = e.target;
        setAccountDetails(prev => ({ ...prev, [name]: value }));
        setError(''); // Clear error when user types
    };

    const handleSubmitDetails = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/v1/users/update-details', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                },
                body: JSON.stringify({
                    fullName: accountDetails.fullName,
                    email: accountDetails.email,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update details');
            }

            setAccountDetails({
                fullName: '',
                email: '',
            });
            setUpdateTrigger(updateTrigger + 1);
            if (closeModal) closeModal();
            toast.success('Account details updated successfully!');
            navigate('/profile');
        } catch (error) {
            setError(error.message);
            toast.error(error.message || 'Failed to update details');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmitDetails} className="flex flex-col gap-6 max-w-md mx-auto">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                </label>
                <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    placeholder="Enter your full name"
                    onChange={onChangeDetails}
                    value={accountDetails.fullName}
                    required
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#C84C32] sm:text-sm sm:leading-6"
                />
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    onChange={onChangeDetails}
                    value={accountDetails.email}
                    required
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#C84C32] sm:text-sm sm:leading-6"
                />
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
                    'Update Details'
                )}
            </button>
        </form>
    );
}

export default UpdateAccDetail;