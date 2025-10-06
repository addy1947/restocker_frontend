import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ModernLogo from '../components/ModernLogo';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const validateField = (name, value) => {
        const errors = {};
        
        switch (name) {
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
        const emailErrors = validateField('email', formData.email);
        const passwordErrors = validateField('password', formData.password);
        
        const allErrors = { ...emailErrors, ...passwordErrors };
        
        if (Object.keys(allErrors).length > 0) {
            setValidationErrors(allErrors);
            return;
        }
        
        setLoading(true);
        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                setIsExiting(true);
                setTimeout(() => navigate('/home'), 500);
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
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
            {/* Left side - Image */}
            <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 relative overflow-hidden ${isExiting ? 'page-exit-left' : 'animate-slideInLeft'}`}>
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-32 right-16 w-24 h-24 bg-gray-500/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/2 left-8 w-16 h-16 bg-slate-500/10 rounded-full blur-md animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-slate-900/20 to-gray-800/30"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
                    <div className="flex flex-col items-center justify-center max-w-2xl">
                        {/* Image container with modern styling */}
                        <div className="relative mb-12 animate-scaleIn animation-delay-300 group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-slate-500/20 rounded-3xl blur-2xl transform rotate-6 group-hover:from-blue-500/30 group-hover:to-purple-500/30 group-hover:blur-3xl transition-all duration-500"></div>
                            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 group-hover:transform group-hover:scale-105 group-hover:rotate-1">
                                <img 
                                    src="/inventory.png" 
                                    alt="Warehouse Management" 
                                    className="w-[420px] h-[420px] object-contain drop-shadow-2xl transition-all duration-500 group-hover:drop-shadow-[0_25px_25px_rgba(59,130,246,0.3)] group-hover:transform group-hover:scale-110 group-hover:-rotate-2"
                                />
                            </div>
                        </div>
                        
                        {/* Text content */}
                        <div className="text-center animate-slideInUp animation-delay-500">
                            <h2 className="text-6xl font-bold mb-6 leading-tight">
                                <span className="inline-block bg-gradient-to-r from-white via-gray-100 to-slate-100 bg-clip-text text-transparent cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-400 hover:via-red-500 hover:to-red-600 hover:transform hover:rotate-2 hover:scale-110 mr-4">
                                    Welcome
                                </span>
                                <span className="inline-block bg-gradient-to-r from-white via-gray-100 to-slate-100 bg-clip-text text-transparent cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-400 hover:via-red-500 hover:to-red-600 hover:transform hover:-rotate-1 hover:scale-110">
                                    Back
                                </span>
                            </h2>
                            <p className="text-xl text-slate-200 max-w-lg leading-relaxed mb-8 cursor-pointer transition-all duration-500 hover:text-red-400 hover:transform hover:rotate-1 hover:scale-110">
                                Continue managing your warehouse operations with our powerful inventory management system
                            </p>
                            
                            {/* Feature highlights */}
                            <div className="flex justify-center space-x-8 text-sm animate-slideInUp animation-delay-600">
                                <div className="flex items-center space-x-2 group cursor-pointer">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg group-hover:shadow-blue-500/50 group-hover:w-4 group-hover:h-4 group-hover:shadow-xl transition-all duration-300 animate-pulse group-hover:animate-none group-hover:scale-125"></div>
                                    <span className="text-blue-300 group-hover:text-blue-100 group-hover:font-bold group-hover:transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-300 font-medium">Real-time tracking</span>
                                </div>
                                <div className="flex items-center space-x-2 group cursor-pointer animation-delay-200">
                                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg group-hover:shadow-purple-500/50 group-hover:w-4 group-hover:h-4 group-hover:shadow-xl transition-all duration-300 animate-pulse group-hover:animate-none group-hover:scale-125"></div>
                                    <span className="text-purple-300 group-hover:text-purple-100 group-hover:font-bold group-hover:transform group-hover:scale-110 group-hover:-rotate-1 transition-all duration-300 font-medium">Smart analytics</span>
                                </div>
                                <div className="flex items-center space-x-2 group cursor-pointer animation-delay-400">
                                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-lg group-hover:shadow-emerald-500/50 group-hover:w-4 group-hover:h-4 group-hover:shadow-xl transition-all duration-300 animate-pulse group-hover:animate-none group-hover:scale-125"></div>
                                    <span className="text-emerald-300 group-hover:text-emerald-100 group-hover:font-bold group-hover:transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-300 font-medium">Easy management</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
            </div>

            {/* Right side - Form */}
            <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white ${isExiting ? 'page-exit-right' : 'animate-slideInRight'}`}>
                <div className="max-w-md w-full">
                    <div className="bg-white shadow-2xl rounded-3xl p-10 border border-gray-100/50 backdrop-blur-sm animate-scaleIn animation-delay-200">
                        <div className="text-center mb-8 animate-slideInUp animation-delay-400">
                            <div className="flex justify-center mb-6">
                                <ModernLogo size="large" showText={true} />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                Sign In
                            </h1>
                            <p className="text-gray-600">
                                Access your dashboard
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
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50/50 ${
                                            validationErrors.email 
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
                                        className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50/50 ${
                                            validationErrors.password 
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

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center text-gray-600">
                                    <input
                                        type="checkbox"
                                        name="remember-me"
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2">Remember me</span>
                                </label>
                                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <div className="text-center pt-6 border-t border-gray-100">
                                <p className="text-gray-600">
                                    Don't have an account?{' '}
                                    <a
                                        href="/signup"
                                        onClick={(e) => handleLinkClick(e, '/signup')}
                                        className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Create account
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
