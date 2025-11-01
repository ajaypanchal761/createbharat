import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
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
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                        <p className="text-gray-600">Welcome to CreateBharat, a digital initiative by CreateBharat Foundation</p>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mb-8"
                        >
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Welcome to CreateBharat, a digital initiative by CreateBharat Foundation, a registered non-profit organization committed to empowering youth, entrepreneurs, and startups in India through education, mentorship, training, and development.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Your privacy is important to us. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our mobile app, website, or any related services ("Platform").
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                By accessing or using CreateBharat, you agree to this Privacy Policy.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1️⃣ Information We Collect</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We collect information to provide better services to all users. The data collected may include:
                            </p>
                            
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">(A) Personal Information</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">When you register or use the app, we may collect:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Full Name</li>
                                <li>Mobile Number</li>
                                <li>Email Address</li>
                                <li>Gender, Age (optional)</li>
                                <li>City / State</li>
                                <li>Business / Organization Name (if applicable)</li>
                                <li>Profile Photo (optional)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">(B) Usage Information</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>How you interact with the app (buttons clicked, pages visited, etc.)</li>
                                <li>Date and time of access</li>
                                <li>Device type, model, operating system, and app version</li>
                                <li>IP address (for security and analytics)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">(C) Documents & Uploads (optional)</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">If you apply for any service (training, legal, or loan-related), we may collect:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Business registration proof (MSME, GST, etc.)</li>
                                <li>Resume or internship documents</li>
                                <li>Business plans, pitch decks, or reports</li>
                                <li>Government ID proofs (only when explicitly required and consented)</li>
                            </ul>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2️⃣ How We Use Your Information</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We use the collected information strictly for improving user experience and service delivery.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-3">Your information is used to:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Create and manage your user account</li>
                                <li>Provide training, mentorship, and internship services</li>
                                <li>Process payments and generate certificates</li>
                                <li>Offer personalized business recommendations</li>
                                <li>Contact you for service updates, reminders, and support</li>
                                <li>Improve our platform and develop new features</li>
                                <li>Comply with legal obligations and prevent misuse</li>
                            </ul>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                                <p className="text-gray-700"><strong>💡 Note:</strong> We do not sell, rent, or trade your personal data to any third party.</p>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3️⃣ Data Sharing and Disclosure</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Your personal data is shared only when required and with your explicit consent.
                            </p>
                            
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">(A) With Verified Partners</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">We may share limited details with:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Mentors and trainers (for mentorship sessions)</li>
                                <li>Partner banks (for current account or loan facilitation)</li>
                                <li>Chartered Accountants / Legal advisors (for MSME, GST, Trademark filings)</li>
                                <li>Internship or training partner organizations</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mb-4">All partners sign a confidentiality agreement before receiving user data.</p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">(B) With Government Agencies</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Only when you request a government-linked service (MSME, PMEGP, Startup India, etc.),
                                we may share relevant information directly through official portals for verification.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">(C) With Legal Authorities</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If required by law, court order, or government investigation,
                                we may disclose your data to comply with applicable Indian laws.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4️⃣ Payment & Transaction Security</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>All payments are processed through secure, RBI-approved payment gateways (e.g. Razorpay, Cashfree, Paytm).</li>
                                <li>CreateBharat does not store your credit/debit card details, CVV, or UPI PIN.</li>
                                <li>All financial transactions are encrypted and PCI-DSS compliant.</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If a payment fails, the amount is automatically refunded within 7 working days as per bank policy.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5️⃣ Data Protection & Storage</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">We take appropriate technical and organizational measures to secure your information:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>SSL encryption for all communications</li>
                                <li>Secure cloud hosting with firewall & DDoS protection</li>
                                <li>Access control – only authorized team members can access your data</li>
                                <li>Regular security audits & data backups</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Data is stored on secure servers located in India and governed by Indian data protection laws.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6️⃣ Your Rights as a User</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">You have full control over your personal information.</p>
                            <p className="text-gray-700 leading-relaxed mb-3">You can at any time:</p>
                            <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Access your personal data through your profile</li>
                                <li>Edit / Update incorrect information</li>
                                <li>Request Deletion of your data (by emailing us)</li>
                                <li>Withdraw Consent for non-mandatory data sharing</li>
                                <li>Opt-Out of promotional messages or newsletters</li>
                            </ol>
                            <p className="text-gray-700 leading-relaxed mb-3">To request deletion or modification, contact:</p>
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="text-gray-700">📧 createbharatofficial@gmail.com</p>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">We will process such requests within 7–10 business days.</p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7️⃣ Cookies & Tracking Technologies</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Our app and website may use cookies or analytics tools (Google Analytics, Firebase)
                                    to understand usage patterns and improve functionality.</li>
                                <li>Cookies do not store personal data and can be disabled via device settings.</li>
                            </ul>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8️⃣ Third-Party Links & Services</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Our platform may contain links to third-party websites (government portals, learning platforms, payment gateways, etc.).
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                CreateBharat is not responsible for the privacy practices or content of such external sites.
                                We encourage you to read their privacy policies before sharing information.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9️⃣ Children's Privacy</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                CreateBharat is intended for users aged 16 years and above.
                                If a user below this age uses the platform, it must be under parental or institutional supervision.
                                We do not knowingly collect information from minors without consent.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.1 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔟 Data Retention Policy</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">We retain your data only as long as necessary:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>For service delivery</li>
                                <li>For legal or audit purposes</li>
                                <li>Or until you request deletion</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Once deleted, your information is permanently erased from our active systems within 30 days.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1️⃣1️⃣ Communication Policy</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">By using CreateBharat, you consent to receive:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Transactional messages (training updates, OTPs, status updates)</li>
                                <li>Administrative notifications (policy updates, system alerts)</li>
                                <li>Optional marketing or educational messages (can opt out anytime)</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                You can unsubscribe from promotional communications by clicking "Unsubscribe" in the email or contacting us directly.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.3 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1️⃣2️⃣ Data Breach Policy</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">In case of any data breach or unauthorized access:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>We will notify affected users within 72 hours</li>
                                <li>Take immediate corrective action</li>
                                <li>Report to relevant authorities if required under the IT Act</li>
                            </ul>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.4 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1️⃣3️⃣ Changes to This Policy</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                CreateBharat Foundation reserves the right to modify or update this Privacy Policy at any time.
                                The revised version will be posted on the app and website with an updated "Last Modified" date.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Continued use of the platform after updates constitutes your acceptance of the new terms.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.5 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1️⃣4️⃣ Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you have any questions, feedback, or complaints about our Privacy Policy or data handling, please contact:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="text-gray-700 mb-2">📧 createbharatofficial@gmail.com</p>
                                <p className="text-gray-700">🌐 www.createbharat.com</p>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.6 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1️⃣5️⃣ Legal Jurisdiction</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">All matters relating to privacy and data protection shall be governed under:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Information Technology Act, 2000 (India)</li>
                                <li>Rules under IT (Reasonable Security Practices and Procedures), 2011</li>
                                <li>Jurisdiction: Jamshedpur, Jharkhand, India</li>
                            </ul>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.7 }}
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
                        transition={{ duration: 0.6, delay: 1.8 }}
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

export default PrivacyPage;
