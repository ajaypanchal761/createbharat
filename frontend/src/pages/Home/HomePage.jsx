import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavbar from '../../components/common/BottomNavbar';
import { useUser } from '../../contexts/UserContext';
import LoginPage from '../Auth/LoginPage';
import { bannerAPI, bankAccountAPI } from '../../utils/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import techImage from '../../assets/techImage.webp';
import mentorImage from '../../assets/mentor.png';
import legalImage from '../../assets/legal.png';
import techm from '../../assets/techm.jpg';
import hcltech from '../../assets/hcltech.avif';
import paytm from '../../assets/paytm.webp';
import govLoanImg from '../../assets/Government-personal-loan-scheme.webp';
import internshipImg from '../../assets/career-center-internships-.jpg';
import legalServicesImg from '../../assets/legal services.jpg';
import mentorSupportImg from '../../assets/mentorsupport.jpg';
import trainingImg from '../../assets/training.jpg';
// Banner-specific images
import bankBanner from '../../assets/bank-banner.png';
import internshipBanner from '../../assets/intenrhsip-banner.jpg';
import legalBanner from '../../assets/legal-banner.jpg';
import mentorBanner from '../../assets/mentor-banner.webp';

// --- SVG Icons ---
const UserIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 text-gray-400"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg> ); 
const BellIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> );

// Premium SVG Icons for Why Choose Create Bharat
const LoanIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MentorIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const LegalIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const TrainingIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const CompanyIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const ApprovalIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);
const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> );
const QuoteIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 012 0v5h3a1 1 0 010 2h-3v5a1 1 0 01-2 0V10H7a1 1 0 010-2h3V3z" clipRule="evenodd" /></svg> );

const HomePage = () => {
    const navigate = useNavigate();
    const { user, logout: userLogout, isAuthenticated } = useUser();
    
    // Mobile detection and first visit logic
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileLogin, setShowMobileLogin] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [banners, setBanners] = useState([]);
    const [bannersLoading, setBannersLoading] = useState(true);
    
    // Stats counting animation state
    const [activeUsers, setActiveUsers] = useState(0);
    const [successStories, setSuccessStories] = useState(0);
    const [partners, setPartners] = useState(0);
    const [statsAnimated, setStatsAnimated] = useState(false);
    
    // Bank Account Opening Form State
    const [showBankAccountForm, setShowBankAccountForm] = useState(false);
    const [bankAccountFormData, setBankAccountFormData] = useState({
        accountType: '',
        businessType: '',
        hasPanCard: '',
        hasGst: '',
        hasUdyamMsmeCertificate: '',
        panNumber: '',
        gstNumber: '',
        udyamMsmeNumber: '',
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        aadhaarNumber: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Bank Account Form Handlers
    const handleBankAccountFormChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        if (name === 'aadhaarNumber') {
            updatedValue = value.replace(/\D/g, '').slice(0, 12);
        } else if (name === 'panNumber') {
            updatedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
        } else if (name === 'gstNumber') {
            updatedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
        }

        const updatedState = {
            ...bankAccountFormData,
            [name]: updatedValue
        };

        if (name === 'hasPanCard' && value !== 'yes') {
            updatedState.panNumber = '';
        }
        if (name === 'hasGst' && value !== 'yes') {
            updatedState.gstNumber = '';
        }
        if (name === 'hasUdyamMsmeCertificate' && value !== 'yes') {
            updatedState.udyamMsmeNumber = '';
        }

        setBankAccountFormData(updatedState);
    };

    const handleBankAccountFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const response = await bankAccountAPI.submitForm(bankAccountFormData);
            
            if (response.success) {
                alert('Form submitted successfully! We will contact you soon.');
                setShowBankAccountForm(false);
                setBankAccountFormData({
                    accountType: '',
                    businessType: '',
                    hasPanCard: '',
                    hasGst: '',
                    hasUdyamMsmeCertificate: '',
                    panNumber: '',
                    gstNumber: '',
                    udyamMsmeNumber: '',
                    fullName: '',
                    email: '',
                    phone: '',
                    dateOfBirth: '',
                    address: '',
                    city: '',
                    state: '',
                    pincode: '',
                    aadhaarNumber: ''
                });
            } else {
                alert(response.message || 'Failed to submit form. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(error.message || 'Failed to submit form. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Fetch banners from backend
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setBannersLoading(true);
                const response = await bannerAPI.getAllBanners();
                console.log('Banners response:', response);
                if (response.success && response.data) {
                    // Always use banners from backend if available
                    if (response.data.length > 0) {
                        setBanners(response.data);
                    } else {
                        // Empty array - no banners from backend
                        setBanners([]);
                    }
                } else {
                    // If response is not successful, use empty array
                    setBanners([]);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
                // On error, set empty array instead of defaults
                setBanners([]);
            } finally {
                setBannersLoading(false);
            }
        };

        fetchBanners();

        // Refetch banners when window gains focus (user might have added banner in another tab)
        const handleFocus = () => {
            fetchBanners();
        };
        window.addEventListener('focus', handleFocus);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    // Auto-scroll banners
    useEffect(() => {
        if (banners.length <= 1) return; // Don't auto-scroll if there's only one banner

        const interval = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        }, 5000); // Change banner every 5 seconds

        return () => clearInterval(interval);
    }, [banners.length]);

    // Mobile detection and first visit check
    useEffect(() => {
        const checkMobileAndFirstVisit = () => {
            const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsMobile(isMobileDevice);
            
            if (isMobileDevice) {
                const hasVisited = localStorage.getItem('hasVisited');
                if (!hasVisited) {
                    setShowMobileLogin(true);
                }
            }
        };

        checkMobileAndFirstVisit();
        window.addEventListener('resize', checkMobileAndFirstVisit);
        return () => window.removeEventListener('resize', checkMobileAndFirstVisit);
    }, []);

    // Hide mobile login overlay as soon as user logs in or visit flag exists
    useEffect(() => {
        if (!showMobileLogin) return;

        if (user) {
            setShowMobileLogin(false);
            return;
        }

        try {
            const hasVisited = localStorage.getItem('hasVisited') === 'true';
            if (hasVisited) {
                setShowMobileLogin(false);
            }
        } catch (err) {
            console.warn('Unable to read hasVisited flag from storage:', err);
        }
    }, [showMobileLogin, user]);

    // Initialize AOS for animations
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: false // Enable AOS on all screen sizes
        });
        
        // Refresh AOS after DOM is ready, especially for desktop view
        const refreshAOS = () => {
            setTimeout(() => {
            AOS.refresh();
            }, 200);
        };
        
        refreshAOS();
        
        // Also refresh on window resize
        const handleResize = () => {
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        };
        window.addEventListener('resize', handleResize);
        
        // Refresh when component updates (for dynamic content)
        const interval = setInterval(() => {
            AOS.refresh();
        }, 1000);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(interval);
        };
    }, []);

    // Stats counting animation
    useEffect(() => {
        if (statsAnimated) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !statsAnimated) {
                        setStatsAnimated(true);
                        
                        // Animate Active Users (10K+)
                        const animateUsers = () => {
                            let current = 0;
                            const target = 10000;
                            const increment = target / 50; // 50 steps
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= target) {
                                    setActiveUsers(target);
                                    clearInterval(timer);
                                } else {
                                    setActiveUsers(Math.floor(current));
                                }
                            }, 30);
                        };

                        // Animate Success Stories (500+)
                        const animateStories = () => {
                            let current = 0;
                            const target = 500;
                            const increment = target / 50; // 50 steps
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= target) {
                                    setSuccessStories(target);
                                    clearInterval(timer);
                                } else {
                                    setSuccessStories(Math.floor(current));
                                }
                            }, 30);
                        };

                        // Animate Partners (50+)
                        const animatePartners = () => {
                            let current = 0;
                            const target = 50;
                            const increment = target / 50; // 50 steps
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= target) {
                                    setPartners(target);
                                    clearInterval(timer);
                                } else {
                                    setPartners(Math.floor(current));
                                }
                            }, 30);
                        };

                        // Start all animations
                        animateUsers();
                        animateStories();
                        animatePartners();
                    }
                });
            },
            { threshold: 0.3 }
        );

        const statsElement = document.querySelector('[data-stats-section]');
        if (statsElement) {
            observer.observe(statsElement);
        }

        return () => {
            if (statsElement) {
                observer.unobserve(statsElement);
            }
        };
    }, [statsAnimated]);

    // Banner navigation functions
    const goToNextBanner = () => {
        if (banners.length > 0) {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        }
    };
    
    const goToPrevBanner = () => {
        if (banners.length > 0) {
            setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
        }
    };

    // Touch handlers for swipeable banner
    const minSwipeDistance = 50;
    
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    
    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd || banners.length === 0) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        }
        if (isRightSwipe) {
            setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
        }
    };

    // Modal handlers
    const handleServiceClick = (e, servicePath) => {
        e.preventDefault();

        // On mobile, remove login modals and navigate directly
        if (isMobile) {
            navigate(servicePath);
            return;
        }

        // Direct navigation for training, app development, and mentors
        if (servicePath === '/training' || servicePath === '/app-development' || servicePath === '/mentors') {
            navigate(servicePath);
            return;
        }

        // For other services, go directly if authenticated; otherwise go to login
        if (isAuthenticated()) {
            navigate(servicePath);
        } else {
            navigate('/login');
        }
    };


    // Advanced Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
        visible: { 
            opacity: 1, 
            scale: 1,
            rotateY: 0,
            transition: { 
                duration: 0.7, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 120,
                damping: 20
            }
        }
    };

    const slideInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const slideInRight = {
        hidden: { opacity: 0, x: 50 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const bounceIn = {
        hidden: { opacity: 0, scale: 0.3, y: -50 },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: { 
                duration: 0.8, 
                ease: [0.68, -0.55, 0.265, 1.55],
                type: "spring",
                stiffness: 200,
                damping: 20
            }
        }
    };

    const rotateIn = {
        hidden: { opacity: 0, rotate: -180, scale: 0.5 },
        visible: { 
            opacity: 1, 
            rotate: 0,
            scale: 1,
            transition: { 
                duration: 1.0, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 150,
                damping: 25
            }
        }
    };

    const floatAnimation = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const pulseAnimation = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const shimmerAnimation = {
        animate: {
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    // Categories for mobile dashboard with images
    const categories = [
        {
            id: 'loans',
            name: 'Loans',
            image: govLoanImg,
            path: '/loans',
            color: 'from-orange-500 to-cyan-500'
        },
        {
            id: 'internships',
            name: 'Internships',
            image: internshipImg,
            path: '/internships',
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 'legal',
            name: 'Legal',
            image: legalServicesImg,
            path: '/legal',
            color: 'from-purple-500 to-violet-500'
        },
        {
            id: 'mentors',
            name: 'Mentors',
            image: mentorSupportImg,
            path: '/mentors',
            color: 'from-orange-500 to-red-500'
        },
        {
            id: 'training',
            name: 'Training',
            image: trainingImg,
            path: '/training',
            color: 'from-pink-500 to-rose-500'
        },
        {
            id: 'analytics',
            name: 'Analytics',
            image: techImage,
            path: '/analytics',
            color: 'from-indigo-500 to-orange-500'
        }
    ];


    // Top companies data
    const topCompanies = [
        { id: 1, name: 'TCS', logo: techm, jobs: 245, rating: 4.5, location: 'Mumbai' },
        { id: 2, name: 'HCL Technologies', logo: hcltech, jobs: 189, rating: 4.3, location: 'Bangalore' },
        { id: 3, name: 'Paytm', logo: paytm, jobs: 156, rating: 4.2, location: 'Delhi' },
        { id: 4, name: 'Infosys', logo: techImage, jobs: 298, rating: 4.4, location: 'Pune' },
        { id: 5, name: 'Wipro', logo: techImage, jobs: 167, rating: 4.1, location: 'Chennai' },
        { id: 6, name: 'Accenture', logo: techImage, jobs: 203, rating: 4.6, location: 'Hyderabad' }
    ];

    // Show login page on first visit
    if (showMobileLogin) {
        return <LoginPage />;
    }

    return (
        <>
            {/* Mobile View - New Design */}
            <div id="hero" className="md:hidden min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
                {/* Header */}
                <header className="bg-white shadow-md sticky top-0 z-50">
                    <div className="px-4 py-4">
                        <div className="flex items-center justify-between">
                            <button 
                                className="p-2 text-gray-800"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="flex items-center space-x-2">
                                <img src="/logo.png" alt="CreateBharat" className="h-14 w-14" />
                                <div>
                                        <h1 className="text-2xl font-bold text-gray-900 ml-3">CreateBharat</h1>
                                        <p className="text-sm text-gray-600 font-medium ml-3">Empowering Your Dreams</p>
                                    </div>
                            </div>
                            <div className="w-10"></div>
                        </div>
                    </div>
                </header>
                        
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div 
                        className="fixed top-0 left-0 bottom-24 w-64 bg-white shadow-2xl border-r border-gray-200 z-[70] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                            <div className="p-6">
                                {/* Close button */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="mb-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="space-y-3 pb-24">
                                <Link 
                                    to="/" 
                                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link 
                                    to="/loans" 
                                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Loans
                                </Link>
                                <Link 
                                    to="/internships" 
                                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Internships
                                </Link>
                                <Link 
                                    to="/legal" 
                                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Legal Services
                                </Link>
                                <Link 
                                    to="/mentors" 
                                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Mentorship
                                </Link>
                                <Link 
                                    to="/training" 
                                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Training
                                </Link>
                                <Link 
                                    to="/app-development" 
                                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Development
                                </Link>
                                <Link 
                                    to={isAuthenticated() ? "/pitch/submit" : "/login"}
                                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Submit Your Pitch
                                </Link>
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    {isAuthenticated() ? (
                                        <button 
                                            onClick={() => {
                                                userLogout();
                                                setIsMobileMenuOpen(false);
                                                navigate('/');
                                            }}
                                            className="block w-full text-left py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                    <Link 
                                        to="/login" 
                                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Overlay for mobile menu */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Auto-Scrolling Banner */}
                <section className="mx-4 mt-4 mb-2" data-aos="fade-down">
                    <div className="relative h-32 overflow-hidden rounded-2xl shadow-2xl">
                        {bannersLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                            </div>
                        ) : banners.length > 0 ? (
                            <div 
                                key={banners[currentBannerIndex]?._id || currentBannerIndex}
                                className="absolute inset-0"
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                            >
                                <img 
                                    src={banners[currentBannerIndex]?.imageUrl || banners[currentBannerIndex]?.image} 
                                    alt={banners[currentBannerIndex]?.title || 'Banner'}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <p className="text-gray-500 text-sm">No banners available</p>
                            </div>
                        )}
                        
                        
                        {/* Banner Indicators */}
                        {banners.length > 0 && (
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                                {banners.map((banner, index) => (
                                <button
                                        key={banner._id || index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        currentBannerIndex === index ? 'bg-white' : 'bg-white/50'
                                    }`}
                                    onClick={() => setCurrentBannerIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Main Content */}
                <div className="px-4 pt-2 pb-6 space-y-4">
                    {/* Top Service Grid - 3x2 */}
                    <div className="grid grid-cols-3 gap-2.5 justify-items-center" data-aos="fade-up" data-aos-delay="100">
                        {[
                            { 
                                name: 'Certified Training', 
                                image: trainingImg,
                                path: '/training'
                            },
                            { 
                                name: 'Legal Services', 
                                image: legalServicesImg,
                                path: '/legal'
                            },
                            { 
                                name: 'Loan / Schemes', 
                                image: govLoanImg,
                                path: '/loans'
                            },
                            { 
                                name: 'Mentorship', 
                                image: mentorSupportImg,
                                path: '/mentors'
                            },
                            { 
                                name: 'Development', 
                                image: techImage,
                                path: '/app-development'
                            },
                            { 
                                name: 'Internships', 
                                image: internshipImg,
                                path: '/internships'
                            }      
                        ].map((service, index) => (
                            <div 
                                key={service.name}
                                onClick={(e) => handleServiceClick(e, service.path)}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col w-full h-full min-h-[80px]"
                                data-aos="fade-up"
                                data-aos-delay={`${(index % 3) * 50}`}
                            >
                                {/* Image with hover effect - Fixed to edges */}
                                <div className="w-full h-16 overflow-hidden">
                                    <img 
                                        src={service.image} 
                                        alt={service.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                {/* Service name - With padding */}
                                <div className="px-3 pt-2 pb-2.5 flex-1 flex items-center justify-center">
                                    <h3 className="text-xs font-bold text-gray-800 text-center leading-tight group-hover:text-blue-600 transition-colors duration-200">
                                        {service.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bank Account Service Banner - Mobile */}
                    <motion.button
                        type="button"
                        onClick={() => setShowBankAccountForm(true)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                setShowBankAccountForm(true);
                            }
                        }}
                        className="group relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-sky-500 text-left shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 min-h-[155px] mb-4"
                        data-aos="fade-left"
                        data-aos-delay="200"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <div className="absolute inset-0">
                            <img
                                src={bankBanner}
                                alt="Business current account support"
                                className="h-full w-full object-cover opacity-30 group-hover:opacity-45 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-blue-900/70 to-sky-900/60" />
                        </div>

                        <div className="relative z-10 flex flex-col gap-3 p-5">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/90 shadow-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Business Current Account
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="text-xl font-bold leading-snug text-white">
                                    Do you have a current account?
                                </h3>
                                <p className="text-sm text-blue-100/90 leading-tight">
                                    Open a business current account with our banking partners - fast, easy, and packed with benefits for growing companies.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {[
                                    'Priority onboarding',
                                    'Dedicated relationship manager',
                                    'Zero paperwork hassles'
                                ].map((benefit) => (
                                    <span
                                        key={benefit}
                                        className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/90"
                                    >
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/90 text-[8px] font-bold text-indigo-900">✓</span>
                                        {benefit}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-white">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 shadow-lg">
                                    Open Current Account
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </motion.button>

                    {/* Middle Service Grid - 4 Columns */}
                    <div className="grid grid-cols-4 gap-2.5 justify-items-center" data-aos="fade-up" data-aos-delay="300">
                        {[
                            { 
                                name: 'EDP Outline', 
                                image: trainingImg,
                                path: '/training'
                            },
                            { 
                                name: 'PMEGP Loan', 
                                image: govLoanImg,
                                path: '/loans'
                            },
                            { 
                                name: 'Live Workshop', 
                                image: mentorSupportImg,
                                path: '/mentors'
                            },
                            { 
                                name: 'Development', 
                                image: techImage,
                                path: '/app-development'
                            }
                        ].map((service, index) => (
                            <div 
                                key={service.name}
                                onClick={(e) => handleServiceClick(e, service.path)}
                                className="relative rounded-2xl bg-white shadow-lg ring-1 ring-black/5 hover:shadow-xl hover:ring-blue-300 hover:ring-2 transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col w-full h-full min-h-[75px]"
                                data-aos="zoom-in"
                                data-aos-delay={`${(index % 4) * 50}`}
                            >
                                <div className="w-full h-16 overflow-hidden">
                                    <img 
                                        src={service.image} 
                                        alt={service.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                <div className="px-2.5 pt-2 pb-2.5 flex-1 flex items-center justify-center">
                                    <h3 className="text-xs font-semibold text-gray-800 text-center leading-tight break-words hyphens-auto">
                                        {service.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Banner */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 relative overflow-hidden shadow-lg ring-1 ring-blue-200" data-aos="fade-right" data-aos-delay="400">
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-gray-800 mb-2">
                                    Business Ideas
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Explore opportunities
                                </p>
                            </div>
                            <button
                                onClick={(e) => handleServiceClick(e, '/mentors')}
                                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-all duration-300"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>

                   </div>

                   {/* Why Choose Create Bharat + How It Works Section */}
                   <div className="space-y-4 mb-6">
                        {/* Why Choose Create Bharat - Compact Mobile Design */}
                        <div className="relative bg-white rounded-2xl p-4 shadow-lg border border-gray-100 overflow-hidden" data-aos="fade-up" data-aos-delay="400">
                            {/* Compact Header */}
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-gray-900 text-center">
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Why Choose Create Bharat
                                    </span>
                                </h2>
                            </div>
                            
                            {/* Compact Grid Layout - 2 columns with icons outside */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { 
                                        Icon: LoanIcon, 
                                        title: 'Govt Loans', 
                                        shortDesc: 'Low interest rates',
                                        gradient: 'from-blue-500 to-indigo-600',
                                    },
                                    { 
                                        Icon: MentorIcon, 
                                        title: 'Mentorship', 
                                        shortDesc: 'Expert guidance',
                                        gradient: 'from-purple-500 to-pink-600',
                                    },
                                    { 
                                        Icon: LegalIcon, 
                                        title: 'Legal Support', 
                                        shortDesc: 'Expert consultation',
                                        gradient: 'from-green-500 to-emerald-600',
                                    },
                                    { 
                                        Icon: TrainingIcon, 
                                        title: 'Free Training', 
                                        shortDesc: 'With certificates',
                                        gradient: 'from-orange-500 to-red-600',
                                    },
                                    { 
                                        Icon: CompanyIcon, 
                                        title: 'Verified Cos', 
                                        shortDesc: 'Trusted companies',
                                        gradient: 'from-cyan-500 to-blue-600',
                                    },
                                    { 
                                        Icon: ApprovalIcon, 
                                        title: 'Quick Approval', 
                                        shortDesc: 'Fast processing',
                                        gradient: 'from-yellow-500 to-orange-600',
                                    }
                                ].map((benefit, index) => {
                                    const IconComponent = benefit.Icon;
                                    return (
                                        <div key={benefit.title} className="flex items-center gap-2">
                                            {/* Icon outside box */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                                viewport={{ once: true }}
                                                className={`relative w-10 h-10 bg-gradient-to-r ${benefit.gradient} rounded-lg flex items-center justify-center shadow-md flex-shrink-0`}
                                            >
                                                <IconComponent />
                                            </motion.div>
                                            
                                            {/* Box with text */}
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                                viewport={{ once: true }}
                                                whileTap={{ scale: 0.95 }}
                                                className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 shadow-sm border border-gray-100 active:shadow-md transition-all duration-200 group flex-1"
                                            >
                                                {/* Title and Description */}
                                                <h3 className="text-xs font-bold text-gray-900 mb-1 leading-tight">{benefit.title}</h3>
                                                <p className="text-[10px] text-gray-600 leading-tight">{benefit.shortDesc}</p>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* How It Works - Compact Mobile Design */}
                        <div className="relative bg-white rounded-2xl p-4 shadow-lg border border-gray-100 overflow-hidden" data-aos="fade-up" data-aos-delay="600">
                            {/* Compact Header */}
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-gray-900 text-center">
                                    <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                        How It Works
                                    </span>
                                </h2>
                            </div>
                            
                            {/* Compact Steps Grid - 2 columns */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { 
                                        step: '1', 
                                        title: 'Sign Up', 
                                        shortDesc: 'Create account',
                                        gradient: 'from-orange-500 to-amber-600',
                                    },
                                    { 
                                        step: '2', 
                                        title: 'Explore', 
                                        shortDesc: 'Browse services',
                                        gradient: 'from-amber-500 to-yellow-600',
                                    },
                                    { 
                                        step: '3', 
                                        title: 'Apply', 
                                        shortDesc: 'Submit request',
                                        gradient: 'from-yellow-500 to-orange-600',
                                    },
                                    { 
                                        step: '4', 
                                        title: 'Succeed', 
                                        shortDesc: 'Get support',
                                        gradient: 'from-orange-600 to-red-600',
                                    }
                                ].map((step, index) => (
                                    <motion.div
                                        key={step.step}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                        viewport={{ once: true }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 shadow-sm border border-gray-100 active:shadow-md transition-all duration-200 group flex flex-col items-center justify-center"
                                    >
                                        {/* Step Number Circle */}
                                        <div className={`relative w-10 h-10 mx-auto mb-2 bg-gradient-to-r ${step.gradient} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md group-active:scale-110 transition-transform duration-200`}>
                                            {step.step}
                                        </div>
                                        
                                        {/* Title and Description */}
                                        <h3 className="text-xs font-bold text-gray-900 text-center mb-1 leading-tight">{step.title}</h3>
                                        <p className="text-[10px] text-gray-600 text-center leading-tight">{step.shortDesc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Section removed as requested */}
            </div>

            {/* Bottom Navigation - Mobile Only */}
            <BottomNavbar />

            {/* Desktop View */}
            <div className="hidden md:block min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                {/* Desktop Header */}
                <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0" data-aos="fade-right">
                                <Link to="/" className="flex items-center gap-2 md:gap-2.5">
                                    <img src="/logo.png" alt="CreateBharat" className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain flex-shrink-0" />
                                    <div className="min-w-0">
                                        <h1 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 truncate">CreateBharat</h1>
                                        <p className="text-[10px] md:text-xs text-gray-600 font-medium truncate hidden md:block">Empowering Your Dreams</p>
                                    </div>
                        </Link>
            </div>

                            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-3 justify-center flex-1 mx-2 md:mx-4 flex-nowrap" data-aos="fade-down">
                                <Link to="/" className="px-2 lg:px-3 xl:px-3 2xl:px-4 py-1.5 lg:py-2 xl:py-2 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Home</Link>
                                <Link to="/loans" className="px-2 lg:px-3 xl:px-3 2xl:px-4 py-1.5 lg:py-2 xl:py-2 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Loans</Link>
                                <Link to="/internships" className="px-2 lg:px-3 xl:px-3 2xl:px-4 py-1.5 lg:py-2 xl:py-2 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Internships</Link>
                                <Link 
                                    to="/legal" 
                                    onClick={() => {
                                        // Set active tab to 'services' when navigating from homepage
                                        localStorage.setItem('legalActiveTab', 'services');
                                        window.dispatchEvent(new CustomEvent('navbarLegalTabChange', { detail: { tab: 'services' } }));
                                    }}
                                    className="px-2 lg:px-3 xl:px-3 2xl:px-4 py-1.5 lg:py-2 xl:py-2 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50"
                                >
                                    Legal
                                </Link>
                                <Link to="/mentors" className="px-2 lg:px-3 xl:px-3 2xl:px-4 py-1.5 lg:py-2 xl:py-2 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Mentors</Link>
                                <Link to="/training" className="px-2 lg:px-3 xl:px-3 2xl:px-4 py-1.5 lg:py-2 xl:py-2 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Training</Link>
                                <Link to="/app-development" className="px-2 lg:px-3 xl:px-3 2xl:px-4 py-1.5 lg:py-2 xl:py-2 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Web Development</Link>
                            </nav>
                            
                            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0" data-aos="fade-left">
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    {isAuthenticated() ? (
                                        <>
                                            <Link 
                                                to="/profile"
                                                className="px-3 md:px-5 py-1.5 md:py-2 bg-white text-blue-600 font-semibold text-xs md:text-sm rounded-lg hover:bg-gray-50 transition-all duration-300 border border-blue-200 whitespace-nowrap"
                                            >
                                                Profile
                                            </Link>
                                    <button 
                                            onClick={() => {
                                                userLogout();
                                                navigate('/');
                                            }}
                                            className="px-3 md:px-5 py-1.5 md:py-2 bg-red-600 text-white font-semibold text-xs md:text-sm rounded-lg hover:bg-red-700 transition-all duration-300 whitespace-nowrap"
                                        >
                                            Logout
                                    </button>
                                        </>
                                    ) : (
                                    <button 
                                            onClick={() => navigate('/login')}
                                        className="px-3 md:px-5 py-1.5 md:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-xs md:text-sm rounded-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                                    >
                                            Login
                                    </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Desktop Hero Section */}
                <section id="hero" className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div 
                                className="space-y-8"
                                data-aos="fade-right"
                            >
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                                        Empower Your Dreams with{' '}
                                        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Create Bharat</span>
                                    </h1>
                                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                        Create Bharat is your one-stop platform for career growth and business success in India. Discover government loan schemes, explore career opportunities through internships, access expert legal services, and connect with experienced mentors. Join thousands of successful entrepreneurs and professionals who trust Create Bharat to empower their dreams and achieve their goals.
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-8 pt-8" data-aos="fade-up" data-aos-delay="200" data-stats-section>
                      <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {activeUsers >= 1000 ? `${(activeUsers / 1000).toFixed(0)}K+` : `${activeUsers}+`}
                                        </div>
                                        <div className="text-sm text-gray-600">Active Users</div>
                      </div>
                      <div className="text-center">
                                        <div className="text-3xl font-bold text-indigo-600">{successStories}+</div>
                                        <div className="text-sm text-gray-600">Success Stories</div>
                      </div>
                      <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">{partners}+</div>
                                        <div className="text-sm text-gray-600">Partners</div>
                      </div>
                    </div>
                            </div>
                            
                            <div
                                className="relative"
                                data-aos="fade-left"
                            >
                                <div className="relative w-full rounded-2xl shadow-2xl">
                                    {bannersLoading ? (
                                        <div className="flex items-center justify-center bg-gray-100 min-h-[400px] rounded-2xl">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                                        </div>
                                    ) : banners.length > 0 ? (
                                        <>
                                            <AnimatePresence mode="wait">
                                                <motion.div 
                                                    key={banners[currentBannerIndex]?._id || currentBannerIndex}
                                                    initial={{ opacity: 0, x: 100 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -100 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="relative w-full h-auto rounded-2xl"
                                                >
                                                    <img 
                                                        src={banners[currentBannerIndex]?.imageUrl || banners[currentBannerIndex]?.image} 
                                                        alt={banners[currentBannerIndex]?.title || 'Banner'}
                                                        className="w-full h-auto rounded-2xl"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent rounded-2xl pointer-events-none"></div>
                                                </motion.div>
                                            </AnimatePresence>
                                            
                                            {/* Banner Indicators */}
                                            {banners.length > 1 && (
                                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                                                    {banners.map((banner, index) => (
                                                        <button
                                                            key={banner._id || index}
                                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                                currentBannerIndex === index ? 'bg-white' : 'bg-white/50'
                                                            }`}
                                                            onClick={() => setCurrentBannerIndex(index)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {/* Navigation Arrows */}
                                            {banners.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={goToPrevBanner}
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={goToNextBanner}
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                <div className="relative">
                                    <img
                                        src={techImage}
                                        alt="Technology"
                                        className="w-full h-auto rounded-2xl shadow-2xl"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl"></div>
                                        </div>
                                    )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bank Account Service Banner - Desktop */}
        <section className="hidden md:block py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-500 shadow-2xl cursor-pointer group"
              role="button"
              tabIndex={0}
              onClick={() => setShowBankAccountForm(true)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setShowBankAccountForm(true);
                }
              }}
            >
              <div className="absolute inset-0">
                <img
                  src={bankBanner}
                  alt="Business current account partnership"
                  className="h-full w-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/85 via-blue-900/70 to-sky-900/55" />
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 px-12 py-12">
                <div className="max-w-2xl space-y-6 text-white">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Business Current Account
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl xl:text-4xl font-extrabold leading-tight">
                      Do you have a current account?
                    </h3>
                    <p className="text-lg text-blue-100/90 max-w-xl">
                      Open a business current account with our trusted banking partners - enjoy fast onboarding, effortless compliance, and exclusive benefits tailored to help your company grow.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[
                      'Priority onboarding & KYC assistance',
                      'Dedicated relationship manager',
                      'Zero paperwork hassles'
                    ].map((benefit) => (
                      <span
                        key={benefit}
                        className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-white/90"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/90 text-[10px] font-bold text-indigo-900">✓</span>
                        {benefit}
                      </span>
                    ))}
                  </div>
                  <div className="pt-3">
                    <span className="inline-flex items-center gap-3 rounded-full bg-white text-indigo-700 px-6 py-3 text-sm font-semibold shadow-xl">
                      Open Current Account
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <p className="mt-3 text-xs font-medium text-blue-100/90">
                      Single application | Multi-bank choice | Assistance within 48 hours
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-xs lg:max-w-sm">
                  <div className="rounded-3xl bg-white/95 backdrop-blur-sm text-indigo-900 shadow-2xl px-6 py-7 space-y-5">
                    <span className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-500">Why businesses choose us</span>
                    <p className="text-lg font-semibold text-gray-900 leading-snug">
                      We connect you with curated banks, streamline onboarding, and deliver business banking that keeps pace with your growth.
                    </p>
                    <div className="space-y-3 text-sm text-gray-600">
                      {[
                        'Personalised document checklist and filing support',
                        'Exclusive offers on payments, POS and payroll tools',
                        '24x7 assistance from CreateBharat banking experts'
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl bg-gradient-to-r from-indigo-600/10 to-sky-600/10 px-5 py-4 text-sm font-semibold text-indigo-600 flex items-center gap-3">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6a2.5 2.5 0 00-5 0v4.5m0 0v7a2.5 2.5 0 005 0v-7m-5 0h-3a2.5 2.5 0 00-5 0v3.75a2.5 2.5 0 005 0V11" />
                      </svg>
                      Trusted by 24+ partner banks across India
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

                {/* Desktop Services Section */}
                <section className="py-16 lg:py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-8">
            <div 
                            className="text-center mb-16"
                            data-aos="fade-down"
                        >
              <h2 
                                className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
                            >
                                Our Services
              </h2>
              <p 
                                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                                Comprehensive solutions for your career and business growth
              </p>
            </div>

            <div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {[
                  { 
                                    name: 'Loans', 
                    color: 'from-orange-500 to-cyan-500', 
                                    icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
                                    desc: 'Access government loan schemes and financial assistance programs',
                                    features: ['Low Interest Rates', 'Easy Application', 'Quick Approval'],
                    path: '/loans'
                  },
                  { 
                                    name: 'Internships', 
                                    color: 'from-green-500 to-emerald-500', 
                                    icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" /></svg>,
                                    desc: 'Find the perfect internship opportunities to kickstart your career',
                                    features: ['Top Companies', 'Remote Options', 'Mentorship'],
                    path: '/internships'
                  },
                  { 
                                    name: 'Legal Services', 
                                    color: 'from-purple-500 to-violet-500', 
                                    icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l-2.5 5M6 7l2.5 5m0 0l3-9m-3 9l3-9m-3 9l-2.5-5M15 7l2.5 5M15 7l-3 9m3-9l2.5 5M15 7l-2.5 5" /></svg>,
                                    desc: 'Professional legal support for all your business and personal needs',
                                    features: ['Expert Lawyers', '24/7 Support', 'Affordable Rates'],
                    path: '/legal'
                  },
                  { 
                                    name: 'Mentorship', 
                    color: 'from-orange-500 to-red-500', 
                                    icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>,
                                    desc: 'Connect with industry experts and get personalized guidance',
                                    features: ['Industry Experts', '1-on-1 Sessions', 'Career Guidance'],
                    path: '/mentors'
                  },
                  { 
                                    name: 'Training Programs', 
                    color: 'from-pink-500 to-rose-500', 
                                    icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
                                    desc: 'Comprehensive training programs to enhance your skills',
                    features: ['9 Modules', 'Quizzes', 'Certificate'],
                    path: '/training'
                  },
                                { 
                                    name: 'Development', 
                                    color: 'from-indigo-500 to-orange-500', 
                                    icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                                    desc: 'Custom app development solutions for your business needs',
                                    features: ['Custom Apps', 'Mobile & Web', 'Full Support'],
                                    path: '/app-development'
                                }
                ].map((service, index) => (
                  <div key={service.name} className="flex flex-col" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                    {/* Heading outside card on mobile, inside on desktop */}
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-0 md:hidden text-center">
                      {service.name}
                    </h3>
                    
                    {/* Mobile Card Design - Modern Premium Style */}
                    <motion.div
                      variants={scaleIn}
                      whileHover={{ y: -8, scale: 1.03 }}
                      onClick={(e) => handleServiceClick(e, service.path)}
                      className="md:hidden bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group cursor-pointer flex flex-col h-full overflow-hidden relative"
                    >
                      {/* Premium Image Section - Flush with edges */}
                      <div className={`h-28 bg-gradient-to-br ${service.color} flex items-center justify-center relative overflow-hidden`}>
                        {/* Dynamic gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
                        
                        {/* Premium icon container */}
                        <div className="relative z-10 transform group-hover:scale-125 group-hover:rotate-3 transition-all duration-500">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                            {service.icon}
                          </div>
                        </div>
                        
                        {/* Animated floating elements */}
                        <div className="absolute top-3 right-3 w-6 h-6 bg-white/30 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-3 left-3 w-4 h-4 bg-white/20 rounded-full animate-bounce"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                        
                        {/* Premium gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
                      </div>
                      
                      {/* Premium Content Section */}
                      <div className="p-5 flex flex-col h-full bg-gradient-to-b from-white via-gray-50/20 to-white relative">
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 opacity-3 bg-gradient-to-br from-orange-500/10 to-purple-500/10"></div>
                        
                        <div className="relative z-10">
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed text-center line-clamp-2 font-medium">
                            {service.desc}
                          </p>

                          <ul className="space-y-3 mb-5 flex-1">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-700 justify-center">
                                <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="font-medium text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handleServiceClick(e, service.path)}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300 text-sm shadow-lg relative overflow-hidden group"
                          >
                            <span className="relative z-10">Learn More</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Desktop Card Design */}
                    <motion.div
                      variants={scaleIn}
                      whileHover={{ y: -8, scale: 1.03 }}
                      onClick={(e) => handleServiceClick(e, service.path)}
                      className="hidden md:flex bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-500 group cursor-pointer h-full overflow-hidden relative"
                      data-aos="zoom-in"
                      data-aos-delay={`${index * 100}`}
                    >
                      {/* Premium Content Section */}
                      <div className="p-8 flex flex-col h-full bg-gradient-to-b from-white via-gray-50/30 to-white relative">
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-500/20 to-indigo-500/20"></div>
                        
                        <div className="relative z-10">
                          {/* Heading with enhanced styling */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                            {service.name}
                          </h3>

                          <p className="text-lg text-gray-600 mb-6 leading-relaxed text-left line-clamp-3 font-medium">
                            {service.desc}
                          </p>

                          <ul className="space-y-3 mb-8 flex-1">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-base text-gray-700 justify-start">
                                <div className="w-5 h-5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="font-semibold">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handleServiceClick(e, service.path)}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300 text-lg shadow-lg relative overflow-hidden group"
                          >
                            <span className="relative z-10">Learn More</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
            </div>
          </div>
        </section>

                {/* Desktop Why Choose Create Bharat + How It Works Section */}
                <section className="relative py-16 lg:py-20 bg-white overflow-hidden">
                    <div className="relative z-10 max-w-7xl mx-auto px-8">
                        <div className="grid grid-cols-1 gap-12">
                            {/* Why Choose Create Bharat - Modern Compact Design */}
                            <div 
                                className="relative"
                                data-aos="fade-up"
                            >
                                <div className="mb-8" data-aos="fade-down">
                                    <div className="mb-4 text-center">
                                        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            Why Choose Create Bharat
                                        </h2>
                                    </div>
                                    <p className="text-lg text-gray-600 leading-relaxed text-center">
                                        Your one-stop platform for career growth and business success
                                    </p>
                                </div>

                                {/* Compact Grid Layout - 3 columns with icons outside */}
                                <div 
                                    className="grid grid-cols-3 gap-4"
                                >
                                    {[
                                        { 
                                            Icon: LoanIcon, 
                                            title: 'Govt Loans', 
                                            shortDesc: 'Low rates',
                                            color: 'from-blue-500 to-indigo-600',
                                        },
                                        { 
                                            Icon: MentorIcon, 
                                            title: 'Mentorship', 
                                            shortDesc: 'Expert guide',
                                            color: 'from-purple-500 to-pink-600',
                                        },
                                        { 
                                            Icon: LegalIcon, 
                                            title: 'Legal Help', 
                                            shortDesc: 'Expert support',
                                            color: 'from-green-500 to-emerald-600',
                                        },
                                        { 
                                            Icon: TrainingIcon, 
                                            title: 'Free Training', 
                                            shortDesc: 'With certs',
                                            color: 'from-orange-500 to-red-600',
                                        },
                                        { 
                                            Icon: CompanyIcon, 
                                            title: 'Verified', 
                                            shortDesc: 'Trusted cos',
                                            color: 'from-cyan-500 to-blue-600',
                                        },
                                        { 
                                            Icon: ApprovalIcon, 
                                            title: 'Quick Process', 
                                            shortDesc: 'Fast approval',
                                            color: 'from-yellow-500 to-orange-600',
                                        }
                                    ].map((benefit, index) => {
                                        const IconComponent = benefit.Icon;
                                        return (
                                            <div key={benefit.title} className="flex flex-col items-center gap-3" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                                                {/* Icon outside box - above */}
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    className="relative w-14 h-14 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:border-blue-400 transition-all duration-300 cursor-pointer group"
                                                >
                                                    <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                                                    <IconComponent />
                                                    </div>
                                                </motion.div>
                                                
                                                {/* Box with text */}
                                                <motion.div 
                                                    whileHover={{ y: -5, scale: 1.05 }}
                                                    className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300 group cursor-pointer w-full"
                                                >
                                                    {/* Title and Description */}
                                                    <h3 className="text-sm font-bold text-gray-900 text-center mb-1 leading-tight group-hover:text-blue-700 transition-colors">{benefit.title}</h3>
                                                    <p className="text-xs text-gray-600 text-center leading-tight">{benefit.shortDesc}</p>
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* How It Works */}
                            <div 
                                className="relative"
                                data-aos="fade-up"
                            >
                                <div className="mb-10" data-aos="fade-down">
                                    <div className="mb-6 text-center">
                                        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                            How It Works
                                        </h2>
                                    </div>
                                    <p className="text-lg text-gray-600 leading-relaxed text-center">
                                        Get started in 4 simple steps and achieve your goals
                                    </p>
                                </div>

                                {/* Compact Grid Layout - 4 columns */}
                                <div 
                                    className="grid grid-cols-4 gap-4"
                                >
                                    {[
                                        { 
                                            step: '1', 
                                            title: 'Sign Up', 
                                            shortDesc: 'Create account',
                                            color: 'from-orange-500 to-amber-600',
                                        },
                                        { 
                                            step: '2', 
                                            title: 'Explore', 
                                            shortDesc: 'Browse services',
                                            color: 'from-amber-500 to-yellow-600',
                                        },
                                        { 
                                            step: '3', 
                                            title: 'Apply', 
                                            shortDesc: 'Submit request',
                                            color: 'from-yellow-500 to-orange-600',
                                        },
                                        { 
                                            step: '4', 
                                            title: 'Succeed', 
                                            shortDesc: 'Get support',
                                            color: 'from-orange-600 to-red-600',
                                        }
                                    ].map((step, index) => (
                                        <div key={step.step} className="flex flex-col items-center gap-3" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                                            {/* Step Number Circle - outside box above */}
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="relative w-14 h-14 bg-white border-2 border-orange-300 rounded-xl flex items-center justify-center text-orange-600 font-bold text-lg shadow-lg hover:shadow-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 cursor-pointer group"
                                            >
                                                <span className="group-hover:scale-110 transition-transform">{step.step}</span>
                                            </motion.div>
                                            
                                            {/* Box with text */}
                                            <motion.div 
                                                whileHover={{ y: -5, scale: 1.05 }}
                                                className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-300 group cursor-pointer w-full"
                                            >
                                                {/* Title and Description */}
                                                <h3 className="text-sm font-bold text-gray-900 text-center mb-1 leading-tight group-hover:text-orange-700 transition-colors">{step.title}</h3>
                                                <p className="text-xs text-gray-600 text-center leading-tight">{step.shortDesc}</p>
                                            </motion.div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Add CSS for blob animation */}
                    <style>{`
                        @keyframes blob {
                            0%, 100% {
                                transform: translate(0px, 0px) scale(1);
                            }
                            33% {
                                transform: translate(30px, -50px) scale(1.1);
                            }
                            66% {
                                transform: translate(-20px, 20px) scale(0.9);
                            }
                        }
                        .animate-blob {
                            animation: blob 7s infinite;
                        }
                        .animation-delay-2000 {
                            animation-delay: 2s;
                        }
                        .animation-delay-4000 {
                            animation-delay: 4s;
                        }
                    `}</style>
                </section>

                {/* Desktop Footer */}
                <footer className="bg-gray-900 text-white py-16">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                        <img src="/logo.png" alt="CreateBharat" className="w-6 h-6 object-contain" />
                                    </div>
                                    <h3 className="text-xl font-bold">CreateBharat</h3>
                                </div>
                                <p className="text-gray-400 mb-4">
                                    Empowering dreams through comprehensive career and business solutions.
                        </p>
                      </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Services</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><Link to="/loans" className="hover:text-white transition-colors">Loans</Link></li>
                                    <li><Link to="/internships" className="hover:text-white transition-colors">Internships</Link></li>
                                    <li><Link to="/legal" className="hover:text-white transition-colors">Legal Services</Link></li>
                                    <li><Link to="/mentors" className="hover:text-white transition-colors">Mentorship</Link></li>
                                </ul>
              </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Company</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                    <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                                </ul>
          </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Support</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                    <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                                    <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                            <p>&copy; 2025 CreateBharat. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Bank Account Opening Form Modal */}
            {showBankAccountForm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center px-4 md:px-6 z-50"
                    onClick={() => setShowBankAccountForm(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white w-full h-full md:w-[960px] md:h-auto md:max-h-[90vh] md:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 md:px-6 py-4 flex items-center justify-between z-10">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold">Bank Account Opening</h3>
                                <p className="text-blue-100 text-xs md:text-sm mt-1">Share your details to get matched with the right banking partner</p>
                            </div>
                            <button
                                onClick={() => setShowBankAccountForm(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <form onSubmit={handleBankAccountFormSubmit} className="flex-1 overflow-y-auto bg-gray-50/70">
                            <div className="px-5 md:px-6 py-6 md:py-8 space-y-6 md:space-y-7">
                                {/* Business Details */}
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">Business Details</h4>
                                            <p className="text-sm text-gray-500">Tell us about your business to help banks tailor their offer.</p>
                                        </div>
                                        <span className="hidden md:inline-flex items-center text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Step 1</span>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="border-2 border-gray-200 rounded-xl p-4 space-y-3">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Type of Business *
                                            </label>
                                            <select
                                                name="businessType"
                                                value={bankAccountFormData.businessType}
                                                onChange={handleBankAccountFormChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            >
                                                <option value="">Select business type</option>
                                                <option value="manufacturing">Manufacturing</option>
                                                <option value="service">Service</option>
                                                <option value="trading">Trading</option>
                                            </select>
                                        </div>

                                        <div className="border-2 border-gray-200 rounded-xl p-4 space-y-3">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Preferred Account *
                                            </label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {[
                                                    { label: 'Savings Account', value: 'savings', description: 'Best for personal & small savings' },
                                                    { label: 'Current Account', value: 'current', description: 'Ideal for businesses & higher transactions' }
                                                ].map(({ label, value, description }) => (
                                                    <label
                                                        key={value}
                                                        className={`h-full flex flex-col justify-between rounded-xl border-2 px-4 py-3 cursor-pointer transition-all ${
                                                            bankAccountFormData.accountType === value
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/40'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <input
                                                                type="radio"
                                                                name="accountType"
                                                                value={value}
                                                                checked={bankAccountFormData.accountType === value}
                                                                onChange={handleBankAccountFormChange}
                                                                required
                                                                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                            />
                                                            <div>
                                                                <span className="block text-sm font-semibold text-gray-900">{label}</span>
                                                                <span className="block text-xs text-gray-600 mt-1">{description}</span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                        {[
                                            {
                                                name: 'hasPanCard',
                                                label: 'PAN Card available?',
                                                description: 'Required for most business accounts'
                                            },
                                            {
                                                name: 'hasGst',
                                                label: 'GST registration?',
                                                description: 'Helps in accessing credit & facilities'
                                            },
                                            {
                                                name: 'hasUdyamMsmeCertificate',
                                                label: 'Udyam/MSME certificate?',
                                                description: 'Unlocks MSME banking benefits'
                                            }
                                        ].map(({ name, label, description }) => (
                                            <div key={name} className="border-2 border-gray-200 rounded-xl p-4 space-y-3">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    {label} *
                                                </label>
                                                <p className="text-xs text-gray-500">{description}</p>
                                                <div className="flex gap-4">
                                                    {['yes', 'no'].map((option) => (
                                                        <label key={option} className="inline-flex items-center gap-2 text-sm text-gray-700">
                                                            <input
                                                                type="radio"
                                                                name={name}
                                                                value={option}
                                                                checked={bankAccountFormData[name] === option}
                                                                onChange={handleBankAccountFormChange}
                                                                required
                                                                className="text-blue-600 focus:ring-blue-500"
                                                            />
                                                            {option === 'yes' ? 'Yes' : 'No'}
                                                        </label>
                                                    ))}
                                                </div>
                                            {bankAccountFormData[name] === 'yes' && (
                                                <div className="mt-3">
                                                    {name === 'hasPanCard' && (
                                                        <>
                                                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                                                PAN Number *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="panNumber"
                                                                value={bankAccountFormData.panNumber}
                                                                onChange={handleBankAccountFormChange}
                                                                required
                                                                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                                                                maxLength={10}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                                placeholder="ABCDE1234F"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">Enter your 10-character PAN (e.g. ABCDE1234F).</p>
                                                        </>
                                                    )}
                                                    {name === 'hasGst' && (
                                                        <>
                                                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                                                GST Number *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="gstNumber"
                                                                value={bankAccountFormData.gstNumber}
                                                                onChange={handleBankAccountFormChange}
                                                                required
                                                                pattern="[0-9A-Z]{15}"
                                                                maxLength={15}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                                placeholder="15-character GSTIN"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">Enter the 15-character GSTIN in uppercase.</p>
                                                        </>
                                                    )}
                                                    {name === 'hasUdyamMsmeCertificate' && (
                                                        <>
                                                            <label className="block text-xs font-medium text-gray-600 mb-2">
                                                                Udyam/MSME Registration Number *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="udyamMsmeNumber"
                                                                value={bankAccountFormData.udyamMsmeNumber}
                                                                onChange={handleBankAccountFormChange}
                                                                required
                                                                maxLength={25}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                                placeholder="e.g. UDYAM-XX-XX-XXXX"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">Provide the number printed on your Udyam/MSME certificate.</p>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                                        <span className="hidden md:inline-flex items-center text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Step 2</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={bankAccountFormData.fullName}
                                                onChange={handleBankAccountFormChange}
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={bankAccountFormData.email}
                                                onChange={handleBankAccountFormChange}
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={bankAccountFormData.phone}
                                                onChange={handleBankAccountFormChange}
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="+91 9876543210"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date of Birth *
                                            </label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={bankAccountFormData.dateOfBirth}
                                                onChange={handleBankAccountFormChange}
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <h4 className="text-lg font-semibold text-gray-900">Address Information</h4>
                                        <span className="hidden md:inline-flex items-center text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Step 3</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Address *
                                            </label>
                                            <textarea
                                                name="address"
                                                value={bankAccountFormData.address}
                                                onChange={handleBankAccountFormChange}
                                                required
                                                rows={3}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Enter your complete address"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={bankAccountFormData.city}
                                                    onChange={handleBankAccountFormChange}
                                                    required
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="City"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    State *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={bankAccountFormData.state}
                                                    onChange={handleBankAccountFormChange}
                                                    required
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="State"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Pincode *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    value={bankAccountFormData.pincode}
                                                    onChange={handleBankAccountFormChange}
                                                    required
                                                    pattern="[0-9]{6}"
                                                    maxLength="6"
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="123456"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Identification Details */}
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <h4 className="text-lg font-semibold text-gray-900">Identification Details</h4>
                                        <span className="hidden md:inline-flex items-center text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Step 4</span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Aadhaar Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="aadhaarNumber"
                                            value={bankAccountFormData.aadhaarNumber}
                                            onChange={handleBankAccountFormChange}
                                            required
                                            pattern="[0-9]{12}"
                                            maxLength={12}
                                            inputMode="numeric"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Enter 12-digit Aadhaar number"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Your Aadhaar will be used for KYC verification. Ensure the number matches official records.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-5 md:px-6 py-4 border-t border-gray-200 bg-white">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowBankAccountForm(false)}
                                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                                            submitting ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {submitting ? '⏳ Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
    </>
  );
};

export default HomePage;