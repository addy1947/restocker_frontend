import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ProductChart = ({ isOpen, onClose, productData }) => {
    const [activeTab, setActiveTab] = useState('stock'); // 'stock' or 'used'

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Process stock data to show different stock batches
    const stockTimelineData = useMemo(() => {
        if (!productData || !productData.stockEntries) {
            return { labels: [], datasets: [] };
        }

        // Show each stock batch as a separate data point
        const labels = [];
        const quantities = [];
        
        productData.stockEntries.forEach((batch, batchIndex) => {
            // Create label for each batch
            const batchLabel = `Batch ${batchIndex + 1}`;
            labels.push(batchLabel);
            
            // Use the batch quantity (or calculate from entries if needed)
            let batchQuantity = batch.quantity || 0;
            
            // If no direct quantity, try to calculate from entries
            if (batchQuantity === 0 && batch.entry && batch.entry.length > 0) {
                batchQuantity = batch.entry.reduce((sum, entry) => {
                    return sum + (entry.usedQty || 0);
                }, 0);
            }
            
            quantities.push(batchQuantity);
        });

        // Debug logging
        console.log('Stock batches found:', productData.stockEntries);
        console.log('Labels:', labels);
        console.log('Quantities:', quantities);

        return {
            labels,
            datasets: [
                {
                    label: `Stock Batches (${productData.productDetails.measure})`,
                    data: quantities,
                    fill: true,
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                    pointBorderColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.4,
                    borderWidth: 2
                }
            ]
        };
    }, [productData, activeTab]);

    // Process used data to create timeline
    const usedTimelineData = useMemo(() => {
        if (!productData || !productData.stockEntries) {
            return { labels: [], datasets: [] };
        }

        // Collect all use entries (type 'sub' means subtract/use)
        const usedEntries = [];
        
        productData.stockEntries.forEach((batch, batchIndex) => {
            if (batch.entry && batch.entry.length > 0) {
                batch.entry.forEach(entry => {
                    // Check for 'sub' type (subtract/use)
                    if (entry.type === 'sub' && entry.time && entry.usedQty) {
                        usedEntries.push({
                            time: new Date(entry.time),
                            type: 'sub',
                            quantity: entry.usedQty,
                            batchIndex: batchIndex + 1
                        });
                    }
                });
            }
        });

        // Sort by time
        usedEntries.sort((a, b) => a.time - b.time);

        // Debug logging
        console.log('Product:', productData.productName);
        console.log('Used entries found:', usedEntries);

        const labels = usedEntries.map(entry => formatTime(entry.time));
        const quantities = usedEntries.map(entry => entry.quantity);

        return {
            labels: labels.length > 0 ? labels : ['No Data'],
            datasets: [
                {
                    label: `Used Quantity (${productData.productDetails.measure})`,
                    data: quantities.length > 0 ? quantities : [0],
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    borderRadius: 4,
                    barThickness: 40
                }
            ]
        };
    }, [productData, activeTab]);

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            title: {
                display: true,
                text: `${productData?.productName || 'Product'} - Stock Batches`,
                font: {
                    size: 18,
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                padding: 12
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 12
                    }
                },
                title: {
                    display: true,
                    text: `Batch Quantity (${productData?.productDetails?.measure || ''})`,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 10
                    },
                    maxRotation: 45,
                    minRotation: 45
                },
                title: {
                    display: true,
                    text: 'Stock Batches',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        }
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            title: {
                display: true,
                text: `${productData?.productName || 'Product'} - Usage Timeline`,
                font: {
                    size: 18,
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                padding: 12
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 12
                    }
                },
                title: {
                    display: true,
                    text: `Quantity Used (${productData?.productDetails?.measure || ''})`,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 10
                    },
                    maxRotation: 45,
                    minRotation: 45
                },
                title: {
                    display: true,
                    text: 'Stock Batches',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-[10px] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl mx-auto max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {productData?.productName || 'Product'} Analytics
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Track stock additions and usage over time
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Close chart"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6">
                    <button
                        onClick={() => setActiveTab('stock')}
                        className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                            activeTab === 'stock'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            Stock Graph
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('used')}
                        className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                            activeTab === 'used'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Used Graph
                        </div>
                    </button>
                </div>

                {/* Chart Container */}
                <div className="p-6 flex-1 overflow-auto">
                    {productData ? (
                        <div className="h-[500px] w-full">
                            {activeTab === 'stock' ? (
                                stockTimelineData.labels.length > 0 ? (
                                    <Line data={stockTimelineData} options={lineChartOptions} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <svg
                                            className="w-16 h-16 text-gray-400 mb-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                            />
                                        </svg>
                                        <p className="text-gray-500 text-lg">No stock timeline data available</p>
                                        <p className="text-gray-400 text-sm mt-2">Stock additions will appear here over time</p>
                                    </div>
                                )
                            ) : (
                                usedTimelineData.labels[0] !== 'No Data' ? (
                                    <Bar data={usedTimelineData} options={barChartOptions} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <svg
                                            className="w-16 h-16 text-gray-400 mb-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                        <p className="text-gray-500 text-lg">No usage data available</p>
                                        <p className="text-gray-400 text-sm mt-2">Stock usage will appear here when items are used</p>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64">
                            <svg
                                className="w-16 h-16 text-gray-400 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            <p className="text-gray-500 text-lg">No product data available</p>
                        </div>
                    )}
                </div>

                {/* Product Info Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Total Stock</span>
                            <span className="text-lg font-bold text-gray-900">
                                {productData?.totalQuantity || 0} {productData?.productDetails?.measure || ''}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Total Batches</span>
                            <span className="text-lg font-bold text-gray-900">
                                {productData?.stockEntries?.length || 0}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Earliest Expiry</span>
                            <span className="text-lg font-bold text-gray-900">
                                {productData?.earliestExpiry ? formatDate(productData.earliestExpiry) : 'N/A'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Status</span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center self-start ${
                                productData?.hasExpired ? 'bg-red-100 text-red-800' :
                                productData?.hasExpiringSoon ? 'bg-yellow-100 text-yellow-800' :
                                productData?.isLowStock ? 'bg-orange-100 text-orange-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                                {productData?.hasExpired ? 'Expired' :
                                 productData?.hasExpiringSoon ? 'Expiring Soon' :
                                 productData?.isLowStock ? 'Low Stock' :
                                 'In Stock'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductChart;

