import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ModernLogo from '../components/ModernLogo';

const Landing_Page = () => {
    const [isVisible, setIsVisible] = useState({});
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Define testimonials array first
    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Head Chef, Bistro Modern",
            content: "Restocker transformed how we manage inventory. We've reduced waste by 40% and never run out of key ingredients anymore.",
            avatar: "👩‍🍳"
        },
        {
            name: "Marcus Rodriguez",
            role: "Restaurant Owner, Taco Libre",
            content: "The automated ordering feature is a game-changer. It saves us hours every week and ensures we're always stocked.",
            avatar: "👨‍💼"
        },
        {
            name: "Emma Thompson",
            role: "Operations Manager, Green Leaf Cafe",
            content: "Real-time analytics help us make better purchasing decisions. Our food costs have decreased by 25%.",
            avatar: "👩‍💻"
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const changeTestimonial = useCallback((newIndex) => {
        if (typeof newIndex === 'function') {
            newIndex = newIndex(currentTestimonial);
        }
        
        if (newIndex !== currentTestimonial && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentTestimonial(newIndex);
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 50);
            }, 300);
        }
    }, [currentTestimonial, isTransitioning]);

    useEffect(() => {
        const interval = setInterval(() => {
            changeTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [changeTestimonial, testimonials.length]);

    // Keyboard navigation for testimonials
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') {
                changeTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
            } else if (e.key === 'ArrowRight') {
                changeTestimonial((prev) => (prev + 1) % testimonials.length);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [changeTestimonial, testimonials.length]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans overflow-x-hidden">
            {/* Navigation Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-white/90 backdrop-blur-md border-b border-gray-100/50 animate-slideInDown">
                <div className="animate-fadeIn animation-delay-200">
                <ModernLogo size="default" showText={true} />
                </div>
                <div className="hidden md:flex items-center space-x-8 animate-fadeIn animation-delay-400">
                    <a href="#features" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105 font-medium">Features</a>
                    <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-105 font-medium">How it Works</a>
                    <a href="#testimonials" className="text-gray-600 hover:text-green-600 transition-all duration-300 hover:scale-105 font-medium">Testimonials</a>
                    <a href="#pricing" className="text-gray-600 hover:text-orange-600 transition-all duration-300 hover:scale-105 font-medium">Pricing</a>
                    <Link to='/login'>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold">
                            Log In
                        </button>
                    </Link>
                </div>
                
                {/* Mobile Menu Button */}
                <div className="md:hidden animate-fadeIn animation-delay-400">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-8 lg:px-20 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                {/* Left Content */}
                <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                            <div className="space-y-6 animate-slideInLeft">
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200/50 animate-fadeIn animation-delay-200">
                                    <span className="text-sm font-medium text-blue-700">🚀 Trusted by 500+ restaurants</span>
                                </div>
                                
                                <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight animate-slideInUp animation-delay-300">
                            Behind Every Great Dish
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
                                Is a Well-Stocked Kitchen
                            </span>
                        </h1>
                                
                                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl animate-slideInUp animation-delay-400">
                                    Transform your restaurant operations with AI-powered inventory management. 
                                    <span className="font-semibold text-gray-800"> Reduce waste by 40%, eliminate stockouts, and boost profits.</span>
                        </p>
                    </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slideInUp animation-delay-500">
                                <Link to='/signup'>
                                    <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700">
                                        <span className="flex items-center justify-center gap-2">
                                Get Started Free
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                            </button>
                        </Link>
                                <button className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl text-lg font-bold hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 transform hover:scale-105">
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                            Watch Demo
                                    </span>
                        </button>
                            </div>

                            {/* Enhanced Stats */}
                            <div className="grid grid-cols-3 gap-8 pt-12 animate-slideInUp animation-delay-600">
                                <div className="text-center group cursor-pointer">
                                    <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">500+</div>
                                    <div className="text-gray-600 font-medium group-hover:text-blue-600 transition-colors">Restaurants</div>
                                </div>
                                <div className="text-center group cursor-pointer">
                                    <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">98%</div>
                                    <div className="text-gray-600 font-medium group-hover:text-purple-600 transition-colors">Satisfaction</div>
                                </div>
                                <div className="text-center group cursor-pointer">
                                    <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">24/7</div>
                                    <div className="text-gray-600 font-medium group-hover:text-green-600 transition-colors">Support</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="w-full lg:w-1/2 relative animate-slideInRight animation-delay-300">
                            <div className="relative group">
                                <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                                    <img
                                        src="/inventory.png"
                                        alt="Modern inventory management dashboard"
                                        className="relative rounded-2xl shadow-2xl w-full h-auto object-cover transform group-hover:scale-105 transition-all duration-500"
                                    />
                                </div>
                            </div>

                            {/* Enhanced Floating Elements */}
                            <div className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-100/50 animate-slideInDown animation-delay-700 hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse shadow-lg"></div>
                                    <span className="text-sm font-bold text-gray-800">Live Tracking</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Updated 2 sec ago</div>
                            </div>

                            <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-100/50 animate-slideInUp animation-delay-800 hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                                        <span className="text-xl">📊</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-gray-800 block">AI Analytics</span>
                                        <span className="text-xs text-gray-500">40% waste reduction</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-1/2 -right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-3 border border-gray-100/50 animate-slideInRight animation-delay-900 hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                                        <span className="text-lg">🔔</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-800 block">Low Stock Alert</span>
                                        <span className="text-xs text-orange-600">Tomatoes: 2 left</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-8 lg:px-20 py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center mb-20" data-animate id="features-header">
                        <div className={`transition-all duration-1000 ${isVisible['features-header'] ? 'animate-slideInUp' : 'opacity-0 translate-y-10'}`}>
                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 font-semibold text-sm mb-4">
                                ✨ Powerful Features
                            </span>
                            <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
                                Everything You Need to 
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    Manage Inventory
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                From small cafes to large restaurant chains, Restocker provides cutting-edge tools 
                                to transform your kitchen operations and boost profitability.
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-16">
                        {/* Feature 1 */}
                        <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slideInUp animation-delay-200">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Real-time Tracking</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">Monitor inventory levels instantly with live updates, automated alerts, and predictive analytics to prevent stockouts.</p>
                            <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                <span>Learn more</span>
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slideInUp animation-delay-400">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">AI-Powered Analytics</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">Get intelligent insights into usage patterns, demand forecasting, and cost optimization with machine learning algorithms.</p>
                            <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                <span>Learn more</span>
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slideInUp animation-delay-600">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">Smart Automation</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">Automate ordering, supplier management, and inventory replenishment with intelligent threshold-based triggers.</p>
                            <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                <span>Learn more</span>
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Additional Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:bg-white hover:shadow-lg transition-all duration-300 animate-slideInUp animation-delay-800">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-xl">🔔</span>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Smart Alerts</h4>
                            <p className="text-sm text-gray-600">Customizable notifications for low stock, expiry dates, and more</p>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:bg-white hover:shadow-lg transition-all duration-300 animate-slideInUp animation-delay-900">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-xl">☁️</span>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Cloud Sync</h4>
                            <p className="text-sm text-gray-600">Access your data anywhere with real-time cloud synchronization</p>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:bg-white hover:shadow-lg transition-all duration-300 animate-slideInUp animation-delay-1000">
                            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-xl">📱</span>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Mobile App</h4>
                            <p className="text-sm text-gray-600">Manage inventory on-the-go with our intuitive mobile application</p>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:bg-white hover:shadow-lg transition-all duration-300 animate-slideInUp animation-delay-1100">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-xl">🔗</span>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Integrations</h4>
                            <p className="text-sm text-gray-600">Connect with POS systems, accounting software, and suppliers</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="px-8 lg:px-20 py-20 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20" data-animate id="how-it-works-header">
                        <div className={`transition-all duration-1000 ${isVisible['how-it-works-header'] ? 'animate-slideInUp' : 'opacity-0 translate-y-10'}`}>
                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700 font-semibold text-sm mb-4">
                                🚀 Simple Process
                            </span>
                            <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
                                How It 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                    Works
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Get started in minutes with our intuitive setup process and start optimizing your inventory immediately.
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="text-center group animate-slideInUp animation-delay-200">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                                    <span className="text-3xl font-bold text-white">1</span>
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">✨</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Setup & Connect</h3>
                            <p className="text-gray-600 leading-relaxed">Connect your existing systems, add your inventory items, and configure your preferences in just a few clicks.</p>
                        </div>

                        <div className="text-center group animate-slideInUp animation-delay-400">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                                    <span className="text-3xl font-bold text-white">2</span>
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">📊</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">Track & Monitor</h3>
                            <p className="text-gray-600 leading-relaxed">Watch real-time updates as your inventory levels change, with intelligent alerts and predictive analytics.</p>
                        </div>

                        <div className="text-center group animate-slideInUp animation-delay-600">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                                    <span className="text-3xl font-bold text-white">3</span>
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">🎯</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">Optimize & Grow</h3>
                            <p className="text-gray-600 leading-relaxed">Use AI-powered insights to reduce waste, optimize ordering, and increase profitability across all locations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="px-8 lg:px-20 py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center mb-20" data-animate id="testimonials-header">
                        <div className={`transition-all duration-1000 ${isVisible['testimonials-header'] ? 'animate-slideInUp' : 'opacity-0 translate-y-10'}`}>
                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-700 font-semibold text-sm mb-4">
                                💬 Customer Stories
                            </span>
                            <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
                                Loved by 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                                    Restaurants
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                See how restaurants worldwide are transforming their operations with Restocker.
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        {/* Navigation Arrows */}
                        <button
                            onClick={() => changeTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                            disabled={isTransitioning}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 disabled:cursor-not-allowed z-10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <button
                            onClick={() => changeTestimonial((prev) => (prev + 1) % testimonials.length)}
                            disabled={isTransitioning}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 disabled:cursor-not-allowed z-10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <div className={`rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100 animate-slideInUp animation-delay-300 transition-all duration-500 ${isTransitioning ? 'bg-gray-50' : 'bg-white'}`}>
                            <div className="flex flex-col lg:flex-row items-center gap-8">
                                <div className="flex-1">
                                    <div className="text-6xl text-gray-200 mb-4 transition-opacity duration-300">"</div>
                                    <div className={`transition-all duration-500 transform ${isTransitioning ? 'opacity-0 translate-x-8 scale-95' : 'opacity-100 translate-x-0 scale-100'}`}>
                                        <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6 font-medium">
                                            {testimonials[currentTestimonial].content}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110">
                                                {testimonials[currentTestimonial].avatar}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg transition-colors duration-300">{testimonials[currentTestimonial].name}</h4>
                                                <p className="text-gray-600 transition-colors duration-300">{testimonials[currentTestimonial].role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className={`w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center transition-all duration-500 transform hover:scale-105 ${isTransitioning ? 'opacity-0 rotate-3 scale-95' : 'opacity-100 rotate-0 scale-100'}`}>
                                        <span className="text-8xl opacity-50 transition-all duration-300">🍽️</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Navigation */}
                        <div className="flex justify-center mt-8 space-x-3">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => changeTestimonial(index)}
                                    disabled={isTransitioning}
                                    className={`h-3 rounded-full transition-all duration-500 transform hover:scale-125 disabled:cursor-not-allowed ${
                                        currentTestimonial === index 
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 w-8 shadow-lg' 
                                            : 'bg-gray-300 hover:bg-gray-400 w-3'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="flex justify-center mt-4">
                            <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-5000 ease-linear"
                                    style={{
                                        width: isTransitioning ? '0%' : '100%',
                                        animation: isTransitioning ? 'none' : 'testimonial-progress 5s linear infinite'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="px-8 lg:px-20 py-20 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20" data-animate id="pricing-header">
                        <div className={`transition-all duration-1000 ${isVisible['pricing-header'] ? 'animate-slideInUp' : 'opacity-0 translate-y-10'}`}>
                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full text-orange-700 font-semibold text-sm mb-4">
                                💰 Simple Pricing
                            </span>
                            <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
                                Choose Your 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                                    Plan
                                </span>
                        </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Start free and scale as you grow. No hidden fees, no long-term contracts.
                        </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Starter Plan */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 animate-slideInUp animation-delay-200">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                                <p className="text-gray-600 mb-6">Perfect for small cafes and restaurants</p>
                                <div className="text-5xl font-bold text-gray-900 mb-2">Free</div>
                                <p className="text-gray-500">Forever</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Up to 100 items</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Basic analytics</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Email support</span>
                                </li>
                            </ul>
                            <Link to="/signup">
                                <button className="w-full py-4 px-6 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                                    Get Started Free
                                </button>
                            </Link>
                        </div>

                        {/* Professional Plan */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-3xl p-8 relative hover:shadow-2xl transition-all duration-500 animate-slideInUp animation-delay-400 transform hover:scale-105">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                                    Most Popular
                                </span>
                            </div>
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                                <p className="text-gray-600 mb-6">For growing restaurants and chains</p>
                                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">$49</div>
                                <p className="text-gray-500">per month</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Unlimited items</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">AI-powered analytics</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Automated ordering</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Priority support</span>
                                </li>
                            </ul>
                            <Link to="/signup">
                                <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                                    Start Free Trial
                                </button>
                            </Link>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 animate-slideInUp animation-delay-600">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                                <p className="text-gray-600 mb-6">For large restaurant chains</p>
                                <div className="text-5xl font-bold text-gray-900 mb-2">Custom</div>
                                <p className="text-gray-500">Contact us</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Multi-location support</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Custom integrations</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Dedicated support</span>
                                </li>
                            </ul>
                            <button className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white px-8 lg:px-20 py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-12 mb-12">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-4 mb-6">
                                <ModernLogo size="large" showText={true} />
                            </div>
                            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                                Transform your restaurant operations with AI-powered inventory management. 
                                Reduce waste, eliminate stockouts, and boost profits.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    <span className="text-sm">📘</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                                    <span className="text-sm">🐦</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                    <span className="text-sm">💼</span>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-6">Product</h4>
                            <ul className="space-y-3">
                                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-6">Company</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2024 Restocker. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing_Page;