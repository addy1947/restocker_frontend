import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ModernLogo from '../components/ModernLogo';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const navigate = useNavigate();
    const { signup } = useAuth();

    const validateField = (name, value) => {
        const errors = {};

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    errors.name = 'Name is required';
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    errors.name = 'Name should contain alphabets only';
                } else if (value.trim().length < 2) {
                    errors.name = 'Name should be at least 2 characters';
                }
                break;

            case 'email':
                if (!value.trim()) {
                    errors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.email = 'Please enter a valid email format';
                }
                break;

            case 'password':
                if (!value) {
                    errors.password = 'Password is required';
                } else if (value.length < 6) {
                    errors.password = 'Password must be at least 6 characters';
                }
                break;

            default:
                break;
        }

        return errors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear validation error for this field when user starts typing
        if (validationErrors[name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const fieldErrors = validateField(name, value);
        setValidationErrors((prev) => ({ ...prev, ...fieldErrors }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate all fields
        const nameErrors = validateField('name', formData.name);
        const emailErrors = validateField('email', formData.email);
        const passwordErrors = validateField('password', formData.password);

        const allErrors = { ...nameErrors, ...emailErrors, ...passwordErrors };

        if (Object.keys(allErrors).length > 0) {
            setValidationErrors(allErrors);
            return;
        }

        setLoading(true);
        try {
            const result = await signup(formData.name, formData.email, formData.password);
            if (result.success) {
                setIsExiting(true);
                setTimeout(() => navigate('/home'), 500);
            } else {
                setError(result.error || 'Signup failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLinkClick = (e, path) => {
        e.preventDefault();
        setIsExiting(true);
        setTimeout(() => navigate(path), 500);
    };

    return (
        <div className={`min-h-screen flex ${isExiting ? 'page-exit' : 'animate-fadeIn'}`}>
            {/* Left side - Form */}
            <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white ${isExiting ? 'page-exit-left' : 'animate-slideInLeft'}`}>
                <div className="max-w-md w-full">
                    <div className="bg-white shadow-2xl rounded-3xl p-10 border border-gray-100/50 backdrop-blur-sm animate-scaleIn animation-delay-200">
                        <div className="text-center mb-8 animate-slideInUp animation-delay-400">
                            <div className="flex justify-center mb-6">
                                <ModernLogo size="large" showText={true} />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                Create Account
                            </h1>
                            <p className="text-gray-600">
                                Join us today
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-slideInDown">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6 animate-slideInUp animation-delay-600" onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                <div>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50/50 ${validationErrors.name
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-gray-200 focus:ring-blue-500'
                                            }`}
                                    />
                                    {validationErrors.name && (
                                        <p className="mt-2 text-sm text-red-600 animate-slideInDown">
                                            {validationErrors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50/50 ${validationErrors.email
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-gray-200 focus:ring-blue-500'
                                            }`}
                                    />
                                    {validationErrors.email && (
                                        <p className="mt-2 text-sm text-red-600 animate-slideInDown">
                                            {validationErrors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="Password (min 6 characters)"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50/50 ${validationErrors.password
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-gray-200 focus:ring-blue-500'
                                            }`}
                                    />
                                    {validationErrors.password && (
                                        <p className="mt-2 text-sm text-red-600 animate-slideInDown">
                                            {validationErrors.password}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>

                            <div className="text-center pt-6 border-t border-gray-100">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <a
                                        href="/login"
                                        onClick={(e) => handleLinkClick(e, '/login')}
                                        className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Sign in
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right side - Image */}
            <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden ${isExiting ? 'page-exit-right' : 'animate-slideInRight'}`}>
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-16 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-20 left-12 w-28 h-28 bg-gray-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute top-1/3 right-8 w-20 h-20 bg-slate-500/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-gray-900/20 to-slate-800/30"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
                    <div className="flex flex-col items-center justify-center max-w-2xl">
                        {/* Image container with modern styling */}
                        <div className="relative mb-12 animate-scaleIn animation-delay-300 group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-500/20 to-gray-500/20 rounded-3xl blur-2xl transform -rotate-6 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 group-hover:blur-3xl transition-all duration-500"></div>
                            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 group-hover:transform group-hover:scale-105 group-hover:-rotate-1">
                                <img
                                    src="/inventory.png"
                                    alt="Warehouse Management"
                                    className="w-[420px] h-[420px] object-contain drop-shadow-2xl transition-all duration-500 group-hover:drop-shadow-[0_25px_25px_rgba(16,185,129,0.3)] group-hover:transform group-hover:scale-110 group-hover:rotate-2"
                                />
                            </div>
                        </div>

                        {/* Text content */}
                        <div className="text-center animate-slideInUp animation-delay-500">
                            <h2 className="text-6xl font-bold mb-6 leading-tight">
                                <span className="inline-block bg-gradient-to-r from-white via-slate-100 to-gray-100 bg-clip-text text-transparent cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-400 hover:via-red-500 hover:to-red-600 hover:transform hover:rotate-2 hover:scale-110 mr-4">
                                    Start
                                </span>
                                <span className="inline-block bg-gradient-to-r from-white via-slate-100 to-gray-100 bg-clip-text text-transparent cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-400 hover:via-red-500 hover:to-red-600 hover:transform hover:-rotate-1 hover:scale-110 mr-4">
                                    Managing
                                </span>
                                <span className="inline-block bg-gradient-to-r from-white via-slate-100 to-gray-100 bg-clip-text text-transparent cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-400 hover:via-red-500 hover:to-red-600 hover:transform hover:rotate-3 hover:scale-110">
                                    Today
                                </span>
                            </h2>
                            <p className="text-xl text-slate-200 max-w-lg leading-relaxed mb-8 cursor-pointer transition-all duration-500 hover:text-red-400 hover:transform hover:-rotate-1 hover:scale-110">
                                Join thousands of businesses optimizing their inventory operations with cutting-edge technology
                            </p>

                            {/* Feature highlights */}
                            <div className="flex justify-center space-x-8 text-sm animate-slideInUp animation-delay-600">
                                <div className="flex items-center space-x-2 group cursor-pointer">
                                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg group-hover:shadow-orange-500/50 group-hover:w-4 group-hover:h-4 group-hover:shadow-xl transition-all duration-300 animate-pulse group-hover:animate-none group-hover:scale-125"></div>
                                    <span className="text-orange-300 group-hover:text-orange-100 group-hover:font-bold group-hover:transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-300 font-medium">Automated alerts</span>
                                </div>
                                <div className="flex items-center space-x-2 group cursor-pointer animation-delay-200">
                                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg group-hover:shadow-cyan-500/50 group-hover:w-4 group-hover:h-4 group-hover:shadow-xl transition-all duration-300 animate-pulse group-hover:animate-none group-hover:scale-125"></div>
                                    <span className="text-cyan-300 group-hover:text-cyan-100 group-hover:font-bold group-hover:transform group-hover:scale-110 group-hover:-rotate-1 transition-all duration-300 font-medium">Cloud sync</span>
                                </div>
                                <div className="flex items-center space-x-2 group cursor-pointer animation-delay-400">
                                    <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg group-hover:shadow-pink-500/50 group-hover:w-4 group-hover:h-4 group-hover:shadow-xl transition-all duration-300 animate-pulse group-hover:animate-none group-hover:scale-125"></div>
                                    <span className="text-pink-300 group-hover:text-pink-100 group-hover:font-bold group-hover:transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-300 font-medium">Multi-location</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
            </div>
        </div>
    );
};

export default Signup;
