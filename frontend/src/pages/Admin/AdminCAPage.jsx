import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaBalanceScale, 
    FaPlus, 
    FaTimes, 
    FaEye, 
    FaTrash,
    FaUser,
    FaRupeeSign,
    FaCalendar
} from 'react-icons/fa';

const AdminCAPage = () => {
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        caNumber: '',
        phone: '',
        experience: '',
        specialization: '',
        firmName: ''
    });

    // Mock data for CA list - only one default CA
    const [cas, setCas] = useState([
        {
            id: 1,
            name: 'Rajesh Kumar',
            email: 'rajesh.kumar@example.com',
            caNumber: 'CA12345',
            phone: '9876543210',
            experience: '10 years',
            specialization: 'GST, Income Tax',
            firmName: 'Kumar & Associates',
            status: 'active',
            registeredDate: '2024-01-15'
        }
    ]);

    // Mock data for users who paid for CA services
    const paidUsers = [
        {
            id: 1,
            userName: 'Amit Patel',
            userEmail: 'amit@example.com',
            userPhone: '9876543210',
            serviceType: 'GST Registration',
            amount: 5000,
            paymentDate: '2024-03-01',
            caAssigned: 'Rajesh Kumar',
            status: 'In Progress'
        },
        {
            id: 2,
            userName: 'Deepak Singh',
            userEmail: 'deepak@example.com',
            userPhone: '9876543211',
            serviceType: 'Income Tax Filing',
            amount: 3500,
            paymentDate: '2024-03-05',
            caAssigned: 'Priya Sharma',
            status: 'Completed'
        },
        {
            id: 3,
            userName: 'Neha Gupta',
            userEmail: 'neha@example.com',
            userPhone: '9876543212',
            serviceType: 'Company Registration',
            amount: 8000,
            paymentDate: '2024-03-10',
            caAssigned: 'Rajesh Kumar',
            status: 'In Progress'
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // Here you would call the backend API to register a new CA
        console.log('Registering CA:', formData);
        
        // Mock: Add to list
        const newCA = {
            id: cas.length + 1,
            ...formData,
            status: 'active',
            registeredDate: new Date().toISOString().split('T')[0]
        };
        setCas([...cas, newCA]);
        
        // Reset form
        setFormData({
            name: '',
            email: '',
            password: '',
            caNumber: '',
            phone: '',
            experience: '',
            specialization: '',
            firmName: ''
        });
        setShowRegisterForm(false);
        alert('CA registered successfully!');
    };

    const handleDelete = (caId) => {
        if (window.confirm('Are you sure you want to delete this CA?')) {
            setCas(cas.filter(ca => ca.id !== caId));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <FaBalanceScale className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">CA Management</h1>
                            <p className="text-sm text-gray-600">Manage Chartered Accountants</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowRegisterForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaPlus className="w-4 h-4" />
                        Register CA
                    </button>
                </motion.div>

                {/* Register Form Modal */}
                <AnimatePresence>
                    {showRegisterForm && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                                onClick={() => setShowRegisterForm(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
                                        <h2 className="text-2xl font-bold text-gray-900">Register New CA</h2>
                                        <button
                                            onClick={() => setShowRegisterForm(false)}
                                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <FaTimes className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                    <form onSubmit={handleRegister} className="p-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">CA Number *</label>
                                                <input
                                                    type="text"
                                                    name="caNumber"
                                                    value={formData.caNumber}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Experience *</label>
                                                <input
                                                    type="text"
                                                    name="experience"
                                                    value={formData.experience}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g., 10 years"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
                                                <input
                                                    type="text"
                                                    name="specialization"
                                                    value={formData.specialization}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g., GST, Income Tax"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name *</label>
                                                <input
                                                    type="text"
                                                    name="firmName"
                                                    value={formData.firmName}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowRegisterForm(false)}
                                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                            >
                                                Register CA
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* CA List */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Registered CAs</h2>
                    {cas.map((ca) => (
                        <motion.div
                            key={ca.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FaBalanceScale className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">{ca.name}</h3>
                                        <p className="text-sm text-gray-600">{ca.email}</p>
                                        <div className="flex flex-wrap gap-3 mt-3">
                                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                                {ca.caNumber}
                                            </span>
                                            <span className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-full">
                                                {ca.phone}
                                            </span>
                                        </div>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-sm text-gray-700"><strong>Experience:</strong> {ca.experience}</p>
                                            <p className="text-sm text-gray-700"><strong>Specialization:</strong> {ca.specialization}</p>
                                            <p className="text-sm text-gray-700"><strong>Firm:</strong> {ca.firmName}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDelete(ca.id)}
                                        className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Paid Users Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Paid Users</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paidUsers.map((user) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FaUser className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-900 truncate">{user.userName}</h3>
                                        <p className="text-xs text-gray-600 truncate">{user.userEmail}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Service</span>
                                        <span className="text-xs font-semibold text-gray-900">{user.serviceType}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Amount</span>
                                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                            <FaRupeeSign />{user.amount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Payment Date</span>
                                        <span className="text-xs font-semibold text-gray-700">{user.paymentDate}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCAPage;

