import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import UseStock from '../components/UseStock'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const InStock = () => {
    const { _id } = useAuth()
    const [stocks, setStocks] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all') // all, expiring, low-stock
    const [expandedRows, setExpandedRows] = useState(new Set())
    const [showUseStock, setShowUseStock] = useState(false)
    const [selectedStockForUse, setSelectedStockForUse] = useState(null)

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/${_id}/instock`)
                if (res.data.stockWithProducts) {
                    // Flatten the stock data with product information
                    const flattenedStocks = []
                    res.data.stockWithProducts.forEach(stockGroup => {
                        stockGroup.stockDetail.forEach(stock => {
                            flattenedStocks.push({
                                ...stock,
                                productId: stockGroup.productId
                            })
                        })
                    })
                    setStocks(flattenedStocks)
                }
                if (res.data.product && res.data.product.allProducts) {
                    setProducts(res.data.product.allProducts)
                }
            } catch (err) {
                setError('Failed to fetch stock data')
                console.error('Error fetching stocks:', err)
            }
        }

        const fetchData = async () => {
            setLoading(true)
            await fetchStocks()
            setLoading(false)
        }

        if (_id) {
            fetchData()
        }
    }, [_id])

    const getProductName = (productId) => {
        const product = products.find(p => p._id === productId)
        return product ? product.name : 'Unknown Product'
    }

    const getProductDetails = (productId) => {
        const product = products.find(p => p._id === productId)
        return product || { name: 'Unknown Product', description: '', measure: '' }
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const isExpiringSoon = (expiryDate) => {
        const today = new Date()
        const expiry = new Date(expiryDate)
        const diffTime = expiry - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 7 && diffDays >= 0
    }

    const isExpired = (expiryDate) => {
        const today = new Date()
        const expiry = new Date(expiryDate)
        return expiry < today
    }

    // Group stocks by product and aggregate data
    const groupedStocks = stocks.reduce((acc, stock) => {
        const productId = stock.productId
        if (!acc[productId]) {
            acc[productId] = {
                productId,
                productName: getProductName(productId),
                productDetails: getProductDetails(productId),
                totalQuantity: 0,
                stockEntries: [],
                earliestExpiry: null,
                hasExpired: false,
                hasExpiringSoon: false,
                isLowStock: false
            }
        }

        acc[productId].totalQuantity += stock.qty
        acc[productId].stockEntries.push(stock)

        // Find earliest expiry date
        const stockExpiry = new Date(stock.expiryDate)
        if (!acc[productId].earliestExpiry || stockExpiry < acc[productId].earliestExpiry) {
            acc[productId].earliestExpiry = stockExpiry
        }

        // Check for expired or expiring items
        if (isExpired(stock.expiryDate)) {
            acc[productId].hasExpired = true
        }
        if (isExpiringSoon(stock.expiryDate)) {
            acc[productId].hasExpiringSoon = true
        }

        return acc
    }, {})

    // Convert to array and mark low stock
    const groupedStocksArray = Object.values(groupedStocks).map(group => {
        group.isLowStock = group.totalQuantity <= 10
        return group
    })

    const filteredStocks = groupedStocksArray.filter(group => {
        if (filter === 'expiring') {
            return group.hasExpired || group.hasExpiringSoon
        }
        if (filter === 'low-stock') {
            return group.isLowStock
        }
        return true
    })

    const getGroupStatusBadge = (group) => {
        if (group.hasExpired) {
            return 'bg-red-100 text-red-800'
        }
        if (group.hasExpiringSoon) {
            return 'bg-yellow-100 text-yellow-800'
        }
        if (group.isLowStock) {
            return 'bg-orange-100 text-orange-800'
        }
        return 'bg-green-100 text-green-800'
    }

    const getGroupStatusText = (group) => {
        if (group.hasExpired) return 'Expired'
        if (group.hasExpiringSoon) return 'Expiring Soon'
        if (group.isLowStock) return 'Low Stock'
        return 'In Stock'
    }

    const toggleRowExpansion = (productId) => {
        const newExpandedRows = new Set(expandedRows)
        if (newExpandedRows.has(productId)) {
            newExpandedRows.delete(productId)
        } else {
            newExpandedRows.add(productId)
        }
        setExpandedRows(newExpandedRows)
    }

    const getBatchStatusBadge = (stock) => {
        if (isExpired(stock.expiryDate)) {
            return 'bg-red-100 text-red-800'
        }
        if (isExpiringSoon(stock.expiryDate)) {
            return 'bg-yellow-100 text-yellow-800'
        }
        if (stock.qty <= 5) { // Lower threshold for individual batches
            return 'bg-orange-100 text-orange-800'
        }
        return 'bg-green-100 text-green-800'
    }

    const getBatchStatusText = (stock) => {
        if (isExpired(stock.expiryDate)) return 'Expired'
        if (isExpiringSoon(stock.expiryDate)) return 'Expiring Soon'
        if (stock.qty <= 5) return 'Low Qty'
        return 'Good'
    }

    const handleUseStock = (stock, productId) => {
        // Add productId to the stock object for the UseStock component
        const stockWithProductId = {
            ...stock,
            productId: productId
        }
        setSelectedStockForUse(stockWithProductId)
        setShowUseStock(true)
    }

    const handleStockUpdated = () => {
        // Refresh the stock data after using stock
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`http://localhost:5000/${_id}/instock`)
                if (res.data.stockWithProducts) {
                    const flattenedStocks = []
                    res.data.stockWithProducts.forEach(stockGroup => {
                        stockGroup.stockDetail.forEach(stock => {
                            flattenedStocks.push({
                                ...stock,
                                productId: stockGroup.productId
                            })
                        })
                    })
                    setStocks(flattenedStocks)
                }
                if (res.data.product && res.data.product.allProducts) {
                    setProducts(res.data.product.allProducts)
                }
            } catch (err) {
                setError('Failed to fetch stock data')
                console.error('Error fetching stocks:', err)
            } finally {
                setLoading(false)
            }
        }

        if (_id) {
            fetchData()
        }

        setShowUseStock(false)
        setSelectedStockForUse(null)
    }

    if (loading) {
        return (
            <div>
                <Header />
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading stock information...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <Header />
                <div className="flex justify-center items-center h-64">
                    <div className="text-red-500 text-lg">{error}</div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Items in Stock</h1>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                All Items ({groupedStocksArray.length})
                            </button>
                            <button
                                onClick={() => setFilter('expiring')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'expiring'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Expiring Soon ({groupedStocksArray.filter(g => g.hasExpired || g.hasExpiringSoon).length})
                            </button>
                            <button
                                onClick={() => setFilter('low-stock')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'low-stock'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Low Stock ({groupedStocksArray.filter(g => g.isLowStock).length})
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
                        {filteredStocks.length === 0 ? (
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
                                    {filter === 'all' ? 'No stock items found' : `No ${filter} items found`}
                                </h3>
                                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                                    {filter === 'all' ? 'Add some products and stock to get started.' : 'Try adjusting your filter or adding more stock.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product Name
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Quantity
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Earliest Expiry
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Batches
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredStocks.map((group) => (
                                            <React.Fragment key={group.productId}>
                                                <tr
                                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                    onClick={() => toggleRowExpansion(group.productId)}
                                                >
                                                    <td className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-900">
                                                        {group.productName}
                                                    </td>
                                                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-900">
                                                        <span className="font-semibold">
                                                            {group.totalQuantity} {group.productDetails.measure}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-500">
                                                        {group.earliestExpiry ? formatDate(group.earliestExpiry) : 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-2 text-xs sm:text-sm">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGroupStatusBadge(group)}`}>
                                                            {getGroupStatusText(group)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-500">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                            {group.stockEntries.length} batch{group.stockEntries.length !== 1 ? 'es' : ''}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-500 max-w-[140px] truncate"
                                                        title={group.productDetails.description || 'No description'}>
                                                        {group.productDetails.description || 'No description'}
                                                    </td>
                                                    <td className="px-4 py-2 text-xs sm:text-sm text-gray-400">
                                                        <svg
                                                            className={`w-4 h-4 transition-transform duration-200 ${expandedRows.has(group.productId) ? 'rotate-180' : ''
                                                                }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </td>
                                                </tr>

                                                {/* Expanded batch details */}
                                                {expandedRows.has(group.productId) && (
                                                    <tr className="bg-gray-50">
                                                        <td colSpan={7} className="px-4 py-3">
                                                            <div className="space-y-3">
                                                                <h4 className="text-sm font-medium text-gray-700 mb-3">
                                                                    Individual Batches for {group.productName}:
                                                                </h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                    {group.stockEntries.map((stock, stockIndex) => (
                                                                        <div
                                                                            key={stockIndex}
                                                                            className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
                                                                        >
                                                                            <div className="flex justify-between items-start mb-2">
                                                                                <h5 className="text-sm font-medium text-gray-900">
                                                                                    Batch #{stockIndex + 1}
                                                                                </h5>
                                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBatchStatusBadge(stock)}`}>
                                                                                    {getBatchStatusText(stock)}
                                                                                </span>
                                                                            </div>

                                                                            <div className="space-y-2 text-xs">
                                                                                <div className="flex justify-between">
                                                                                    <span className="text-gray-500">Quantity:</span>
                                                                                    <span className="font-medium text-gray-900">
                                                                                        {stock.qty} {group.productDetails.measure}
                                                                                    </span>
                                                                                </div>

                                                                                <div className="flex justify-between">
                                                                                    <span className="text-gray-500">Expiry Date:</span>
                                                                                    <span className={`font-medium ${isExpired(stock.expiryDate) ? 'text-red-600' :
                                                                                        isExpiringSoon(stock.expiryDate) ? 'text-yellow-600' :
                                                                                            'text-gray-900'
                                                                                        }`}>
                                                                                        {formatDate(stock.expiryDate)}
                                                                                    </span>
                                                                                </div>

                                                                                {stock.entry && stock.entry.length > 0 && (
                                                                                    <div className="pt-2 border-t border-gray-100">
                                                                                        <div className="flex justify-between">
                                                                                            <span className="text-gray-500">Last Activity:</span>
                                                                                            <span className="text-gray-700">
                                                                                                {formatDate(stock.entry[stock.entry.length - 1].time)}
                                                                                            </span>
                                                                                        </div>

                                                                                        <div className="mt-1">
                                                                                            <span className="text-gray-500">Recent Activities:</span>
                                                                                            <div className="mt-1 space-y-1 max-h-16 overflow-y-auto">
                                                                                                {stock.entry.slice(-2).reverse().map((entry, entryIndex) => (
                                                                                                    <div key={entryIndex} className="flex justify-between text-xs text-gray-600">
                                                                                                        <span>{entry.type === 'add' ? 'Added' : 'Used'}: {entry.usedQty}</span>
                                                                                                        <span>{formatDate(entry.time)}</span>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )}

                                                                                {/* Use Stock Button */}
                                                                                <div className="pt-2 border-t border-gray-100">
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleUseStock(stock, group.productId);
                                                                                        }}
                                                                                        disabled={stock.qty <= 0}
                                                                                        className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
                                                                                    >
                                                                                        {stock.qty <= 0 ? 'Out of Stock' : 'Use This Batch'}
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Use Stock Modal */}
            <UseStock
                isOpen={showUseStock}
                onClose={() => {
                    setShowUseStock(false);
                    setSelectedStockForUse(null);
                }}
                selectedStock={selectedStockForUse}
                onStockUpdated={handleStockUpdated}
            />
        </>
    )
}

export default InStock