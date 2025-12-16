import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { contactAPI } from '../utils/api';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsLoading(true);

        try {
            const response = await contactAPI.submitContact(formData);
            
            if (response.success) {
                setSuccess(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    setSuccess(false);
                }, 5000);
            } else {
                setError(response.message || 'Failed to send message. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-hidden md:flex md:items-center md:justify-center">
            {/* Mobile View - Full Width and Height */}
            <div className="md:hidden w-full h-screen flex flex-col">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white h-full flex flex-col overflow-hidden"
                >
                    {/* Back to Home Button - Top */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="p-4 pb-2"
                    >
                        <Link 
                            to="/" 
                            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>
                    </motion.div>

                    {/* Header */}
                    <div className="text-center px-4 pb-2">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Contact Us</h1>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mx-4 mb-3 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
                            Thank you for contacting us! We will get back to you soon.
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mx-4 mb-3 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form - Full Width and Height */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="flex-1 flex flex-col px-4 pb-4 space-y-3"
                    >
                        <div className="flex-shrink-0">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex-1 min-h-0 flex flex-col">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none flex-1"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending...' : 'Send Message'}
                        </button>
                    </motion.form>
                </motion.div>
            </div>

            {/* Desktop/Webview - Wider with 2 columns */}
            <div className="hidden md:flex md:items-center md:justify-center w-full h-screen max-w-4xl mx-auto py-6 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 flex flex-col w-full max-h-[80vh] overflow-hidden"
                >
                    {/* Back to Home Button - Top */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="mb-3 flex-shrink-0"
                    >
                        <Link 
                            to="/" 
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>
                    </motion.div>

                    {/* Header */}
                    <div className="text-center mb-4 flex-shrink-0">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Us</h1>
                        <p className="text-base text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
                            Thank you for contacting us! We will get back to you soon.
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form - 2 columns layout */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="flex-1 flex flex-col min-h-0"
                    >
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex-shrink-0">
                                <label htmlFor="name-desk" className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                                <input
                                    type="text"
                                    id="name-desk"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex-shrink-0">
                                <label htmlFor="email-desk" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    id="email-desk"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex-shrink-0">
                                <label htmlFor="phone-desk" className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                                <input
                                    type="tel"
                                    id="phone-desk"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex-shrink-0">
                                <label htmlFor="subject-desk" className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    id="subject-desk"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 flex flex-col mb-4">
                            <label htmlFor="message-desk" className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                            <textarea
                                id="message-desk"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="2"
                                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none flex-1"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg text-base font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending...' : 'Send Message'}
                        </button>
                    </motion.form>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;

