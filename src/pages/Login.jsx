import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ModernLogo from '../components/ModernLogo';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                navigate('/home');
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <ModernLogo size="large" showText={true} />
                        </div>
                        <h1 className="text-3xl font-light text-gray-900 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Sign in to your account
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-gray-50 border-l-4 border-gray-400 text-gray-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-600">
                                <input
                                    type="checkbox"
                                    name="remember-me"
                                    className="h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-300"
                                />
                                <span className="ml-2">Remember me</span>
                            </label>
                            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="text-center pt-4 border-t border-gray-100">
                            <p className="text-gray-500 text-sm">
                                Don't have an account?{' '}
                                <Link
                                    to="/signup"
                                    className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
                                >
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
