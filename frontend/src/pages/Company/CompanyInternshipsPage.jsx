import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { internshipAPI, applicationAPI, companyAPI } from '../../utils/api';

const CompanyInternshipsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isPostingJob, setIsPostingJob] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [myInternships, setMyInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [editingInternship, setEditingInternship] = useState(null);
    const [isUpdatingInternship, setIsUpdatingInternship] = useState(false);
    const [isDeletingInternship, setIsDeletingInternship] = useState(null);
    const [stats, setStats] = useState({
        totalJobsPosted: 0,
        activeApplications: 0,
        hiredCandidates: 0,
        responseRate: '0%'
    });
    const [jobFormData, setJobFormData] = useState({
        title: '',
        location: '',
        duration: '3 months',
        description: '',
        requirements: [],
        responsibilities: '',
        salary: '',
        stipend: '',
        type: 'Internship',
        category: 'Technology',
        skills: '',
        openings: '1',
        applicationDeadline: ''
    });
    const [companyProfile, setCompanyProfile] = useState(null);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    
    // Document upload states
    const [registrationDoc, setRegistrationDoc] = useState(null);
    const [gstDoc, setGstDoc] = useState(null);
    const [isUploadingDocs, setIsUploadingDocs] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Check authentication on mount and load data
    useEffect(() => {
        const companyToken = localStorage.getItem('companyToken');
        const userType = localStorage.getItem('userType');

        if (!companyToken || userType !== 'company') {
            navigate('/company/login', { replace: true });
            return;
        }

        loadCompanyData(companyToken);
    }, [navigate]);

    const loadCompanyData = async (token) => {
        setIsLoading(true);
        try {
            // Load company info
            const companyResponse = await companyAPI.getMe(token);
            if (companyResponse.success) {
                const company = companyResponse.data.company;
                setCompanyInfo(company);

                // Populate company profile with backend data
                setCompanyProfile({
                    companyName: company.companyName || '',
                    industry: company.industry || '',
                    companySize: company.companySize || '',
                    website: company.website || '',
                    description: company.description || '',
                    location: company.location || '',
                    gstNumber: company.gstNumber || '',
                    email: company.email || '',
                    address: company.address || {}
                });
            }

            // Load internships
            const internshipsResponse = await internshipAPI.getMyInternships(token);
            if (internshipsResponse.success) {
                setMyInternships(internshipsResponse.data.internships || []);

                // Calculate stats
                const totalJobs = internshipsResponse.data.internships.length;
                let totalApplicants = 0;
                let hiredCount = 0;

                // Load applications
                const appsResponse = await applicationAPI.getCompanyApplications(token);
                if (appsResponse.success) {
                    const allApps = appsResponse.data.applications || [];
                    setApplications(allApps);

                    totalApplicants = allApps.length;
                    hiredCount = allApps.filter(app => app.status === 'hired').length;

                    const activeApps = allApps.filter(app =>
                        app.status === 'pending' || app.status === 'shortlisted'
                    ).length;

                    setStats({
                        totalJobsPosted: totalJobs,
                        activeApplications: activeApps,
                        hiredCandidates: hiredCount,
                        responseRate: totalJobs > 0 ? `${Math.round((totalApplicants / totalJobs) * 100)}%` : '0%'
                    });
                }
            }
        } catch (error) {
            console.error('Error loading company data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJobFormChange = (e) => {
        setJobFormData({
            ...jobFormData,
            [e.target.name]: e.target.value
        });
    };

    // Array field helpers (similar to loan module)
    const addArrayItem = (field) => {
        setJobFormData({
            ...jobFormData,
            [field]: [...(jobFormData[field] || []), '']
        });
    };

    const updateArrayItem = (field, index, value) => {
        const updatedArray = [...(jobFormData[field] || [])];
        updatedArray[index] = value;
        setJobFormData({
            ...jobFormData,
            [field]: updatedArray
        });
    };

    const removeArrayItem = (field, index) => {
        const updatedArray = (jobFormData[field] || []).filter((_, i) => i !== index);
        setJobFormData({
            ...jobFormData,
            [field]: updatedArray
        });
    };

    const handlePostJob = async (e) => {
        e.preventDefault();

        // If editing, use update handler instead
        if (editingInternship) {
            return handleUpdateInternship(e);
        }

        // Check if documents are uploaded
        if (!companyInfo?.documents?.registrationCertificate?.url || !companyInfo?.documents?.gstCertificate?.url) {
            setShowUploadModal(true);
            return;
        }

        setIsPostingJob(true);

        try {
            const token = localStorage.getItem('companyToken');
            if (!token) {
                navigate('/company/login');
                return;
            }

            // Parse responsibilities from responsibilities field - split by newlines
            const responsibilities = jobFormData.responsibilities
                ? jobFormData.responsibilities.split('\n').filter(r => r.trim())
                : [];

            // Parse skills from comma-separated string
            const skills = jobFormData.skills
                ? jobFormData.skills.split(',').map(s => s.trim()).filter(s => s)
                : [];

            // Process requirements array - filter out empty strings
            const requirements = Array.isArray(jobFormData.requirements)
                ? jobFormData.requirements.filter(r => r && r.trim()).map(r => r.trim())
                : [];

            // Validate required fields
            if (!jobFormData.title || !jobFormData.location || !jobFormData.duration ||
                !jobFormData.description || !jobFormData.category || !jobFormData.salary || !jobFormData.applicationDeadline) {
                alert('Please fill all required fields including application deadline');
                setIsPostingJob(false);
                return;
            }

            // Build internship data object matching backend schema exactly
            const internshipData = {
                title: jobFormData.title?.trim() || '',
                location: jobFormData.location?.trim() || '',
                duration: jobFormData.duration?.trim() || '',
                stipend: (jobFormData.salary?.trim() || jobFormData.stipend?.trim() || '').replace(/\/month$/i, '') + '/month',
                type: jobFormData.type || 'Internship',
                category: jobFormData.category || 'Technology',
                description: jobFormData.description?.trim() || '',
                requirements: requirements,
                responsibilities: Array.isArray(responsibilities) && responsibilities.length > 0 ? responsibilities : [],
                skills: Array.isArray(skills) && skills.length > 0 ? skills : [],
                isRemote: jobFormData.location?.toLowerCase().includes('remote') || false,
                openings: parseInt(jobFormData.openings) || 1,
                applicationDeadline: jobFormData.applicationDeadline ? new Date(jobFormData.applicationDeadline).toISOString() : null
            };

            console.log('Sending internship data:', JSON.stringify(internshipData, null, 2));

            const response = await internshipAPI.create(token, internshipData);

            if (response.success) {
                alert('Internship posted successfully!');
                setJobFormData({
                    title: '',
                    location: '',
                    duration: '3 months',
                    description: '',
                    requirements: [],
                    responsibilities: '',
                    salary: '',
                    stipend: '',
                    type: 'Internship',
                    category: 'Technology',
                    skills: '',
                    openings: '1',
                    applicationDeadline: ''
                });
                setActiveTab('dashboard');

                // Reload internships
                await loadCompanyData(token);
            } else {
                alert(response.message || 'Failed to post internship');
            }
        } catch (error) {
            console.error('Error posting internship:', error);
            alert(error.message || 'Failed to post internship. Please try again.');
        } finally {
            setIsPostingJob(false);
        }
    };

    const handleApplicationAction = async (applicationId, action) => {
        try {
            const token = localStorage.getItem('companyToken');
            if (!token) {
                navigate('/company/login');
                return;
            }

            // Map action to backend status (pending, shortlisted, rejected, hired, withdrawn)
            let status = 'pending';
            let actionText = 'updated';

            if (action === 'shortlist' || action === 'shortlisted') {
                status = 'shortlisted';
                actionText = 'shortlisted';
            } else if (action === 'reject' || action === 'rejected') {
                status = 'rejected';
                actionText = 'rejected';
            } else if (action === 'hire' || action === 'hired' || action === 'accepted') {
                status = 'hired';
                actionText = 'hired';
            } else if (action === 'withdraw' || action === 'withdrawn') {
                status = 'withdrawn';
                actionText = 'withdrawn';
            }

            const response = await applicationAPI.updateStatus(token, applicationId, status);

            if (response.success) {
                alert(`Application ${actionText} successfully!`);

                // Update local applications state
                setApplications(prev => prev.map(app =>
                    app._id === applicationId
                        ? { ...app, status, statusUpdatedAt: new Date() }
                        : app
                ));

                // Reload data
                await loadCompanyData(token);
            } else {
                alert(response.message || `Failed to ${actionText} application`);
            }
        } catch (error) {
            console.error('Error updating application:', error);
            alert(error.message || `Failed to update application`);
        }
    };

    const handleDownloadResume = async (application) => {
        if (!application.resume || !application.resume.url) {
            alert('Resume not available');
            return;
        }

        try {
            const token = localStorage.getItem('companyToken');
            if (!token) {
                navigate('/company/login');
                return;
            }

            // Use backend API to download resume (bypasses CORS and authorization issues)
            await applicationAPI.downloadResume(application.id || application._id, token);
        } catch (error) {
            console.error('Error downloading resume:', error);
            alert(error.message || 'Failed to download resume. Please try again.');
        }
    };

    const handleProfileChange = (e) => {
        if (!companyProfile) return;

        setCompanyProfile({
            ...companyProfile,
            [e.target.name]: e.target.name === 'gstNumber' ? e.target.value.toUpperCase() : e.target.value
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        if (!companyProfile) {
            alert('Company profile not loaded');
            return;
        }

        setIsUpdatingProfile(true);

        try {
            const token = localStorage.getItem('companyToken');
            if (!token) {
                navigate('/company/login');
                return;
            }

            // Prepare profile data matching backend schema
            const profileData = {
                companyName: companyProfile.companyName?.trim() || '',
                industry: companyProfile.industry?.trim() || '',
                companySize: companyProfile.companySize || '',
                website: companyProfile.website?.trim() || '',
                description: companyProfile.description?.trim() || '',
                location: companyProfile.location?.trim() || '',
                gstNumber: companyProfile.gstNumber?.trim() || ''
            };

            // Include address if exists
            if (companyProfile.address && Object.keys(companyProfile.address).length > 0) {
                profileData.address = companyProfile.address;
            }

            // Call updateProfile with files if selected
            const response = await companyAPI.updateProfile(token, profileData, registrationDoc, gstDoc);

            if (response.success) {
                alert('Profile updated successfully!');
                // Clear file inputs after successful upload
                setRegistrationDoc(null);
                setGstDoc(null);
                // Reload company data to get updated info
                await loadCompanyData(token);
            } else {
                alert(response.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleEditInternship = (internship) => {
        setEditingInternship(internship);

        // Populate form with internship data
        setJobFormData({
            title: internship.title || '',
            location: internship.location || '',
            duration: internship.duration || '3 months',
            description: internship.description || '',
            requirements: Array.isArray(internship.requirements) ? internship.requirements : [],
            responsibilities: Array.isArray(internship.responsibilities)
                ? internship.responsibilities.join('\n')
                : (internship.responsibilities || ''),
            salary: internship.stipend || '',
            stipend: internship.stipend || '',
            type: internship.type || 'Internship',
            category: internship.category || 'Technology',
            skills: Array.isArray(internship.skills) ? internship.skills.join(', ') : (internship.skills || ''),
            openings: internship.openings?.toString() || '1',
            applicationDeadline: internship.applicationDeadline
                ? new Date(internship.applicationDeadline).toISOString().split('T')[0]
                : ''
        });

        // Switch to post tab
        setActiveTab('post');
    };

    const handleUpdateInternship = async (e) => {
        e.preventDefault();

        if (!editingInternship) {
            return;
        }

        setIsUpdatingInternship(true);

        try {
            const token = localStorage.getItem('companyToken');
            if (!token) {
                navigate('/company/login');
                return;
            }

            // Parse responsibilities from responsibilities field - split by newlines
            const responsibilities = jobFormData.responsibilities
                ? jobFormData.responsibilities.split('\n').filter(r => r.trim())
                : [];

            // Parse skills from comma-separated string
            const skills = jobFormData.skills
                ? jobFormData.skills.split(',').map(s => s.trim()).filter(s => s)
                : [];

            // Process requirements array - filter out empty strings
            const requirements = Array.isArray(jobFormData.requirements)
                ? jobFormData.requirements.filter(r => r && r.trim()).map(r => r.trim())
                : [];

            // Validate required fields
            if (!jobFormData.title || !jobFormData.location || !jobFormData.duration ||
                !jobFormData.description || !jobFormData.category || !jobFormData.salary) {
                alert('Please fill all required fields');
                setIsUpdatingInternship(false);
                return;
            }

            // Build internship data object matching backend schema exactly
            const internshipData = {
                title: jobFormData.title?.trim() || '',
                location: jobFormData.location?.trim() || '',
                duration: jobFormData.duration?.trim() || '',
                stipend: (jobFormData.salary?.trim() || jobFormData.stipend?.trim() || '').replace(/\/month$/i, '') + '/month',
                type: jobFormData.type || 'Internship',
                category: jobFormData.category || 'Technology',
                description: jobFormData.description?.trim() || '',
                requirements: requirements,
                responsibilities: Array.isArray(responsibilities) && responsibilities.length > 0 ? responsibilities : [],
                skills: Array.isArray(skills) && skills.length > 0 ? skills : [],
                isRemote: jobFormData.location?.toLowerCase().includes('remote') || false,
                openings: parseInt(jobFormData.openings) || 1,
                applicationDeadline: jobFormData.applicationDeadline ? new Date(jobFormData.applicationDeadline).toISOString() : null
            };

            console.log('Frontend sending update data:', JSON.stringify(internshipData, null, 2));
            const response = await internshipAPI.update(token, editingInternship._id, internshipData);

            if (response.success) {
                alert('Internship updated successfully!');
                setEditingInternship(null);
                setJobFormData({
                    title: '',
                    location: '',
                    duration: '3 months',
                    description: '',
                    requirements: [],
                    responsibilities: '',
                    salary: '',
                    stipend: '',
                    type: 'Internship',
                    category: 'Technology',
                    skills: '',
                    openings: '1',
                    applicationDeadline: ''
                });
                setActiveTab('my-internships');

                // Reload internships
                await loadCompanyData(token);
            } else {
                alert(response.message || 'Failed to update internship');
            }
        } catch (error) {
            console.error('Error updating internship:', error);
            alert(error.message || 'Failed to update internship. Please try again.');
        } finally {
            setIsUpdatingInternship(false);
        }
    };

    const handleDeleteInternship = async (internshipId) => {
        if (!confirm('Are you sure you want to delete this internship?')) {
            return;
        }

        setIsDeletingInternship(internshipId);

        try {
            const token = localStorage.getItem('companyToken');
            if (!token) {
                navigate('/company/login');
                return;
            }

            const response = await internshipAPI.delete(token, internshipId);

            if (response.success) {
                alert('Internship deleted successfully!');
                // Reload internships
                await loadCompanyData(token);
            } else {
                alert(response.message || 'Failed to delete internship');
            }
        } catch (error) {
            console.error('Error deleting internship:', error);
            alert(error.message || 'Failed to delete internship. Please try again.');
        } finally {
            setIsDeletingInternship(null);
        }
    };

    const tabs = [
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'post', name: 'Post Job' },
        { id: 'my-internships', name: 'My Internships' },
        { id: 'applications', name: 'Applications' },
        { id: 'profile', name: 'Profile' }
    ];

    const statsData = [
        { label: 'Total Jobs Posted', value: stats.totalJobsPosted.toString(), change: `${myInternships.length} active` },
        { label: 'Active Applications', value: stats.activeApplications.toString(), change: `${applications.filter(a => a.status === 'pending').length} pending` },
        { label: 'Hired Candidates', value: stats.hiredCandidates.toString(), change: `${stats.hiredCandidates} total` },
        { label: 'Response Rate', value: stats.responseRate, change: 'Average per job' }
    ];

    const recentApplications = applications
        .sort((a, b) => new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt))
        .map(app => {
            // Map backend status to display status
            let displayStatus = 'Pending';
            let statusColor = 'bg-blue-100 text-blue-800';

            if (app.status === 'pending') {
                displayStatus = 'New';
                statusColor = 'bg-blue-100 text-blue-800';
            } else if (app.status === 'shortlisted') {
                displayStatus = 'Shortlisted';
                statusColor = 'bg-yellow-100 text-yellow-800';
            } else if (app.status === 'rejected') {
                displayStatus = 'Rejected';
                statusColor = 'bg-red-100 text-red-800';
            } else if (app.status === 'hired') {
                displayStatus = 'Hired';
                statusColor = 'bg-green-100 text-green-800';
            } else if (app.status === 'withdrawn') {
                displayStatus = 'Withdrawn';
                statusColor = 'bg-gray-100 text-gray-800';
            }

            return {
                id: app._id,
                _id: app._id,
                candidate: app.name || `${app.user?.firstName || ''} ${app.user?.lastName || ''}`.trim() || 'N/A',
                position: app.internship?.title || 'N/A',
                status: app.status || 'pending',
                displayStatus: displayStatus,
                statusColor: statusColor,
                appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() :
                    app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A',
                experience: app.experience || 'N/A',
                email: app.email || app.user?.email || '',
                phone: app.phone || app.user?.phone || '',
                resume: app.resume || null, // Resume object with url, fileName, uploadedAt
                originalApp: app // Keep original for reference
            };
        });

    const renderDashboard = () => (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {statsData.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg"
                    >
                        <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                        <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Recent Applications</h3>
                    <Link
                        to="#"
                        className="text-blue-600 text-sm font-medium hover:text-blue-800"
                    >
                        View All
                    </Link>
                </div>
                <div className="space-y-3">
                    {recentApplications.map((app, index) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div>
                                <h4 className="font-semibold text-gray-800">{app.candidate}</h4>
                                <p className="text-sm text-gray-600">{app.position}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                    app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                    {app.status}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">{app.appliedDate}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const renderPostJob = () => (
        <motion.div
            key="post"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="relative">
                {/* Inner Container */}
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                    {/* Form Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-3xl font-bold text-gray-800 text-center py-4">
                            {editingInternship ? 'Edit Internship' : 'Post New Internship'}
                        </h3>
                        {editingInternship && (
                            <div className="text-center mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingInternship(null);
                                        setJobFormData({
                                            title: '',
                                            location: '',
                                            duration: '3 months',
                                            description: '',
                                            requirements: '',
                                            salary: '',
                                            stipend: '',
                                            type: 'Internship',
                                            category: 'Technology',
                                            skills: '',
                                            openings: '1',
                                            applicationDeadline: ''
                                        });
                                    }}
                                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                                >
                                    Cancel editing
                                </button>
                            </div>
                        )}
                    </motion.div>

                    <form onSubmit={handlePostJob} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Job Title</label>
                            <motion.div
                                className="relative"
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Input Border Effect */}
                                <motion.div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl opacity-0"
                                    whileFocus={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <input
                                    type="text"
                                    name="title"
                                    value={jobFormData.title}
                                    onChange={handleJobFormChange}
                                    required
                                    className="relative w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300"
                                    placeholder="e.g., Frontend Developer Intern"
                                />
                            </motion.div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
                            <motion.div
                                className="relative"
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl opacity-0"
                                    whileFocus={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <input
                                    type="text"
                                    name="location"
                                    value={jobFormData.location}
                                    onChange={handleJobFormChange}
                                    required
                                    className="relative w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300"
                                    placeholder="e.g., Mumbai, India"
                                />
                            </motion.div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                            <select
                                name="duration"
                                value={jobFormData.duration}
                                onChange={handleJobFormChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="3 months">3 months</option>
                                <option value="6 months">6 months</option>
                                <option value="1 year">1 year</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Salary/Stipend</label>
                            <input
                                type="text"
                                name="salary"
                                value={jobFormData.salary}
                                onChange={handleJobFormChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., ₹15,000/month"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={jobFormData.description}
                                onChange={handleJobFormChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Describe the internship role and requirements..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select
                                name="category"
                                value={jobFormData.category}
                                onChange={handleJobFormChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Category</option>
                                <option value="Technology">Technology</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Finance">Finance</option>
                                <option value="Legal">Legal</option>
                                <option value="Operations">Operations</option>
                                <option value="Content">Content</option>
                                <option value="Sales">Sales</option>
                                <option value="HR">HR</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                            <select
                                name="type"
                                value={jobFormData.type}
                                onChange={handleJobFormChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Internship">Internship</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Openings *</label>
                            <input
                                type="number"
                                name="openings"
                                value={jobFormData.openings}
                                onChange={handleJobFormChange}
                                required
                                min="1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Number of positions"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                            <input
                                type="text"
                                name="skills"
                                value={jobFormData.skills}
                                onChange={handleJobFormChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., React, Node.js, MongoDB"
                            />
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                <svg className="w-5 h-5 inline-block mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Requirements
                            </label>
                            <div className="space-y-2">
                                {jobFormData.requirements.map((requirement, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={requirement}
                                            onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter requirement (e.g., Bachelor's degree, 2+ years experience)"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('requirements', index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('requirements')}
                                    className="w-full mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Requirement
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Add qualification requirements, experience needed, etc.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
                            <textarea
                                name="responsibilities"
                                value={jobFormData.responsibilities}
                                onChange={handleJobFormChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="List the responsibilities (one per line). Each line will be treated as a separate responsibility..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Each line will be treated as a separate responsibility</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Application Deadline <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="applicationDeadline"
                                value={jobFormData.applicationDeadline}
                                onChange={handleJobFormChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Select application deadline"
                            />
                            <p className="text-xs text-gray-500 mt-1">Internships with expired deadlines will not be shown to users</p>
                        </div>
                        {/* Submit Button */}
                        <div className="mt-8 flex justify-center md:justify-start">
                            <button
                                type="submit"
                                disabled={isPostingJob || isUpdatingInternship}
                                className={`w-full md:w-auto md:px-12 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 ${(isPostingJob || isUpdatingInternship)
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg'
                                    }`}
                            >
                                {isPostingJob ? 'Posting...' : isUpdatingInternship ? 'Updating...' : editingInternship ? 'Update Internship' : 'Post Internship'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );

    const renderMyInternships = () => (
        <motion.div
            key="my-internships"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">My Internships</h3>
                    <span className="text-sm text-gray-600">
                        {myInternships.length} {myInternships.length === 1 ? 'internship' : 'internships'} posted
                    </span>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading internships...</p>
                    </div>
                ) : myInternships.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 text-lg mb-2">No internships posted yet</p>
                        <p className="text-gray-500 text-sm mb-4">Start by posting your first internship!</p>
                        <button
                            onClick={() => setActiveTab('post')}
                            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            Post Your First Internship
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myInternships.map((internship, index) => (
                            <motion.div
                                key={internship._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-xl font-bold text-gray-800">{internship.title}</h4>
                                                    {internship.applicationDeadline && new Date(internship.applicationDeadline) < new Date() && (
                                                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold border border-red-300">
                                                            Deadline Expired
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {internship.location}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {internship.duration}
                                                    </span>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                        {internship.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-3 line-clamp-2">{internship.description}</p>
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            {Array.isArray(internship.skills) && internship.skills.length > 0 && (
                                                internship.skills.slice(0, 5).map((skill, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                                                        {skill}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="font-semibold text-green-600">₹{internship.stipend || 'Not specified'}</span>
                                            <span>{internship.openings || 1} {internship.openings === 1 ? 'opening' : 'openings'}</span>
                                            <span>Posted {new Date(internship.postedDate || internship.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <button
                                            onClick={() => handleEditInternship(internship)}
                                            disabled={isDeletingInternship === internship._id}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteInternship(internship._id)}
                                            disabled={isDeletingInternship === internship._id}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isDeletingInternship === internship._id ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );

    const renderApplications = () => {
        // For applications tab, show all applications (not just recent 10)
        const allApplications = applications
            .sort((a, b) => new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt))
            .map(app => {
                // Map backend status to display status
                let displayStatus = 'Pending';
                let statusColor = 'bg-blue-100 text-blue-800';

                if (app.status === 'pending') {
                    displayStatus = 'New';
                    statusColor = 'bg-blue-100 text-blue-800';
                } else if (app.status === 'shortlisted') {
                    displayStatus = 'Shortlisted';
                    statusColor = 'bg-yellow-100 text-yellow-800';
                } else if (app.status === 'rejected') {
                    displayStatus = 'Rejected';
                    statusColor = 'bg-red-100 text-red-800';
                } else if (app.status === 'hired') {
                    displayStatus = 'Hired';
                    statusColor = 'bg-green-100 text-green-800';
                } else if (app.status === 'withdrawn') {
                    displayStatus = 'Withdrawn';
                    statusColor = 'bg-gray-100 text-gray-800';
                }

                return {
                    id: app._id,
                    _id: app._id,
                    candidate: app.name || `${app.user?.firstName || ''} ${app.user?.lastName || ''}`.trim() || 'N/A',
                    position: app.internship?.title || 'N/A',
                    status: app.status || 'pending',
                    displayStatus: displayStatus,
                    statusColor: statusColor,
                    appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() :
                        app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A',
                    experience: app.experience || 'N/A',
                    email: app.email || app.user?.email || '',
                    phone: app.phone || app.user?.phone || '',
                    resume: app.resume || null,
                    originalApp: app
                };
            });

        return (
            <motion.div
                key="applications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                {allApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-600 text-lg mb-2">No applications yet</p>
                        <p className="text-gray-500 text-sm">Applications will appear here when candidates apply to your internships.</p>
                    </div>
                ) : (
                    allApplications.map((app, index) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{app.candidate}</h3>
                                    <p className="text-gray-600">{app.position}</p>
                                    <p className="text-sm text-gray-500">Applied on {app.appliedDate}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.statusColor || 'bg-blue-100 text-blue-800'}`}>
                                    {app.displayStatus || app.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDownloadResume(app)}
                                    disabled={!app.resume?.url}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${app.resume?.url
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        }`}
                                >
                                    Download Resume
                                </motion.button>

                                {app.status === 'pending' && (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleApplicationAction(app.id, 'shortlist')}
                                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700"
                                        >
                                            Under Review
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleApplicationAction(app.id, 'hire')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                        >
                                            Accept
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleApplicationAction(app.id, 'reject')}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                                        >
                                            Reject
                                        </motion.button>
                                    </>
                                )}

                                {app.status === 'shortlisted' && (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleApplicationAction(app.id, 'hire')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                        >
                                            Accept
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleApplicationAction(app.id, 'reject')}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                                        >
                                            Reject
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>
        );
    };

    const renderProfile = () => {
        if (isLoading) {
            return (
                <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center py-20"
                >
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading profile...</p>
                    </div>
                </motion.div>
            );
        }

        if (!companyProfile) {
            return (
                <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <p className="text-gray-600">Unable to load company profile</p>
                </motion.div>
            );
        }

        return (
            <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Company Profile</h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                            <input
                                type="text"
                                name="companyName"
                                value={companyProfile.companyName || ''}
                                onChange={handleProfileChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={companyProfile.email || ''}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                            <input
                                type="text"
                                name="industry"
                                value={companyProfile.industry || ''}
                                onChange={handleProfileChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Size *</label>
                            <select
                                name="companySize"
                                value={companyProfile.companySize || ''}
                                onChange={handleProfileChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select company size</option>
                                <option value="1-10 employees">1-10 employees</option>
                                <option value="11-50 employees">11-50 employees</option>
                                <option value="51-200 employees">51-200 employees</option>
                                <option value="201-500 employees">201-500 employees</option>
                                <option value="500+ employees">500+ employees</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={companyProfile.location || ''}
                                onChange={handleProfileChange}
                                placeholder="City, State"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                            <input
                                type="text"
                                name="gstNumber"
                                value={companyProfile.gstNumber || ''}
                                onChange={handleProfileChange}
                                placeholder="15 characters"
                                maxLength={15}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                            <input
                                type="url"
                                name="website"
                                value={companyProfile.website || ''}
                                onChange={handleProfileChange}
                                placeholder="https://example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={companyProfile.description || ''}
                                onChange={handleProfileChange}
                                rows={4}
                                placeholder="Describe your company..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>
                        
                        {/* Document Upload Section */}
                        <div className="border-t border-gray-200 pt-4 mt-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Company Documents</h4>
                            
                            {/* Company Registration Certificate */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Registration Certificate *
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        name="registrationCertificate"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={(e) => setRegistrationDoc(e.target.files[0])}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                    {companyInfo?.documents?.registrationCertificate?.url && (
                                        <a
                                            href={companyInfo.documents.registrationCertificate.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            View Current
                                        </a>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Upload PDF, DOC, DOCX, JPEG, or PNG (max 10MB)</p>
                            </div>
                            
                            {/* GST Certificate */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    GST Registration Certificate *
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        name="gstCertificate"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={(e) => setGstDoc(e.target.files[0])}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                    {companyInfo?.documents?.gstCertificate?.url && (
                                        <a
                                            href={companyInfo.documents.gstCertificate.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            View Current
                                        </a>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Upload PDF, DOC, DOCX, JPEG, or PNG (max 10MB)</p>
                            </div>
                        </div>
                        
                        <motion.button
                            type="submit"
                            disabled={isUpdatingProfile}
                            whileHover={!isUpdatingProfile ? { scale: 1.02 } : {}}
                            whileTap={!isUpdatingProfile ? { scale: 0.98 } : {}}
                            className={`w-full md:w-auto md:px-8 bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors ${isUpdatingProfile
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'hover:bg-blue-700'
                                }`}
                        >
                            {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        );
    };

    const companyEmail = localStorage.getItem('companyEmail') || 'company@example.com';
    const companyName = localStorage.getItem('companyName') || 'Your Company';

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-gray-200 text-gray-900 p-4 sticky top-0 z-40 shadow-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Company Dashboard</h1>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('userType');
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('companyName');
                            localStorage.removeItem('companyEmail');
                            localStorage.removeItem('companyToken');
                            localStorage.removeItem('companyData');
                            navigate('/company/login');
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-semibold border border-gray-300"
                    >
                        Edit
                    </button>
                </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold">Company Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => {
                                localStorage.removeItem('userType');
                                localStorage.removeItem('isLoggedIn');
                                localStorage.removeItem('companyName');
                                localStorage.removeItem('companyEmail');
                                localStorage.removeItem('companyToken');
                                localStorage.removeItem('companyData');
                                navigate('/company/login');
                            }}
                            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 border-b border-gray-200">
                <div className="px-4 md:px-6 max-w-7xl mx-auto">
                    <div className="flex space-x-2 py-2 md:py-3">
                        {tabs.map((tab, index) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative py-2.5 md:py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 whitespace-nowrap px-4 md:px-5 ${activeTab === tab.id
                                    ? 'text-white'
                                    : 'text-gray-800'
                                    }`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Active Tab Background */}
                                {activeTab === tab.id && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md"
                                        layoutId="activeTab"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30
                                        }}
                                    />
                                )}

                                {/* Tab Content */}
                                <span className="relative z-10 block">
                                    {tab.name}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 max-w-7xl mx-auto pb-20 md:pb-6">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'post' && renderPostJob()}
                {activeTab === 'my-internships' && renderMyInternships()}
                {activeTab === 'applications' && renderApplications()}
                {activeTab === 'profile' && renderProfile()}
            </div>

            {/* Document Upload Required Modal */}
            {showUploadModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowUploadModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-2">
                            Documents Required
                        </h3>

                        {/* Message */}
                        <p className="text-gray-600 text-center mb-6">
                            Please upload your <strong>Company Registration Certificate</strong> and <strong>GST Registration Certificate</strong> to post internships.
                        </p>

                        {/* Missing Documents List */}
                        <div className="bg-red-50 rounded-lg p-4 mb-6">
                            <p className="text-sm font-medium text-red-800 mb-2">Missing Documents:</p>
                            <ul className="text-sm text-red-700 space-y-1">
                                {!companyInfo?.documents?.registrationCertificate?.url && (
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Company Registration Certificate
                                    </li>
                                )}
                                {!companyInfo?.documents?.gstCertificate?.url && (
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        GST Registration Certificate
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setActiveTab('profile');
                                }}
                                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                            >
                                Upload Documents
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

        </div>
    );
};

export default CompanyInternshipsPage;
