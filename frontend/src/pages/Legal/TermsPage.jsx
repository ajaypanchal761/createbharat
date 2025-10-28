import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
                        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                By accessing and using CreateBharat, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Permission is granted to temporarily download one copy of CreateBharat per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Modify or copy the materials</li>
                                <li>Use the materials for any commercial purpose or for any public display</li>
                                <li>Attempt to reverse engineer any software contained on the website</li>
                                <li>Remove any copyright or other proprietary notations from the materials</li>
                            </ul>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Service Description</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                CreateBharat provides a platform for entrepreneurs and businesses to access various services including:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Government loan schemes and financial assistance</li>
                                <li>Internship opportunities and career guidance</li>
                                <li>Legal services and consultation</li>
                                <li>Mentorship programs and business guidance</li>
                                <li>Training programs and skill development</li>
                                <li>Business analytics and insights</li>
                            </ul>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                As a user of CreateBharat, you agree to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Provide accurate and complete information</li>
                                <li>Maintain the confidentiality of your account credentials</li>
                                <li>Use the service only for lawful purposes</li>
                                <li>Not engage in any fraudulent or deceptive practices</li>
                                <li>Respect the intellectual property rights of others</li>
                            </ul>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy Policy</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                In no event shall CreateBharat or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CreateBharat, even if CreateBharat or an authorized representative has been notified orally or in writing of the possibility of such damage.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you have any questions about these Terms and Conditions, please contact us at:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700"><strong>Email:</strong> support@createbharat.com</p>
                                <p className="text-gray-700"><strong>Phone:</strong> +91-XXX-XXXX-XXXX</p>
                                <p className="text-gray-700"><strong>Address:</strong> CreateBharat Headquarters, India</p>
                            </div>
                        </motion.section>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="text-center mt-8 pt-8 border-t border-gray-200"
                    >
                        <Link 
                            to="/signup" 
                            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        >
                            Back to Sign Up
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsPage;
