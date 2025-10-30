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
    FaExclamationTriangle
} from 'react-icons/fa';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 15247,
        totalRevenue: 2500000,
        activeLoans: 342,
        legalServices: 156,
        trainingModules: 28,
        mentors: 45
    });

    const [recentActivity, setRecentActivity] = useState([
        {
            id: 1,
            type: 'user',
            message: 'New user registered',
            time: '2 minutes ago',
            icon: FaUsers,
            color: 'text-blue-600'
        },
        {
            id: 2,
            type: 'loan',
            message: 'Loan application submitted',
            time: '5 minutes ago',
            icon: FaMoneyBillWave,
            color: 'text-green-600'
        },
        {
            id: 3,
            type: 'legal',
            message: 'Legal service completed',
            time: '10 minutes ago',
            icon: FaGavel,
            color: 'text-purple-600'
        },
        {
            id: 4,
            type: 'training',
            message: 'New training module added',
            time: '15 minutes ago',
            icon: FaGraduationCap,
            color: 'text-orange-600'
        },
        {
            id: 5,
            type: 'system',
            message: 'System backup completed',
            time: '1 hour ago',
            icon: FaCheckCircle,
            color: 'text-gray-600'
        }
    ]);

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
            value: `₹${(stats.totalRevenue / 1000000).toFixed(1)}M`,
            change: '+18%',
            trend: 'up',
            icon: FaMoneyBillWave,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Active Loans',
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

    const quickActions = [
        {
            title: 'Add New Loan Scheme',
            description: 'Create a new loan scheme',
            icon: FaMoneyBillWave,
            color: 'from-green-500 to-green-600',
            path: '/admin/loans'
        },
        {
            title: 'Add Legal Service',
            description: 'Add new legal service',
            icon: FaGavel,
            color: 'from-purple-500 to-purple-600',
            path: '/admin/legal'
        },
        {
            title: 'Create Training Module',
            description: 'Add new training content',
            icon: FaGraduationCap,
            color: 'from-orange-500 to-orange-600',
            path: '/admin/training'
        },
        {
            title: 'View Analytics',
            description: 'Check detailed reports',
            icon: FaChartLine,
            color: 'from-blue-500 to-blue-600',
            path: '/admin/analytics'
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200"
                >
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Activity</h2>
                        <button className="text-orange-600 hover:text-orange-700 text-xs md:text-sm font-medium">
                            View all
                        </button>
                    </div>
                    <div className="space-y-2 md:space-y-4">
                        {recentActivity.map((activity, index) => {
                            const Icon = activity.icon;
                            return (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className={`w-8 h-8 md:w-10 md:h-10 ${activity.color} bg-gray-100 rounded-lg flex items-center justify-center`}>
                                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                                            {activity.message}
                                        </p>
                                        <p className="text-[10px] md:text-xs text-gray-500 flex items-center">
                                            <FaClock className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                                            {activity.time}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200"
                >
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Quick Actions</h2>
                    <div className="space-y-2 md:space-y-4">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <motion.button
                                    key={action.title}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="w-full p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left group"
                                >
                                    <div className="flex items-center space-x-2 md:space-x-3">
                                        <div className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                                                {action.title}
                                            </p>
                                            <p className="text-[10px] md:text-xs text-gray-500 truncate">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Mentor Bookings Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200"
            >
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaUsers className="text-orange-600 text-base md:text-lg" />
                        <span className="truncate">Mentor Bookings Overview</span>
                    </h3>
                    <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm md:text-base">
                        View All
                    </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
                    {[
                        { label: 'Total Bookings', value: '124', color: 'blue' },
                        { label: 'Pending', value: '32', color: 'yellow' },
                        { label: 'Active', value: '45', color: 'green' },
                        { label: 'Completed', value: '47', color: 'purple' }
                    ].map((stat, idx) => (
                        <div key={idx} className={`bg-${stat.color}-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-${stat.color}-100`}>
                            <div className="text-xl md:text-2xl font-bold mb-1">{stat.value}</div>
                            <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>
                
                <div className="space-y-2 md:space-y-3">
                    {[
                        { mentor: 'Dr. Sarah Johnson', student: 'John Doe', date: '2024-01-20', status: 'pending', amount: '₹300' },
                        { mentor: 'Prof. Michael Chen', student: 'Jane Smith', date: '2024-01-19', status: 'active', amount: '₹450' },
                        { mentor: 'Dr. Emily Rodriguez', student: 'Mike Johnson', date: '2024-01-18', status: 'completed', amount: '₹300' }
                    ].map((booking, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-xs md:text-sm text-gray-900 truncate">{booking.mentor}</div>
                                <div className="text-[10px] md:text-sm text-gray-600 truncate">{booking.student} • {booking.date}</div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4 ml-2">
                                <div className="text-xs md:text-sm text-gray-600">{booking.amount}</div>
                                <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium ${
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    booking.status === 'active' ? 'bg-green-100 text-green-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Charts Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6"
            >
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Revenue Trend</h3>
                    <div className="h-48 md:h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl mb-2">📈</div>
                            <p className="text-sm md:text-base text-gray-600">Revenue chart visualization</p>
                            <p className="text-xs md:text-sm text-gray-500">Interactive charts coming soon</p>
                        </div>
                    </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">User Growth</h3>
                    <div className="h-48 md:h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl mb-2">👥</div>
                            <p className="text-sm md:text-base text-gray-600">User growth visualization</p>
                            <p className="text-xs md:text-sm text-gray-500">Interactive charts coming soon</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
