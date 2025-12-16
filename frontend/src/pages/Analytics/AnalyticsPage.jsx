import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AnalyticsPage = () => {
    const [selectedMetric, setSelectedMetric] = useState('overview');

    const metrics = [
        { id: 'overview', name: 'Overview', icon: '📊' },
        { id: 'revenue', name: 'Revenue', icon: '💰' },
        { id: 'users', name: 'Users', icon: '👥' },
        { id: 'growth', name: 'Growth', icon: '📈' },
        { id: 'performance', name: 'Performance', icon: '⚡' },
        { id: 'insights', name: 'Insights', icon: '💡' }
    ];

    const analyticsData = {
        overview: {
            title: 'Business Overview',
            stats: [
                { label: 'Total Revenue', value: '₹2.5M', change: '+12%', trend: 'up' },
                { label: 'Active Users', value: '15.2K', change: '+8%', trend: 'up' },
                { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', trend: 'up' },
                { label: 'Avg. Session', value: '4m 32s', change: '-2%', trend: 'down' }
            ]
        },
        revenue: {
            title: 'Revenue Analytics',
            stats: [
                { label: 'Monthly Revenue', value: '₹450K', change: '+15%', trend: 'up' },
                { label: 'Quarterly Growth', value: '₹1.2M', change: '+22%', trend: 'up' },
                { label: 'ARPU', value: '₹165', change: '+5%', trend: 'up' },
                { label: 'Churn Rate', value: '2.1%', change: '-0.3%', trend: 'down' }
            ]
        },
        users: {
            title: 'User Analytics',
            stats: [
                { label: 'New Users', value: '2.8K', change: '+18%', trend: 'up' },
                { label: 'Returning Users', value: '12.4K', change: '+6%', trend: 'up' },
                { label: 'User Retention', value: '78%', change: '+4%', trend: 'up' },
                { label: 'Engagement', value: '4.2/5', change: '+0.3', trend: 'up' }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white shadow-sm border-b border-gray-200"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                            <p className="text-gray-600 mt-1">Data-driven insights for your business</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option>Last 30 days</option>
                                <option>Last 7 days</option>
                                <option>Last 90 days</option>
                            </select>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Export Report
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Metrics Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {metrics.map((metric) => (
                            <motion.button
                                key={metric.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedMetric(metric.id)}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                    selectedMetric === metric.id
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <div className="text-2xl mb-2">{metric.icon}</div>
                                <div className="text-sm font-medium">{metric.name}</div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Analytics Content */}
                <motion.div
                    key={selectedMetric}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {analyticsData[selectedMetric]?.stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                                <div className={`flex items-center text-xs font-medium ${
                                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    <span className="mr-1">
                                        {stat.trend === 'up' ? '↗' : '↘'}
                                    </span>
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Charts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
                >
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl mb-2">📈</div>
                                <p className="text-gray-600">Revenue chart visualization</p>
                                <p className="text-sm text-gray-500">Interactive charts coming soon</p>
                            </div>
                        </div>
                    </div>

                    {/* User Growth Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                        <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl mb-2">👥</div>
                                <p className="text-gray-600">User growth visualization</p>
                                <p className="text-sm text-gray-500">Interactive charts coming soon</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Insights Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center mb-2">
                                <span className="text-blue-600 text-xl mr-2">💡</span>
                                <h4 className="font-medium text-blue-900">Revenue Growth</h4>
                            </div>
                            <p className="text-blue-700 text-sm">Your revenue has grown by 12% this month, driven by increased user engagement.</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center mb-2">
                                <span className="text-green-600 text-xl mr-2">📊</span>
                                <h4 className="font-medium text-green-900">User Retention</h4>
                            </div>
                            <p className="text-green-700 text-sm">User retention rate improved to 78%, indicating strong product-market fit.</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center mb-2">
                                <span className="text-purple-600 text-xl mr-2">⚡</span>
                                <h4 className="font-medium text-purple-900">Performance</h4>
                            </div>
                            <p className="text-purple-700 text-sm">Average session duration decreased slightly, consider optimizing user flow.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
