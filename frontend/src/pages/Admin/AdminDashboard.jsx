import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaUsers, 
    FaMoneyBillWave, 
    FaGavel, 
    FaGraduationCap,
    FaChartLine,
    FaArrowUp,
    FaArrowDown,
    FaEye,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSpinner
} from 'react-icons/fa';
import { adminAPI } from '../../utils/api';

// Simple Revenue Chart Component
const RevenueChart = ({ data }) => {
    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
    const chartHeight = 240; // h-60 = 240px
    
    // Get last 7 days for better visualization
    const last7Days = data.slice(-7);
    
    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 relative">
                <div className="absolute inset-0 flex items-end justify-between gap-1 md:gap-2 pb-8">
                    {last7Days.map((item, index) => {
                        const height = (item.revenue / maxRevenue) * chartHeight;
                        const date = new Date(item.date);
                        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
                        
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center group">
                                <div 
                                    className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg transition-all duration-300 hover:from-green-600 hover:to-green-700 relative"
                                    style={{ height: `${Math.max(height, 4)}px` }}
                                >
                                    {item.revenue > 0 && (
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                ₹{item.revenue.toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 text-[10px] md:text-xs text-gray-600 font-medium">
                                    {dayLabel}
                                </div>
                                <div className="text-[9px] md:text-xs text-gray-500">
                                    {date.getDate()}/{date.getMonth() + 1}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 pr-2">
                    <span>₹{maxRevenue.toLocaleString()}</span>
                    <span>₹{Math.floor(maxRevenue / 2).toLocaleString()}</span>
                    <span>₹0</span>
                </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
                Last 7 Days Revenue
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRevenue: 0,
        activeLoans: 0,
        legalServices: 0,
        trainingModules: 0,
        mentors: 0
    });
    const [revenueTrend, setRevenueTrend] = useState([]);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    console.error('Admin token not found');
                    return;
                }
                const response = await adminAPI.getDashboardStats(token);
                
                if (response.success) {
                    setStats({
                        totalUsers: response.data.stats.totalUsers || 0,
                        totalRevenue: response.data.stats.totalRevenue || 0,
                        activeLoans: response.data.stats.activeLoans || 0,
                        legalServices: response.data.stats.legalServices || 0,
                        trainingModules: response.data.stats.trainingModules || 0,
                        mentors: response.data.stats.mentors || 0
                    });
                    
                    setRevenueTrend(response.data.revenueTrend || []);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDashboardStats();
    }, []);


    const kpiCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            change: '+12%',
            trend: 'up',
            icon: FaUsers,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            change: '+25%',
            trend: 'up',
            icon: FaMoneyBillWave,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Loans Schemes',
            value: stats.activeLoans.toLocaleString(),
            change: '+8%',
            trend: 'up',
            icon: FaChartLine,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Legal Services',
            value: stats.legalServices.toLocaleString(),
            change: '+15%',
            trend: 'up',
            icon: FaGavel,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
        {
            title: 'Training Modules',
            value: stats.trainingModules.toLocaleString(),
            change: '+5%',
            trend: 'up',
            icon: FaGraduationCap,
            color: 'from-indigo-500 to-indigo-600',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-600'
        },
        {
            title: 'Active Mentors',
            value: stats.mentors.toLocaleString(),
            change: '+3%',
            trend: 'up',
            icon: FaUsers,
            color: 'from-pink-500 to-pink-600',
            bgColor: 'bg-pink-50',
            textColor: 'text-pink-600'
        }
    ];

    return (
        <div className="space-y-3 md:space-y-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg md:text-3xl font-bold mb-1 md:mb-2">
                            Welcome back, Admin! 👋
                        </h1>
                        <p className="text-orange-100 text-sm md:text-lg">
                            Here's what's happening with your platform today.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                            <span className="text-4xl">📊</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* KPI Cards */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <FaSpinner className="animate-spin text-4xl text-orange-600" />
                </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {kpiCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-3 md:mb-4">
                                <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${card.color} rounded-lg md:rounded-xl flex items-center justify-center`}>
                                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <div className={`flex items-center text-xs md:text-sm font-medium ${
                                    card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {card.trend === 'up' ? (
                                        <FaArrowUp className="w-3 h-3 mr-1" />
                                    ) : (
                                        <FaArrowDown className="w-3 h-3 mr-1" />
                                    )}
                                    {card.change}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                    {card.value}
                                </h3>
                                <p className="text-gray-600 text-xs md:text-sm">
                                    {card.title}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            )}


            {/* Revenue Chart Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="grid grid-cols-1 gap-3 md:gap-6"
            >
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Revenue Trend</h3>
                    {revenueTrend.length === 0 ? (
                    <div className="h-48 md:h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl mb-2">📈</div>
                                <p className="text-sm md:text-base text-gray-600">No revenue data available</p>
                        </div>
                    </div>
                    ) : (
                        <div className="h-48 md:h-64">
                            <RevenueChart data={revenueTrend} />
                </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
