import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/connect.png';
import { useLogin } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Header() {
    const { isLoggedIn, setIsLoggedIn } = useLogin();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/users/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'X-Refresh-Token': `${localStorage.getItem('refresh')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                setIsLoggedIn(false);
                setIsMenuOpen(false);
                navigate('/');
                toast.success(data.message);
            } else {
                console.error('Logout failed:', data);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/resource', label: 'Resource' },
        { path: '/update', label: 'Updates' },
        { path: '/gpa', label: 'GPA' },
    ];

    return (
        <header className="bg-white shadow-md fixed w-full top-0 z-50">
            <nav className="px-4 py-2.5">
                <div className="flex justify-between items-center mx-auto max-w-screen-xl">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center" onClick={closeMenu}>
                        <img
                            src={logo}
                            className="mr-3 h-8 sm:h-12"
                            alt="Logo"
                        />
                        <span className="text-xl sm:text-3xl font-bold text-gray-600">Campus Connect</span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#C84C32] transition-all duration-200"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center lg:order-2">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    to="profile"
                                    className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-white bg-[#C84C32] hover:bg-[#B33D25] focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="login"
                                    className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="register"
                                    className="text-white bg-[#C84C32] hover:bg-[#B33D25] focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex lg:w-auto lg:order-1">
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-[#C84C32]" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-[#C84C32] lg:p-0`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden fixed inset-0 z-50 transform ${
                        isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out`}
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMenu}></div>
                    <div className="relative bg-white h-full w-64 shadow-xl overflow-y-auto">
                        <div className="flex flex-col p-4">
                            {/* Mobile Auth Buttons */}
                            <div className="mb-6 space-y-3">
                                {isLoggedIn ? (
                                    <>
                                        <Link
                                            to="profile"
                                            onClick={closeMenu}
                                            className="block w-full text-center text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none border border-gray-300"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-white bg-[#C84C32] hover:bg-[#B33D25] focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="login"
                                            onClick={closeMenu}
                                            className="block w-full text-center text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none border border-gray-300"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            to="register"
                                            onClick={closeMenu}
                                            className="block w-full text-center text-white bg-[#C84C32] hover:bg-[#B33D25] focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile Navigation Links */}
                            <ul className="space-y-2">
                                {navItems.map((item) => (
                                    <li key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            onClick={closeMenu}
                                            className={({ isActive }) =>
                                                `block px-4 py-2 rounded-lg duration-200 ${
                                                    isActive
                                                        ? "text-[#C84C32] bg-orange-50"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                }`
                                            }
                                        >
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

