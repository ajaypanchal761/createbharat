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
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
                        <p className="text-gray-600">Welcome to CreateBharat, a digital platform powered by CreateBharat Foundation</p>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mb-8"
                        >
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Welcome to CreateBharat, a digital platform powered by CreateBharat Foundation, a registered non-profit organization dedicated to promoting entrepreneurship, innovation, and skill development among youth in India.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                By accessing or using our mobile application ("App"), website, or services, you agree to comply with the following Terms and Conditions.
                                Please read them carefully before using the platform.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1️⃣ General Terms & User Agreement</h2>
                            
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">1.1 By registering or using CreateBharat, you confirm that:</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>You are at least 18 years of age or using the app under parental/guardian supervision.</li>
                                <li>You agree to provide accurate, current, and complete information during registration.</li>
                                <li>You understand that CreateBharat operates as a facilitation and learning platform, not a financial institution or government body.</li>
                            </ul>

                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                                1.2 Your use of this platform is subject to all applicable laws and regulations of India.
                                Any violation may result in termination of your access.
                            </p>

                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                                1.3 CreateBharat reserves the right to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Modify, suspend, or terminate services at any time without prior notice.</li>
                                <li>Change, update, or revise these terms when required.</li>
                            </ul>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2️⃣ Services Overview</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">CreateBharat offers multiple services through its app and website, including but not limited to:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Entrepreneurship & Startup Training</li>
                                <li>Internship Programs & Certification</li>
                                <li>Mentorship & Expert Consultation</li>
                                <li>Legal & Compliance Support</li>
                                <li>Loans, Funding & Financial Assistance</li>
                                <li>Website, App, and Business Development Services</li>
                            </ul>

                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                                2.1 These services are a mix of free, subsidized, and paid plans depending on the module or partner involved.
                            </p>

                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                                2.2 Any government-related service (e.g. MSME, GST, FSSAI registration) will be processed through official portals; CreateBharat acts only as a guide or facilitator.
                            </p>

                            <p className="text-gray-700 leading-relaxed mb-4 mt-4">
                                2.3 Training programs or mentorship sessions are educational in nature and not guaranteed employment or funding.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3️⃣ User Responsibilities & Code of Conduct</h2>
                            
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">3.1 Users agree not to misuse the app or engage in activities that may:</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Infringe copyrights, trademarks, or intellectual property.</li>
                                <li>Post false, misleading, or defamatory information.</li>
                                <li>Use CreateBharat to promote illegal, fraudulent, or offensive content.</li>
                                <li>Share another user's private data without consent.</li>
                            </ul>

                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                                3.2 Users must maintain confidentiality of their login credentials.
                                CreateBharat is not responsible for loss due to unauthorized account access.
                            </p>

                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                                3.3 In mentorship or internship sections:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Professional communication & respectful conduct are mandatory.</li>
                                <li>Any monetary transaction outside CreateBharat's approved system is at user's own risk.</li>
                            </ul>

                            <p className="text-gray-700 leading-relaxed mb-4 mt-4">
                                3.4 All uploaded business ideas, pitch decks, or documents remain user's intellectual property, but CreateBharat may use anonymized data for research, analytics, or showcasing success stories.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4️⃣ Payments, Refunds & Subscriptions</h2>
                            
                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                                4.1 Some services (training, mentorship, legal filing, app development, etc.) may require subscription or one-time payment.
                            </p>

                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                                4.2 Payments can be made through CreateBharat's in-app gateway, UPI, or partner portals.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.3 Refund Policy:</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Refunds are only applicable for failed transactions or duplicate payments.</li>
                                <li>Once a service or course has started, no refund shall be issued.</li>
                                <li>In case of any dispute, users can contact our support team within 7 working days of payment.</li>
                            </ul>

                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                                4.4 CreateBharat Foundation is a non-profit organization, and any fees collected are used for operational & training purposes.
                            </p>

                            <p className="text-gray-700 leading-relaxed mb-4 mt-4">
                                4.5 GST or other applicable taxes may be added as per Indian law.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5️⃣ Data Privacy, Security & Intellectual Property</h2>
                            
                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                                5.1 All user data (name, email, contact, business info) is collected only for:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Account creation, service delivery, and communication purposes.</li>
                                <li>Analytics and service improvement (without sharing personal details).</li>
                            </ul>

                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                                5.2 CreateBharat never sells or trades user data to third parties.
                                However, relevant details may be shared with verified partners (banks, mentors, CA, or government portals) only after user consent.
                            </p>

                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                                5.3 The platform uses standard encryption and secure payment gateways to ensure data protection.
                            </p>

                            <p className="text-gray-700 leading-relaxed mb-4 mt-4">
                                5.4 All logos, branding, design, content, and course materials are the intellectual property of CreateBharat Foundation.
                                Reproduction or redistribution without permission is prohibited.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6️⃣ Limitation of Liability & Dispute Resolution</h2>
                            
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">6.1 CreateBharat Foundation and its affiliates shall not be liable for:</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Loss of data, delay in service, or technical issues beyond control.</li>
                                <li>Third-party service errors (banks, payment gateways, or legal consultants).</li>
                                <li>Business losses, missed opportunities, or indirect damages.</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">6.2 In case of any dispute:</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Users agree to resolve issues amicably through written communication.</li>
                                <li>If unresolved, disputes shall be subject to jurisdiction of Jamshedpur, Jharkhand (India) courts only.</li>
                            </ul>

                            <p className="text-gray-700 leading-relaxed mb-4 mt-4">
                                6.3 The Foundation's total liability, under any circumstances, shall not exceed the total amount paid by the user for that specific service.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7️⃣ Communication & Support</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">You may receive notifications via email, SMS, or in-app alerts regarding:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Account activity</li>
                                <li>Training updates</li>
                                <li>Policy changes</li>
                                <li>Offers or partnership programs</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mb-3 mt-4">For any support, contact:</p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 mb-2">📧 createbharatofficial@gmail.com</p>
                                <p className="text-gray-700">🌐 www.createbharat.com</p>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8️⃣ Termination of Access</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">CreateBharat reserves the right to suspend or delete user accounts that:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Violate terms of use</li>
                                <li>Engage in fraudulent activities</li>
                                <li>Spread misinformation or misuse services</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Once terminated, user access to all premium features and records may be permanently removed.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9️⃣ Governing Law</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                These Terms shall be governed and interpreted under the laws of the Republic of India,
                                and all legal proceedings shall fall under the jurisdiction of Jamshedpur, Jharkhand.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.1 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔟 Acceptance of Terms</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                By using CreateBharat App, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
                                If you do not agree, please discontinue using the platform.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                            className="mb-8"
                        >
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-gray-700 font-semibold">✅ Copyright © 2025 – CreateBharat Foundation.</p>
                                <p className="text-gray-700">All Rights Reserved.</p>
                            </div>
                        </motion.section>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.3 }}
                        className="text-center mt-8 pt-8 border-t border-gray-200"
                    >
                        <Link 
                            to="/" 
                            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        >
                            Back to Home
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsPage;
