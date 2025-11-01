import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is CreateBharat?",
            answer: "CreateBharat is a comprehensive platform that empowers individuals and businesses across India by providing access to government loans, internships, legal services, mentorship, and training opportunities to support career and business growth."
        },
        {
            question: "How do I apply for a government loan?",
            answer: "You can browse available loan schemes on our Loans page, select a loan that matches your needs, and fill out the application form. Our team will guide you through the process and help you submit all required documents."
        },
        {
            question: "Are the loans provided by CreateBharat?",
            answer: "No, CreateBharat is a platform that connects you with government loan schemes. We help you find the right loan schemes and assist with the application process, but the loans are provided by government institutions."
        },
        {
            question: "How do I find internships?",
            answer: "Visit our Internships page to browse available opportunities. You can filter by category, location, and duration. Create an account to save internships and apply directly through our platform."
        },
        {
            question: "What legal services do you provide?",
            answer: "We offer various legal services including business registration (GST, Company Registration), legal consultations, document preparation, and project report services. You can browse all available services on our Legal Services page."
        },
        {
            question: "How does the mentorship program work?",
            answer: "Our mentorship program connects you with experienced mentors in various fields. You can browse mentor profiles, view their availability, and book consultation sessions based on your needs and goals."
        },
        {
            question: "Is CreateBharat free to use?",
            answer: "Yes, browsing our platform and viewing available opportunities is free. However, some services like legal consultations, mentorship sessions, and training courses may have associated fees, which will be clearly displayed before you proceed."
        },
        {
            question: "How secure is my personal information?",
            answer: "We take data security seriously. All personal information is encrypted and stored securely. We comply with data protection regulations and never share your information with third parties without your consent. Please review our Privacy Policy for more details."
        },
        {
            question: "Can I track my loan application status?",
            answer: "Yes, once you've applied for a loan, you can track your application status in your profile dashboard. You'll receive updates about the progress of your application."
        },
        {
            question: "How do I contact customer support?",
            answer: "You can contact us through our Contact page, email us at support@createbharat.com, or call us at +91-XXX-XXXX-XXXX. Our support team is available to assist you with any questions or concerns."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept various payment methods including credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely through trusted payment gateways."
        },
        {
            question: "Can I cancel or modify my booking?",
            answer: "Yes, you can cancel or modify bookings through your profile dashboard. Please note that cancellation policies may vary depending on the service. Refunds, if applicable, will be processed according to our terms and conditions."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

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
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                        <p className="text-gray-600">Find answers to common questions about CreateBharat</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.05 }}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <span className="font-semibold text-gray-900">{faq.question}</span>
                                    <svg
                                        className={`w-5 h-5 text-gray-600 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="px-6 py-4 bg-white"
                                    >
                                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-center mt-8 pt-8 border-t border-gray-200"
                    >
                        <p className="text-gray-600 mb-4">Still have questions?</p>
                        <Link 
                            to="/contact" 
                            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 mr-4"
                        >
                            Contact Us
                        </Link>
                        <Link 
                            to="/" 
                            className="inline-block bg-gray-100 text-gray-700 py-3 px-8 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                        >
                            Back to Home
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQPage;

