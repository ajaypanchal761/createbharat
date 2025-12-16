import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { FaUsers, FaSearch, FaFilter, FaEye, FaTrash, FaCheckCircle, FaTimesCircle, FaSpinner, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaIdCard, FaBan, FaUnlock, FaBuilding, FaGraduationCap, FaBalanceScale, FaEdit, FaTimes, FaPlus } from 'react-icons/fa';
import { adminAPI, adminCAAPI } from '../../utils/api';

const AdminUsersPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState(searchParams.get('type') || 'users'); // users, companies, mentors, cas
    const [filterStatus, setFilterStatus] = useState('all');
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalProfiles, setTotalProfiles] = useState(0);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [loadingProfileDetails, setLoadingProfileDetails] = useState(false);

    // CA Management States (only for CA filter type)
    const [showCAForm, setShowCAForm] = useState(false);
    const [caFormType, setCaFormType] = useState('create'); // 'create' or 'update'
    const [caFormData, setCaFormData] = useState({
        name: '',
        email: '',
        password: '',
        caNumber: '',
        phone: '',
        experience: '',
        specialization: '',
        firmName: ''
    });
    const [isSubmittingCA, setIsSubmittingCA] = useState(false);
    const [existingCA, setExistingCA] = useState(null);

    // Fetch profiles from backend
    useEffect(() => {
        fetchProfiles();
        if (filterType === 'cas') {
            checkExistingCA();
        }
    }, [filterType]);

    const checkExistingCA = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;
            
            const response = await adminCAAPI.getCA(token);
            if (response.success && response.data.ca) {
                setExistingCA(response.data.ca);
            } else {
                setExistingCA(null);
            }
        } catch (err) {
            console.error('Error checking existing CA:', err);
            setExistingCA(null);
        }
    };

    const handleCAFormChange = (e) => {
        setCaFormData({
            ...caFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateOrUpdateCA = async (e) => {
        e.preventDefault();
        setIsSubmittingCA(true);
        setError(null);

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Admin token not found');
            }

            let response;
            if (caFormType === 'create') {
                response = await adminCAAPI.register(token, caFormData);
                if (response.success) {
                    alert('CA created successfully!');
                    setExistingCA(response.data.ca);
                    fetchProfiles();
                } else {
                    throw new Error(response.message || 'Failed to create CA');
                }
            } else {
                // Update CA
                const updateData = { ...caFormData };
                if (!updateData.password) {
                    delete updateData.password; // Don't update password if empty
                }
                response = await adminCAAPI.updateCA(token, updateData);
                if (response.success) {
                    alert('CA updated successfully!');
                    setExistingCA(response.data.ca);
                    fetchProfiles();
                } else {
                    throw new Error(response.message || 'Failed to update CA');
                }
            }

            setShowCAForm(false);
            setCaFormData({
                name: '',
                email: '',
                password: '',
                caNumber: '',
                phone: '',
                experience: '',
                specialization: '',
                firmName: ''
            });
        } catch (err) {
            console.error('Error with CA operation:', err);
            alert(err.message || 'Operation failed');
        } finally {
            setIsSubmittingCA(false);
        }
    };

    const handleCAEdit = (caProfile) => {
        setCaFormData({
            name: caProfile.name || '',
            email: caProfile.email || '',
            password: '',
            caNumber: caProfile.caNumber || '',
            phone: caProfile.phone || '',
            experience: caProfile.experience || '',
            specialization: caProfile.specialization || '',
            firmName: caProfile.firmName || ''
        });
        setCaFormType('update');
        setShowCAForm(true);
    };

    const handleCACreate = () => {
        if (existingCA) {
            alert('A CA already exists. Please delete the existing CA before creating a new one.');
            return;
        }
        setCaFormData({
            name: '',
            email: '',
            password: '',
            caNumber: '',
            phone: '',
            experience: '',
            specialization: '',
            firmName: ''
        });
        setCaFormType('create');
        setShowCAForm(true);
    };

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Admin token not found. Please login again.');
            }

            let response;
            let transformedProfiles = [];

            switch(filterType) {
                case 'users':
                    response = await adminAPI.getAllUsers(token, { limit: 100 });
                    if (response.success && response.data) {
                        transformedProfiles = response.data.map((profile, index) => ({
                            id: profile._id,
                            name: `${profile.firstName} ${profile.lastName}`,
                            email: profile.email,
                            role: 'user',
                            status: profile.isActive && !profile.isBlocked ? 'active' : 'inactive',
                            joinDate: new Date(profile.createdAt).toLocaleDateString('en-GB'),
                            lastActive: profile.lastLogin ? formatLastActive(profile.lastLogin) : 'Never',
                            phone: profile.phone,
                            phoneVerified: profile.isPhoneVerified,
                            emailVerified: profile.isEmailVerified,
                            rawData: profile
                        }));
                    }
                    break;
                
                case 'companies':
                    response = await adminAPI.getAllCompanies(token, { limit: 100 });
                    if (response.success && response.data) {
                        transformedProfiles = response.data.map((profile, index) => ({
                            id: profile._id,
                            name: profile.companyName,
                            email: profile.email,
                            role: 'company',
                            status: profile.isActive && !profile.isBlocked ? 'active' : 'inactive',
                            joinDate: new Date(profile.createdAt).toLocaleDateString('en-GB'),
                            lastActive: profile.lastLogin ? formatLastActive(profile.lastLogin) : 'Never',
                            phone: profile.phone || 'N/A',
                            phoneVerified: false,
                            emailVerified: profile.isEmailVerified,
                            rawData: profile
                        }));
                    }
                    break;
                
                case 'mentors':
                    response = await adminAPI.getAllMentors(token, { limit: 100 });
                    if (response.success && response.data) {
                        transformedProfiles = response.data.map((profile, index) => ({
                            id: profile._id,
                            name: `${profile.firstName} ${profile.lastName}`,
                            email: profile.email,
                            role: 'mentor',
                            status: profile.isActive && !profile.isBlocked ? 'active' : 'inactive',
                            joinDate: new Date(profile.createdAt).toLocaleDateString('en-GB'),
                            lastActive: profile.lastLogin ? formatLastActive(profile.lastLogin) : 'Never',
                            phone: profile.phone,
                            phoneVerified: profile.isPhoneVerified,
                            emailVerified: profile.isEmailVerified,
                            rawData: profile
                        }));
                    }
                    break;
                
                case 'cas':
                    response = await adminAPI.getAllCAs(token);
                    if (response.success && response.data) {
                        transformedProfiles = response.data.map((profile, index) => ({
                            id: profile._id,
                            name: profile.name || 'CA',
                            email: profile.email,
                            role: 'ca',
                            status: profile.isActive && !profile.isBlocked ? 'active' : 'inactive',
                            joinDate: new Date(profile.createdAt).toLocaleDateString('en-GB'),
                            lastActive: profile.lastLogin ? formatLastActive(profile.lastLogin) : 'Never',
                            phone: profile.phone || 'N/A',
                            phoneVerified: false,
                            emailVerified: true,
                            rawData: profile
                        }));
                    }
                    break;
            }
            
            setProfiles(transformedProfiles);
            setTotalProfiles(response.total || transformedProfiles.length);
        } catch (err) {
            console.error('Error fetching profiles:', err);
            setError(err.message || `Failed to fetch ${filterType}`);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format last active time
    const formatLastActive = (date) => {
        const now = new Date();
        const lastActive = new Date(date);
        const diffInSeconds = Math.floor((now - lastActive) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    };

    const filteredProfiles = profiles.filter(profile => {
        const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            profile.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || profile.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleViewProfile = async (profileId) => {
        try {
            setLoadingProfileDetails(true);
            setSelectedProfile(profiles.find(p => p.id === profileId)?.rawData || null);
            setShowViewModal(true);
        } catch (err) {
            console.error('Error fetching profile details:', err);
            alert('Failed to fetch profile details: ' + err.message);
        } finally {
            setLoadingProfileDetails(false);
        }
    };

    const handleToggleStatus = async (profileId) => {
        try {
            const token = localStorage.getItem('adminToken');
            
            switch(filterType) {
                case 'users':
                    await adminAPI.deactivateUser(token, profileId);
                    break;
                case 'companies':
                    await adminAPI.deactivateCompany(token, profileId);
                    break;
                case 'mentors':
                    await adminAPI.deactivateMentor(token, profileId);
                    break;
                case 'cas':
                    await adminAPI.deactivateCA(token, profileId);
                    break;
            }
            
            fetchProfiles();
        } catch (err) {
            console.error('Error toggling profile status:', err);
            alert('Failed to update status: ' + err.message);
        }
    };

    const handleDeleteProfile = async (profileId) => {
        const profile = profiles.find(p => p.id === profileId);
        const profileLabel = getProfileTypeLabel();
        
        if (window.confirm(`Are you sure you want to delete this ${profileLabel.slice(0, -1)}?`)) {
            try {
                const token = localStorage.getItem('adminToken');
                
                switch(filterType) {
                    case 'users':
                        await adminAPI.deleteUser(token, profileId);
                        break;
                    case 'companies':
                        await adminAPI.deleteCompany(token, profileId);
                        break;
                    case 'mentors':
                        await adminAPI.deleteMentor(token, profileId);
                        break;
                    case 'cas':
                        await adminAPI.deleteCA(token, profileId);
                        break;
                }
                
                setProfiles(profiles.filter(p => p.id !== profileId));
                setTotalProfiles(totalProfiles - 1);
                alert(`${profileLabel.slice(0, -1)} deleted successfully`);
            } catch (err) {
                console.error('Error deleting profile:', err);
                alert('Failed to delete: ' + err.message);
            }
        }
    };

    const getProfileTypeLabel = () => {
        switch(filterType) {
            case 'users': return 'Users';
            case 'companies': return 'Companies';
            case 'mentors': return 'Mentors';
            case 'cas': return 'CAs';
            default: return 'Users';
        }
    };

    const getProfileIcon = () => {
        switch(filterType) {
            case 'users': return FaUsers;
            case 'companies': return FaBuilding;
            case 'mentors': return FaGraduationCap;
            case 'cas': return FaBalanceScale;
            default: return FaUsers;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profile Management</h1>
                        <p className="text-gray-600 mt-1">Manage all platform profiles and accounts</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Total {getProfileTypeLabel()}</div>
                            <div className="text-2xl font-bold text-orange-600">{totalProfiles}</div>
                        </div>
                        {filterType === 'cas' && (
                            <button
                                onClick={existingCA ? () => handleCAEdit(profiles.find(p => p.rawData._id === existingCA._id)?.rawData || existingCA) : handleCACreate}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                {existingCA ? (
                                    <>
                                        <FaEdit className="w-4 h-4" />
                                        Update CA
                                    </>
                                ) : (
                                    <>
                                        <FaPlus className="w-4 h-4" />
                                        Add CA
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Profile Type Tabs */}
                    <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                        <button
                            onClick={() => { setFilterType('users'); setSearchParams({ type: 'users' }); }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filterType === 'users'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <FaUsers className="inline mr-2" />
                            Users
                        </button>
                        <button
                            onClick={() => { setFilterType('companies'); setSearchParams({ type: 'companies' }); }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filterType === 'companies'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <FaBuilding className="inline mr-2" />
                            Companies
                        </button>
                        <button
                            onClick={() => { setFilterType('mentors'); setSearchParams({ type: 'mentors' }); }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filterType === 'mentors'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <FaGraduationCap className="inline mr-2" />
                            Mentors
                        </button>
                        <button
                            onClick={() => { setFilterType('cas'); setSearchParams({ type: 'cas' }); }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filterType === 'cas'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <FaBalanceScale className="inline mr-2" />
                            CAs
                        </button>
                    </div>

                    <div className="flex-1 md:ml-4">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder={`Search ${getProfileTypeLabel()}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <FaFilter className="text-gray-400 w-4 h-4" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
                    <div className="flex flex-col items-center justify-center">
                        <FaSpinner className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                        <div className="text-gray-600 text-lg">Loading {getProfileTypeLabel()}...</div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center space-x-3">
                        <FaTimesCircle className="w-6 h-6 text-red-500" />
                        <div>
                            <div className="text-red-800 font-semibold">Error loading {getProfileTypeLabel()}</div>
                            <div className="text-red-600 text-sm">{error}</div>
                            <button
                                onClick={fetchProfiles}
                                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profiles Table */}
            {!loading && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {getProfileTypeLabel()}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Activity
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredProfiles.map((profile, index) => (
                                    <motion.tr
                                        key={profile.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-sm font-medium">
                                                        {profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {profile.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {profile.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                profile.role === 'mentor'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : profile.role === 'company'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                                profile.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {profile.status === 'active' ? (
                                                    <FaCheckCircle className="w-3 h-3 mr-1" />
                                                ) : (
                                                    <FaTimesCircle className="w-3 h-3 mr-1" />
                                                )}
                                                {profile.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>Last active: {profile.lastActive}</div>
                                            <div className="text-xs">Joined: {profile.joinDate}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleViewProfile(profile.id)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="View Details"
                                                    disabled={loadingProfileDetails}
                                                >
                                                    {loadingProfileDetails ? (
                                                        <FaSpinner className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <FaEye className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(profile.id)}
                                                    className={`p-1 ${profile.status === 'inactive' ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'}`}
                                                    title={profile.status === 'inactive' ? 'Activate' : 'Deactivate'}
                                                >
                                                    {profile.status === 'inactive' ? (
                                                        <FaUnlock className="w-4 h-4" />
                                                    ) : (
                                                        <FaBan className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProfile(profile.id)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Delete"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* No Results */}
                    {filteredProfiles.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <FaUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <div className="text-gray-500 text-lg">No {getProfileTypeLabel().toLowerCase()} found</div>
                            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Profile Details Modal */}
            <AnimatePresence>
                {showViewModal && selectedProfile && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-2xl font-bold text-orange-600">
                                                {(() => {
                                                    if (filterType === 'users' || filterType === 'mentors') {
                                                        return `${selectedProfile.firstName?.[0] || ''}${selectedProfile.lastName?.[0] || ''}`.toUpperCase();
                                                    } else {
                                                        return selectedProfile.companyName?.[0]?.toUpperCase() || 'C';
                                                    }
                                                })()}
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">
                                                {(() => {
                                                    if (filterType === 'users' || filterType === 'mentors') {
                                                        return `${selectedProfile.firstName || ''} ${selectedProfile.lastName || ''}`;
                                                    } else {
                                                        return selectedProfile.companyName || 'Company';
                                                    }
                                                })()}
                                            </h2>
                                            <p className="text-orange-100">Profile Details</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="text-white hover:text-gray-200 transition-colors p-2"
                                    >
                                        <FaTimesCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaUser className="w-5 h-5 mr-2 text-orange-500" />
                                        Basic Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">Email Address</div>
                                            <div className="flex items-center text-gray-900 font-medium">
                                                <FaEnvelope className="w-4 h-4 mr-2 text-orange-500" />
                                                {selectedProfile.email || 'N/A'}
                                            </div>
                                            {selectedProfile.isEmailVerified && (
                                                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FaCheckCircle className="w-3 h-3 mr-1" />
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">Phone Number</div>
                                            <div className="flex items-center text-gray-900 font-medium">
                                                <FaPhone className="w-4 h-4 mr-2 text-orange-500" />
                                                {selectedProfile.phone || 'N/A'}
                                            </div>
                                            {selectedProfile.isPhoneVerified && (
                                                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FaCheckCircle className="w-3 h-3 mr-1" />
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Role & Status */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaIdCard className="w-5 h-5 mr-2 text-orange-500" />
                                        Account Status
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">Account Status</div>
                                            <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                                                selectedProfile.isActive && !selectedProfile.isBlocked
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {selectedProfile.isActive && !selectedProfile.isBlocked ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        {selectedProfile.isBlocked !== undefined && (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-500 mb-1">Blocked Status</div>
                                                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                                                    selectedProfile.isBlocked
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {selectedProfile.isBlocked ? 'Blocked' : 'Not Blocked'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Joined Date */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaCalendarAlt className="w-5 h-5 mr-2 text-orange-500" />
                                        Registration Information
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">Joined Date</div>
                                        <div className="text-gray-900 font-medium">
                                            {selectedProfile.createdAt ? new Date(selectedProfile.createdAt).toLocaleDateString('en-GB', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CA Form Modal */}
            <AnimatePresence>
                {showCAForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                            onClick={() => {
                                setShowCAForm(false);
                                setError(null);
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {caFormType === 'create' ? 'Create CA' : 'Update CA'}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowCAForm(false);
                                            setError(null);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <FaTimes className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                                <form onSubmit={handleCreateOrUpdateCA} className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={caFormData.name}
                                                onChange={handleCAFormChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={caFormData.email}
                                                onChange={handleCAFormChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Password * {caFormType === 'update' && '(leave blank to keep current)'}
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={caFormData.password}
                                                onChange={handleCAFormChange}
                                                required={caFormType === 'create'}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">CA Number *</label>
                                            <input
                                                type="text"
                                                name="caNumber"
                                                value={caFormData.caNumber}
                                                onChange={handleCAFormChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={caFormData.phone}
                                                onChange={handleCAFormChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Experience *</label>
                                            <input
                                                type="text"
                                                name="experience"
                                                value={caFormData.experience}
                                                onChange={handleCAFormChange}
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
                                                value={caFormData.specialization}
                                                onChange={handleCAFormChange}
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
                                                value={caFormData.firmName}
                                                onChange={handleCAFormChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                                            {error}
                                        </div>
                                    )}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCAForm(false);
                                                setError(null);
                                            }}
                                            disabled={isSubmittingCA}
                                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmittingCA}
                                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                                        >
                                            {isSubmittingCA ? 'Processing...' : (caFormType === 'create' ? 'Create CA' : 'Update CA')}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsersPage;
