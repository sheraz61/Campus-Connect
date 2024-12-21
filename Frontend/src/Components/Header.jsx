import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/connect.png'
import { useLogin } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
export default function Header() {
    const { isLoggedIn, setIsLoggedIn } = useLogin();

    const navigate = useNavigate()
    const handleLogout = async () => {


        try {
            const response = await fetch('http://localhost:8000/api/v1/users/logout', {
                method: 'POST',
                credentials: 'include', // Important for sending cookies
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`, // Alternative to sending token in body
                    'X-Refresh-Token': `${localStorage.getItem('refresh')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                // Clear local storage
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                // Update login context
                setIsLoggedIn(false);
                // Navigate to login page
                navigate('/');
                alert(data.message);

            } else {
                // Handle logout error
                const errorData = await response.json();
                console.error('Logout failed:', errorData);
                // Optionally show an error message to the user
                // toast.error('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Handle network errors
            // toast.error('Network error. Please check your connection.');
        }
    };


    return (
        <header className="shadow sticky z-50 top-0">
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/" className="flex items-center">
                        <img
                            src={logo}
                            className="mr-3 h-12"
                            alt="Logo"
                        />
                        <span className="text-3xl font-bold text-gray-600">Campus Connect</span>
                    </Link>
                    {isLoggedIn ? (
                        <div className='flex items-center lg:order-2'>
                            <Link
                                to="profile"
                                className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                            >
                                Profile
                            </Link>
                            <Link
                                to="#"
                                onClick={handleLogout}
                                className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                            >
                                Logout
                            </Link>
                        </div>
                    ) : (<div className="flex items-center lg:order-2">
                        <Link
                            to="login"
                            className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Log in
                        </Link>
                        <Link
                            to="register"
                            className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Register
                        </Link>
                    </div>)}

                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <NavLink
                                    to='/'
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    Home
                                </NavLink>

                            </li>
                            <li>
                                <NavLink
                                    to='/about'
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    Resource
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='/update'
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    Updates
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='/github'
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    CGPA
                                </NavLink>
                            </li>


                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

