import React from 'react';
import { Link } from 'react-router-dom';

const Landing_Page = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-white to-purple-400 font-sans overflow-hidden">
            {/* Navigation Header */}
            <nav className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">R</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">Restocker</span>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
                    <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
                    <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
                    <Link to='/login'>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Log In
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 py-16 gap-12 max-w-7xl mx-auto">
                {/* Left Content */}
                <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight">
                            Behind Every Great Dish
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Is a Well-Stocked Kitchen
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Restocker helps restaurants track every ingredient in real-time — reduce waste, avoid shortages, and cook with confidence.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link to='/home'>
                            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                                Get Started Free
                            </button>
                        </Link>
                        <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200">
                            Watch Demo
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-gray-200">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">500+</div>
                            <div className="text-gray-600">Restaurants</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">98%</div>
                            <div className="text-gray-600">Satisfaction</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">24/7</div>
                            <div className="text-gray-600">Support</div>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="w-full lg:w-1/2 relative">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-xl opacity-20"></div>
                        <img
                            src="/inventory.png"
                            alt="Organized inventory management system"
                            className="relative rounded-3xl shadow-2xl w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">Real-time Updates</span>
                        </div>
                    </div>

                    <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">📊</span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">Smart Analytics</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-8 lg:px-20 py-16 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Everything You Need to Manage Inventory
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From small cafes to large restaurant chains, Restocker provides the tools you need to keep your kitchen running smoothly.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <span className="text-white text-xl">📱</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Real-time Tracking</h3>
                            <p className="text-gray-600">Monitor your inventory levels in real-time with instant alerts when items are running low.</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <span className="text-white text-xl">📊</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Smart Analytics</h3>
                            <p className="text-gray-600">Get insights into usage patterns and optimize your ordering with AI-powered recommendations.</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
                            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                                <span className="text-white text-xl">⚡</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Automated Orders</h3>
                            <p className="text-gray-600">Set up automatic reordering when items reach their minimum threshold levels.</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Landing_Page;