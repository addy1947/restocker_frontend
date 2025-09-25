import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useParams } from 'react-router-dom'

const UseStock = ({ isOpen, onClose, selectedStock, onStockUpdated }) => {
    const { _id } = useAuth()
    const { productId: urlProductId } = useParams()
    const [usedQty, setUsedQty] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Use productId from selectedStock if available, otherwise from URL params
    const productId = selectedStock?.productId || urlProductId

    const handleUseSubmit = async () => {
        try {
            if (!usedQty || usedQty <= 0 || usedQty > selectedStock.qty) {
                alert('Please enter a valid quantity')
                return
            }

            if (!productId) {
                alert('Product ID is missing. Cannot process stock usage.')
                return
            }

            setIsLoading(true)

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/${_id}/product/${productId}/stock/use`, {
                usedQty: parseInt(usedQty),
                stockId: selectedStock._id
            })

            // Call the callback to refresh stocks in parent component
            if (onStockUpdated) {
                onStockUpdated()
            }

            handleClose()
        } catch (error) {
            console.error("Failed to update stock:", error.message)
            alert('Failed to update stock. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setUsedQty('')
        onClose()
    }

    if (!isOpen || !selectedStock) {
        return null
    }

    return (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Use Stock</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Details
                        </label>
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                            <p><span className="font-medium">Expiry Date:</span> {new Date(selectedStock.expiryDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">Available Quantity:</span> <span className="font-bold text-green-600">{selectedStock.qty}</span></p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity to Use
                        </label>
                        <input
                            type="number"
                            value={usedQty}
                            onChange={(e) => setUsedQty(e.target.value)}
                            placeholder="Enter quantity to use"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                            max={selectedStock.qty}
                            disabled={isLoading}
                        />
                        {usedQty && usedQty > selectedStock.qty && (
                            <p className="text-red-500 text-xs mt-1">
                                Quantity cannot exceed available stock ({selectedStock.qty})
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUseSubmit}
                        disabled={isLoading || !usedQty || usedQty <= 0 || usedQty > selectedStock.qty}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Using...
                            </>
                        ) : (
                            'Use Stock'
                        )}
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UseStock