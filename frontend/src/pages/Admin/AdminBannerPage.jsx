import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
    FaImage, 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaSpinner,
    FaEye,
    FaEyeSlash,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';
import { adminBannerAPI } from '../../utils/api';

const VIEW = {
    LIST: 'list',
    CREATE: 'create',
    EDIT: 'edit'
};

const AdminBannerPage = () => {
    const [view, setView] = useState(VIEW.LIST);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        position: 0
    });
    const [editingId, setEditingId] = useState(null);

    const fetchBanners = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('adminToken');
            const response = await adminBannerAPI.getAllBanners(token);
            
            if (response.success) {
                setBanners(response.data || []);
            } else {
                setError(response.message || 'Failed to fetch banners');
            }
        } catch (err) {
            console.error('Error fetching banners:', err);
            setError(err.message || 'Unable to connect to backend server. Please make sure the server is running at http://localhost:5000');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (view === VIEW.LIST) {
            fetchBanners();
        }
    }, [view, fetchBanners]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreate = () => {
        setFormData({
            title: '',
            position: 0
        });
        setSelectedImage(null);
        setImagePreview(null);
        setEditingId(null);
        setView(VIEW.CREATE);
    };

    const handleEdit = (banner) => {
        setFormData({
            title: banner.title || '',
            position: banner.position || 0
        });
        setImagePreview(banner.imageUrl || null);
        setSelectedImage(null);
        setEditingId(banner._id);
        setView(VIEW.EDIT);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('adminToken');

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('position', formData.position.toString());

            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }

            let response;
            if (editingId) {
                response = await adminBannerAPI.updateBanner(token, editingId, formDataToSend);
            } else {
                response = await adminBannerAPI.createBanner(token, formDataToSend);
            }

            if (response.success) {
                setView(VIEW.LIST);
                fetchBanners();
            } else {
                setError(response.message || 'Failed to save banner');
            }
        } catch (err) {
            console.error('Error saving banner:', err);
            setError(err.message || 'Failed to save banner');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this banner?')) {
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await adminBannerAPI.deleteBanner(token, id);

            if (response.success) {
                fetchBanners();
            } else {
                setError(response.message || 'Failed to delete banner');
            }
        } catch (err) {
            console.error('Error deleting banner:', err);
            setError(err.message || 'Failed to delete banner');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (banner) => {
        try {
            const token = localStorage.getItem('adminToken');
            const formDataToSend = new FormData();
            formDataToSend.append('title', banner.title);
            formDataToSend.append('position', banner.position.toString());

            const response = await adminBannerAPI.updateBanner(token, banner._id, formDataToSend);
            
            if (response.success) {
                fetchBanners();
            }
        } catch (err) {
            console.error('Error toggling banner status:', err);
        }
    };

    const handleMovePosition = async (banner, direction) => {
        const newPosition = direction === 'up' ? banner.position - 1 : banner.position + 1;
        const otherBanner = banners.find(b => b.position === newPosition && b._id !== banner._id);
        
        if (otherBanner) {
            // Swap positions
            try {
                const token = localStorage.getItem('adminToken');
                const formData1 = new FormData();
                formData1.append('title', banner.title);
                formData1.append('position', newPosition.toString());
                
                const formData2 = new FormData();
                formData2.append('title', otherBanner.title);
                formData2.append('position', banner.position.toString());
                
                await Promise.all([
                    adminBannerAPI.updateBanner(token, banner._id, formData1),
                    adminBannerAPI.updateBanner(token, otherBanner._id, formData2)
                ]);
                fetchBanners();
            } catch (err) {
                console.error('Error moving banner:', err);
            }
        }
    };

    if (view === VIEW.CREATE || view === VIEW.EDIT) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-4 md:py-8 px-2 md:px-6">
                <div className="w-full max-w-4xl">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {editingId ? 'Edit Banner' : 'Create New Banner'}
                        </h1>
                        <button
                            onClick={() => setView(VIEW.LIST)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image *</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required={!editingId}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                            {imagePreview && (
                                <div className="mt-4">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                            <input
                                type="number"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setView(VIEW.LIST)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                            >
                                {loading ? <FaSpinner className="animate-spin inline mr-2" /> : null}
                                {editingId ? 'Update' : 'Create'} Banner
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-4 md:py-8 px-2 md:px-6">
            <div className="w-full max-w-7xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Banner Management</h1>
                        <p className="text-sm md:text-base text-gray-600">Manage banners for hero section</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                        <FaPlus />
                        <span>Add Banner</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {loading && banners.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <FaSpinner className="animate-spin text-4xl text-orange-600" />
                    </div>
                ) : banners.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <FaImage className="mx-auto text-6xl text-gray-300 mb-4" />
                        <p className="text-gray-600 mb-4">No banners found</p>
                        <button
                            onClick={handleCreate}
                            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                        >
                            Create First Banner
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {banners.map((banner) => (
                            <motion.div
                                key={banner._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-lg overflow-hidden"
                            >
                                <div className="relative h-48">
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 flex space-x-2">
                                        <button
                                            onClick={() => handleToggleActive(banner)}
                                            className={`p-2 rounded-full ${
                                                banner.isActive 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-gray-500 text-white'
                                            }`}
                                        >
                                            {banner.isActive ? <FaEye /> : <FaEyeSlash />}
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1">{banner.title}</h3>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <span>Position: {banner.position}</span>
                                        <span className={`px-2 py-1 rounded ${
                                            banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {banner.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleMovePosition(banner, 'up')}
                                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center"
                                        >
                                            <FaArrowUp />
                                        </button>
                                        <button
                                            onClick={() => handleMovePosition(banner, 'down')}
                                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center"
                                        >
                                            <FaArrowDown />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner._id)}
                                            className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBannerPage;

