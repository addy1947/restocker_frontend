import React, { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import AddNewStock from '../components/AddNewStock'
import UseStock from '../components/UseStock'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FloatingChat from '../ai/FloatingChat';

const Stock = () => {
    const { _id } = useAuth();
    const { productId } = useParams();
    const [showAddNewStock, setShowAddNewStock] = useState(false);
    const [stocks, setStocks] = useState([]);
    const [showUseForm, setShowUseForm] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);

    const fetchStocks = useCallback(async () => {
        try {
            if (!_id || !productId) return;
            const res = await axios.get(`http://localhost:5000/${_id}/product/${productId}/stock`);
            setStocks(res.data);
        } catch (error) {
            console.error("Failed to fetch stocks:", error.message);
        }
    }, [_id, productId]);

    const handleUseStock = (stock) => {
        setSelectedStock(stock);
        setShowUseForm(true);
    };

    const handleStockUpdated = () => {
        fetchStocks();
        setShowUseForm(false);
        setSelectedStock(null);
    };

    useEffect(() => {
        fetchStocks();
    }, [fetchStocks]);

    return (
        <>
            <div>
                <Header />
                <FloatingChat/>
                <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-4 sm:mb-6 md:mb-8">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Stock Management
                            </h1>
                            <button
                                onClick={() => setShowAddNewStock(true)}
                                className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-medium rounded-lg shadow-sm transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Stock
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 min-h-[200px]">
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-medium text-blue-900">Total Quantity</h3>
                                        <p className="text-sm text-blue-600">Sum of all stock entries</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-blue-900">
                                            {stocks.reduce((total, stock) => total + stock.qty, 0)}
                                        </div>
                                        <div className="text-sm text-blue-600">units</div>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Stock Entries</h2>

                            {stocks.length === 0 ? (
                                <div className="text-center py-8 sm:py-10 md:py-12">
                                    <svg className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">No stock entries yet</h3>
                                    <p className="mt-1 text-xs sm:text-sm text-gray-500">Use the Add New Stock button to add your first stock entry.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {[...stocks].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)).map((stock) => {
                                                const isExpired = new Date(stock.expiryDate) < new Date();
                                                const isExpiringSoon = new Date(stock.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                                                return (
                                                    <tr key={stock._id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-900">
                                                            {new Date(stock.expiryDate).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-500">
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                                                {stock.qty}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-500">
                                                            {isExpired ? (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                    Expired
                                                                </span>
                                                            ) : isExpiringSoon ? (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                    Expiring Soon
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Good
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-500">
                                                            <button
                                                                onClick={() => handleUseStock(stock)}
                                                                disabled={stock.qty <= 0}
                                                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                            >
                                                                Use It
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Stock Used Section */}
                        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Stock Used</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Used</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Used</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {(() => {
                                            const allEntries = [];
                                            stocks.forEach(stock => {
                                                if (stock.entry && stock.entry.length > 0) {
                                                    stock.entry.forEach(entry => {
                                                        allEntries.push({
                                                            time: entry.time,
                                                            usedQty: entry.usedQty,
                                                            expiryDate: stock.expiryDate
                                                        });
                                                    });
                                                }
                                            });

                                            if (allEntries.length === 0) {
                                                return (
                                                    <tr>
                                                        <td colSpan="3" className="px-4 py-8 text-center text-sm text-gray-500">
                                                            No stock usage history yet
                                                        </td>
                                                    </tr>
                                                );
                                            }

                                            return allEntries
                                                .sort((a, b) => new Date(b.time) - new Date(a.time))
                                                .map((entry, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-900">
                                                            {new Date(entry.time).toLocaleDateString()} {new Date(entry.time).toLocaleTimeString()}
                                                        </td>
                                                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-500">
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
                                                                {entry.usedQty}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-500">
                                                            {new Date(entry.expiryDate).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ));
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AddNewStock Modal */}
            {showAddNewStock && (
                <AddNewStock
                    onClose={() => setShowAddNewStock(false)}
                    productId={productId}
                />
            )}

            {/* Use Stock Modal */}
            <UseStock
                isOpen={showUseForm}
                onClose={() => {
                    setShowUseForm(false);
                    setSelectedStock(null);
                }}
                selectedStock={selectedStock}
                onStockUpdated={handleStockUpdated}
            />
        </>
    );
};

export default Stock;
