import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AddNewStock = ({ onClose, productId }) => {
    const [isFormOpen, setIsFormOpen] = useState(true);
    const [formData, setFormData] = useState({
        expiryDate: '',
        qty: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { _id } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            
            await axios.post(`http://localhost:5000/${_id}/product/${productId}/stock/add`, formData)

            setSuccess('Stock added successfully!');
            setFormData({ expiryDate: '', qty: '' });
            setTimeout(() => {
                setIsFormOpen(false);
                setSuccess('');
                if (onClose) {
                    onClose();
                }
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add stock');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setFormData({ expiryDate: '', qty: '' });
        setError('');
        setSuccess('');
        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Add New Stock</h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    {success}
                                </div>
                            )}

                            {/* Expiry Date */}
                            <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date *
                                </label>
                                <input
                                    type="date"
                                    id="expiryDate"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Quantity */}
                            <div>
                                <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    id="qty"
                                    name="qty"
                                    value={formData.qty}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter quantity"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Adding...' : 'Add Stock'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddNewStock;
