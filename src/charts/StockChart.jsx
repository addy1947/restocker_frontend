import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StockChart = ({ isOpen, onClose, groupedStocks, products }) => {
    const chartData = useMemo(() => {
        if (!groupedStocks || groupedStocks.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        // Sort stocks by product name for consistent display
        const sortedStocks = [...groupedStocks].sort((a, b) => 
            a.productName.localeCompare(b.productName)
        );

        const labels = sortedStocks.map(stock => stock.productName);
        const quantities = sortedStocks.map(stock => stock.totalQuantity);

        // Create color gradient based on quantity status
        const backgroundColors = sortedStocks.map(stock => {
            if (stock.hasExpired) return 'rgba(239, 68, 68, 0.2)'; // red
            if (stock.hasExpiringSoon) return 'rgba(234, 179, 8, 0.2)'; // yellow
            if (stock.isLowStock) return 'rgba(249, 115, 22, 0.2)'; // orange
            return 'rgba(34, 197, 94, 0.2)'; // green
        });

        const borderColors = sortedStocks.map(stock => {
            if (stock.hasExpired) return 'rgba(239, 68, 68, 1)';
            if (stock.hasExpiringSoon) return 'rgba(234, 179, 8, 1)';
            if (stock.isLowStock) return 'rgba(249, 115, 22, 1)';
            return 'rgba(34, 197, 94, 1)';
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Stock Quantity',
                    data: quantities,
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    pointBackgroundColor: backgroundColors,
                    pointBorderColor: borderColors,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.4,
                    borderWidth: 2
                }
            ]
        };
    }, [groupedStocks]);

    const options = {
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
                text: 'Stock Inventory Overview',
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
                callbacks: {
                    label: function(context) {
                        const stock = groupedStocks[context.dataIndex];
                        const measure = stock?.productDetails?.measure || '';
                        return [
                            `Quantity: ${context.parsed.y} ${measure}`,
                            `Batches: ${stock?.stockEntries?.length || 0}`,
                            `Status: ${stock?.hasExpired ? 'Expired' : stock?.hasExpiringSoon ? 'Expiring Soon' : stock?.isLowStock ? 'Low Stock' : 'In Stock'}`
                        ];
                    }
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                padding: 12,
                displayColors: true
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
                    text: 'Quantity',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 11
                    },
                    maxRotation: 45,
                    minRotation: 45
                },
                title: {
                    display: true,
                    text: 'Products',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-[10px] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl mx-auto max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Stock Inventory Chart</h2>
                        <p className="text-sm text-gray-500 mt-1">Visual representation of all items in stock</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Close chart"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Chart Container */}
                <div className="p-6 flex-1 overflow-auto">
                    {groupedStocks && groupedStocks.length > 0 ? (
                        <div className="h-[500px] w-full">
                            <Line data={chartData} options={options} />
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
                            <p className="text-gray-500 text-lg">No stock data available</p>
                            <p className="text-gray-400 text-sm mt-2">Add some products and stock to see the chart</p>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Status Legend:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm text-gray-700">In Stock</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                            <span className="text-sm text-gray-700">Low Stock</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                            <span className="text-sm text-gray-700">Expiring Soon</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-sm text-gray-700">Expired</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockChart;

