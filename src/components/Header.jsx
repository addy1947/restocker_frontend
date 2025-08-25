import React from 'react'
import { Link } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                {/* Container that changes layout based on screen size */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Left (Logo) and Right (Actions) */}
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to='/home'>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">R</span>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Restocker</span>
                            </div>
                        </Link>

                        {/* Right-side Actions (on top right in mobile, same row in desktop) */}
                        <div className="flex items-center space-x-4 md:hidden">
                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 px-2 py-1"
                                    >
                                        Logout
                                    </button>
                                    <button
                                        onClick={handleProfileClick}
                                        className="p-1 text-gray-700 hover:text-blue-600"
                                    >
                                        {user?.picture ? (
                                            <img
                                                src={user.picture}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <MdAccountCircle className="text-2xl" />
                                        )}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-4 md:mt-0 md:flex-row">
                        <Link
                            to="/home"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                        >
                            Products
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
                        </Link>
                        <Link
                            to="/instock"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                        >
                            InStock
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
                        </Link>
                        <Link
                            to="/alert"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                        >
                            Alert
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
                        </Link>
                    </div>


                    {/* Desktop-only Right-side Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-red-50"
                                >
                                    Logout
                                </button>
                                <div className="relative group">
                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
                                    >
                                        {user?.picture ? (
                                            <img
                                                src={user.picture}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <MdAccountCircle className="text-2xl" />
                                        )}
                                        <span className="hidden sm:block font-medium">Account</span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="py-2">
                                            <button
                                                onClick={handleProfileClick}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            >
                                                Profile
                                            </button>
                                            <a href="#settings" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                                Settings
                                            </a>
                                            <hr className="my-1 border-gray-100" />
                                            <a href="#help" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                                Help & Support
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header
