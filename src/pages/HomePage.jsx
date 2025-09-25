import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AddProduct from '../components/AddProduct';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import FloatingChat from '../ai/FloatingChat';

const HomePage = () => {
  const auth = useAuth();
  const _id = auth?._id;
  const navigate = useNavigate();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProducts = async (isRefresh = false) => {
    try {
      if (!_id) return;
      if (isRefresh) {
        setIsRefreshing(true);
      }
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${_id}/product`);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchProducts(true);
  };

  useEffect(() => {
    fetchProducts();
  }, [_id]);

  return (
    <>
      <Header />
      <FloatingChat />
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Inventory Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Manage your products and inventory
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setShowAddProduct(true)}
                className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-medium rounded-lg shadow-sm transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Product
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white text-sm sm:text-base font-medium rounded-lg shadow-sm transition-colors duration-200"
              >
                <svg
                  className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
            {products.length === 0 ? (
              <div className="text-center py-8 sm:py-10 md:py-12">
                <svg
                  className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
                  No products yet
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Use the Add Product button to add your first product.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Measure</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-500">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {product.measure?.toUpperCase() || '--'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-500 max-w-[140px] truncate" title={product.description || 'No description'}>
                          {product.description || 'No description'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddProduct && <AddProduct onClose={() => setShowAddProduct(false)} />}
    </>
  );
};

export default HomePage;
