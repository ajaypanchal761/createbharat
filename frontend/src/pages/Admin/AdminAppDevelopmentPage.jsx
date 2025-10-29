import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaCode,
    FaCheckCircle,
    FaClock,
    FaExclamationCircle,
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch
} from 'react-icons/fa';

const AdminAppDevelopmentPage = () => {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Load projects from localStorage or use mock data
    useEffect(() => {
        const loadProjects = () => {
            try {
                const savedProjects = JSON.parse(localStorage.getItem('appDevelopmentProjects') || '[]');
                if (savedProjects.length === 0) {
                    // Mock data
                    const mockProjects = [
                        {
                            id: 1,
                            projectName: 'E-commerce App',
                            clientName: 'John Doe',
                            email: 'john@example.com',
                            phone: '9876543210',
                            platform: 'both',
                            budget: '50k-1l',
                            timeline: '3-6-months',
                            status: 'in-progress',
                            submittedDate: '2024-01-15',
                            description: 'Full-featured e-commerce mobile application with payment gateway integration',
                            features: 'User authentication, Product catalog, Shopping cart, Payment integration, Order tracking'
                        },
                        {
                            id: 2,
                            projectName: 'Food Delivery App',
                            clientName: 'Jane Smith',
                            email: 'jane@example.com',
                            phone: '9876543211',
                            platform: 'both',
                            budget: '1l-5l',
                            timeline: '6-12-months',
                            status: 'completed',
                            submittedDate: '2024-01-14',
                            description: 'On-demand food delivery application with real-time tracking',
                            features: 'Restaurant listings, Order placement, Real-time tracking, Payment gateway, Push notifications'
                        },
                        {
                            id: 3,
                            projectName: 'Fitness Tracker',
                            clientName: 'Mike Johnson',
                            email: 'mike@example.com',
                            phone: '9876543212',
                            platform: 'ios',
                            budget: '10k-50k',
                            timeline: '2-3-months',
                            status: 'pending',
                            submittedDate: '2024-01-16',
                            description: 'iOS fitness tracking application with health data integration',
                            features: 'Workout tracking, Health metrics, Progress charts, Social sharing, Apple Health integration'
                        }
                    ];
                    localStorage.setItem('appDevelopmentProjects', JSON.stringify(mockProjects));
                    setProjects(mockProjects);
                } else {
                    setProjects(savedProjects);
                }
            } catch (error) {
                console.error('Error loading projects:', error);
                setProjects([]);
            }
        };
        loadProjects();
    }, []);

    const filteredProjects = projects.filter(project => {
        const matchesSearch = 
            project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
        
        return matchesSearch && matchesStatus;
    });

    const updateProjectStatus = (projectId, newStatus) => {
        const updatedProjects = projects.map(p => 
            p.id === projectId ? { ...p, status: newStatus } : p
        );
        setProjects(updatedProjects);
        localStorage.setItem('appDevelopmentProjects', JSON.stringify(updatedProjects));
    };

    const deleteProject = (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            const updatedProjects = projects.filter(p => p.id !== projectId);
            setProjects(updatedProjects);
            localStorage.setItem('appDevelopmentProjects', JSON.stringify(updatedProjects));
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <FaCheckCircle className="w-5 h-5 text-green-600" />;
            case 'in-progress':
                return <FaClock className="w-5 h-5 text-blue-600" />;
            case 'pending':
                return <FaExclamationCircle className="w-5 h-5 text-yellow-600" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const stats = {
        total: projects.length,
        pending: projects.filter(p => p.status === 'pending').length,
        inProgress: projects.filter(p => p.status === 'in-progress').length,
        completed: projects.filter(p => p.status === 'completed').length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">App Development Projects</h1>
                    <p className="text-gray-600 mt-2">Manage and track all app development projects</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <FaCode className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Pending</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                            <FaExclamationCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">In Progress</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.inProgress}</h3>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <FaClock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Completed</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.completed}</h3>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <FaCheckCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full md:w-auto">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search projects..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'pending', 'in-progress', 'completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setSelectedStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    selectedStatus === status
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Projects</h2>
                    {filteredProjects.length > 0 ? (
                        <div className="space-y-4">
                            {filteredProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {getStatusIcon(project.status)}
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {project.projectName}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                    {project.status.replace('-', ' ')}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                                <div>
                                                    <span className="font-medium">Client:</span> {project.clientName}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Email:</span> {project.email}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Phone:</span> {project.phone}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Platform:</span> {
                                                        project.platform === 'both' ? 'iOS & Android' :
                                                        project.platform === 'ios' ? 'iOS' :
                                                        project.platform === 'android' ? 'Android' :
                                                        project.platform === 'web' ? 'Web Application' :
                                                        project.platform === 'cross-platform' ? 'Cross-Platform' :
                                                        project.platform
                                                    }
                                                </div>
                                                <div>
                                                    <span className="font-medium">Budget:</span> {
                                                        project.budget === 'under-10k' ? 'Under ₹10,000' :
                                                        project.budget === '10k-50k' ? '₹10,000 - ₹50,000' :
                                                        project.budget === '50k-1l' ? '₹50,000 - ₹1,00,000' :
                                                        project.budget === '1l-5l' ? '₹1,00,000 - ₹5,00,000' :
                                                        project.budget === 'above-5l' ? 'Above ₹5,00,000' :
                                                        project.budget
                                                    }
                                                </div>
                                                <div>
                                                    <span className="font-medium">Timeline:</span> {
                                                        project.timeline === '1-month' ? '1 Month' :
                                                        project.timeline === '2-3-months' ? '2-3 Months' :
                                                        project.timeline === '3-6-months' ? '3-6 Months' :
                                                        project.timeline === '6-12-months' ? '6-12 Months' :
                                                        project.timeline === 'flexible' ? 'Flexible' :
                                                        project.timeline
                                                    }
                                                </div>
                                            </div>
                                            {project.description && (
                                                <p className="text-sm text-gray-700 mb-2">
                                                    <span className="font-medium">Description:</span> {project.description}
                                                </p>
                                            )}
                                            {project.features && (
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium">Features:</span> {project.features}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <select
                                                    value={project.status}
                                                    onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                                <button
                                                    onClick={() => deleteProject(project.id)}
                                                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 text-right">
                                                Submitted: {project.submittedDate}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FaCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                                {searchTerm || selectedStatus !== 'all' 
                                    ? 'No projects found matching your criteria.'
                                    : 'No projects submitted yet.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAppDevelopmentPage;

