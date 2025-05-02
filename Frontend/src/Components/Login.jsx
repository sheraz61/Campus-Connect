import React, { useState } from 'react'
import { useLogin } from '../Context/Context'
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function Login() {
    const { setIsLoggedIn, setUser } = useLogin();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userLogin, setUserLogin] = useState({
        userName: '',
        email: '',
        password: '',
    });

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setUserLogin((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userLogin),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to login');
            }

            localStorage.setItem('access', data.data.accessToken);
            localStorage.setItem('refresh', data.data.refreshToken);
            setIsLoggedIn(true);
            setUser({
                id: data.data.user._id,
                userName: data.data.user.userName,
                email: data.data.user.email,
            });
            toast.success('Login successful!');
            setTimeout(() => navigate('/update'), 100); // Delay navigation to allow toast to show
            setUserLogin({
                userName: '',
                email: '',
                password: '',
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                            User Name
                        </label>
                        <input
                            type="text"
                            name="userName"
                            onChange={onInputChange}
                            value={userLogin.userName}
                            placeholder="Enter user name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            onChange={onInputChange}
                            value={userLogin.email}
                            autoComplete="username"
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
                            required
                            onChange={onInputChange}
                            value={userLogin.password}
                            autoComplete="current-password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center rounded-md bg-orange-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-orange-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link 
                                to="/register" 
                                className="text-[#C84C32] hover:text-[#B33D25] font-medium transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;