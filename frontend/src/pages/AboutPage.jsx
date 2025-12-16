import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutPage = () => {
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
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">🏛 About Us – CreateBharat Foundation</h1>
                        <p className="text-gray-600 text-lg">Empowering India's Next Generation of Entrepreneurs 🇮🇳</p>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mb-8"
                        >
                            <p className="text-gray-700 leading-relaxed mb-4">
                                CreateBharat is a digital entrepreneurship ecosystem built to educate, empower, and enable youth to start, grow, and manage their own businesses with confidence.
                                We bridge the gap between skills and opportunities by combining learning, mentorship, legal support, funding guidance, and real business development — all within one integrated platform.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Founded under the vision of building "India's Next Founders,"
                                CreateBharat Foundation is a registered non-profit organization (NGO) based in Jamshedpur, Jharkhand, working in alignment with the objectives of MSME, Startup India, and Skill India Missions.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🚀 Our Mission</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">To create a new generation of skilled entrepreneurs by providing:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Practical startup training programs</li>
                                <li>Real-world internship experiences</li>
                                <li>Business mentorship & advisory support</li>
                                <li>Legal, financial, and digital tools for every small business</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We believe every young Indian has the potential to create, innovate, and lead,
                                and our mission is to make entrepreneurship simple, accessible, and affordable for all.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">💡 Our Vision</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                To make India a global hub of young entrepreneurs and innovators by 2030 —
                                where every student and professional has access to knowledge, tools, and networks needed to build their dream business.
                            </p>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🧩 What We Offer</h2>
                            
                            <div className="space-y-6 mb-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">1️⃣ Entrepreneurship Training:</h3>
                                    <p className="text-gray-700">
                                        Step-by-step startup modules covering idea validation, finance, legal setup, marketing, leadership, and investor readiness — complete with videos, quizzes, and certification.
                                    </p>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">2️⃣ Mentorship & Advisory:</h3>
                                    <p className="text-gray-700">
                                        Connect with experienced mentors, business experts, and professionals across finance, tech, marketing, and design for one-on-one guidance.
                                    </p>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">3️⃣ Internship Programs:</h3>
                                    <p className="text-gray-700">
                                        Real-world practical experience through 4-week online startup internships — learn, build, and earn your certification.
                                    </p>
                                </div>

                                <div className="bg-orange-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">4️⃣ Legal & Compliance Support:</h3>
                                    <p className="text-gray-700">
                                        MSME registration, GST filing, FSSAI, Trademark, and other legal services — all guided step-by-step within the app.
                                    </p>
                                </div>

                                <div className="bg-pink-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">5️⃣ Funding & Loan Assistance:</h3>
                                    <p className="text-gray-700">
                                        Learn about PMEGP, Mudra, and Startup India loans. Apply easily through our partner banks and funding network.
                                    </p>
                                </div>

                                <div className="bg-indigo-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">6️⃣ App & Website Development:</h3>
                                    <p className="text-gray-700">
                                        We help entrepreneurs build their own digital presence — from website design to mobile apps — with expert tech partners.
                                    </p>
                                </div>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🌐 Why Choose CreateBharat?</h2>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 font-bold">✅</span>
                                    <span>One platform for everything — Training, Mentorship, Legal, and Growth</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 font-bold">✅</span>
                                    <span>Recognized NGO supporting the Startup India & MSME ecosystem</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 font-bold">✅</span>
                                    <span>24/7 access to video modules, business tools, and mentors</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 font-bold">✅</span>
                                    <span>Affordable pricing for students, startups, and small business owners</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 font-bold">✅</span>
                                    <span>Practical, real-world learning — not just theory</span>
                                </li>
                            </ul>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🧠 Who Can Join Us</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Students looking to learn entrepreneurship & business basics</li>
                                <li>Early-stage founders and freelancers</li>
                                <li>Small business owners (MSMEs)</li>
                                <li>Innovators and startup enthusiasts</li>
                                <li>Anyone who wants to build their own business with guidance</li>
                            </ul>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🤝 Our Collaborations</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">We are open to collaborations with:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                                <li>Colleges & Universities for student entrepreneurship training</li>
                                <li>Banks & Financial Institutions for startup funding programs</li>
                                <li>Industry Experts & Mentors for advisory partnerships</li>
                                <li>Government & CSR Initiatives promoting youth entrepreneurship</li>
                            </ul>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">💬 Our Motto</h2>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-4">
                                <p className="text-xl font-bold text-gray-900 text-center mb-2">"Building India's Next Founders."</p>
                                <p className="text-gray-700 text-center">
                                    CreateBharat is not just an app — it's a movement to empower the creators of tomorrow,
                                    a platform where ideas meet action, and dreams turn into real businesses.
                                </p>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">📍 Our Details</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 mb-2"><strong>Organization:</strong> CreateBharat Foundation (Registered NGO)</p>
                                <p className="text-gray-700 mb-2"><strong>Head Office:</strong> Jamshedpur, Jharkhand</p>
                                <p className="text-gray-700 mb-2"><strong>Email:</strong> createbharatofficial@gmail.com</p>
                                <p className="text-gray-700 mb-2"><strong>Website:</strong> www.createbharat.com</p>
                                <p className="text-gray-700 mb-2"><strong>Founder:</strong> Koushik Chakraborty</p>
                                <p className="text-gray-700"><strong>Slogan:</strong> "Building India's Next Founders."</p>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">✅ In Short (For App Summary)</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                CreateBharat is India's first all-in-one entrepreneurship platform that helps young innovators learn business, connect with mentors, get legal & financial support, and launch their startups — all in one app.
                            </p>
                        </motion.section>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
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

export default AboutPage;
