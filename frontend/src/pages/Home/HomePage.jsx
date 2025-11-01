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
    
    // Bank Account Opening Form State
    const [showBankAccountForm, setShowBankAccountForm] = useState(false);
    const [bankAccountFormData, setBankAccountFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Bank Account Form Handlers
    const handleBankAccountFormChange = (e) => {
        setBankAccountFormData({
            ...bankAccountFormData,
            [e.target.name]: e.target.value
        });
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
                    fullName: '',
                    email: '',
                    phone: '',
                    dateOfBirth: '',
                    address: '',
                    city: '',
                    state: '',
                    pincode: ''
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

    // Initialize AOS for animations
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: function() {
                // Disable on desktop (only for mobile)
                return window.innerWidth > 768;
            }
        });
        
        // Refresh AOS when content changes
        return () => {
            AOS.refresh();
        };
    }, []);

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

    // Trending data
    const trendingItems = [
        { id: 1, title: 'MUDRA Loan', category: 'Finance', trend: '+25%', color: 'bg-green-100 text-green-800', path: '/loans' },
        { id: 2, title: 'Tech Internships', category: 'Career', trend: '+18%', color: 'bg-orange-100 text-orange-800', path: '/internships' },
        { id: 3, title: 'Startup India', category: 'Business', trend: '+32%', color: 'bg-purple-100 text-purple-800', path: '/loans' },
        { id: 4, title: 'Legal Help', category: 'Legal', trend: '+15%', color: 'bg-orange-100 text-orange-800', path: '/legal' },
        { id: 5, title: 'Mentorship', category: 'Learning', trend: '+28%', color: 'bg-pink-100 text-pink-800', path: '/mentors' },
        { id: 6, title: 'Skill Training', category: 'Education', trend: '+22%', color: 'bg-indigo-100 text-indigo-800', path: '/training' }
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
                        className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl border-r border-gray-200 z-50 overflow-y-auto"
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
                                <div className="space-y-3">
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
                                name: 'Loans', 
                                image: govLoanImg,
                                path: '/loans'
                            },
                            { 
                                name: 'Internships', 
                                image: internshipImg,
                                path: '/internships'
                            },
                            { 
                                name: 'Legal Services', 
                                image: legalServicesImg,
                                path: '/legal'
                            },
                            { 
                                name: 'Mentorship', 
                                image: mentorSupportImg,
                                path: '/mentors'
                            },
                            { 
                                name: 'Training', 
                                image: trainingImg,
                                path: '/training'
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

                    {/* Bank Account Service Card - Direct without wrapper */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 md:p-4 mb-4 shadow-lg ring-1 ring-white/10 w-full" data-aos="fade-left" data-aos-delay="200">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1">
                                <span className="text-4xl md:text-3xl">🏦</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-lg md:text-base">Bank Account Opening</h3>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowBankAccountForm(true)}
                                className="px-5 py-2.5 md:px-4 md:py-2 bg-white text-blue-600 font-semibold rounded-lg text-sm whitespace-nowrap flex-shrink-0"
                            >
                                Fill Form
                            </button>
                        </div>
                    </div>

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

                    {/* Trending Services */}
                    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-2xl p-6" data-aos="zoom-in" data-aos-delay="500">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Trending Services
                        </h2>
                        <div className="grid grid-cols-2 gap-2">
                            {trendingItems.slice(0, 4).map((item, index) => (
                                <div 
                                    key={item.id}
                                    onClick={(e) => handleServiceClick(e, item.path)}
                                    className="bg-white rounded-xl p-4 shadow-lg ring-1 ring-black/5 cursor-pointer hover:shadow-xl hover:ring-blue-300 transition-all duration-300"
                                    data-aos="fade-up"
                                    data-aos-delay={`${index * 100}`}
                                >
                                    <div className="flex flex-col space-y-1">
                                        <h3 className="text-sm font-semibold text-gray-900 leading-tight">{item.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-500">{item.category}</p>
                                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${item.color}`}>
                                                {item.trend}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                   </div>

                   {/* Success Stories Section */}
                   <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 mb-6" data-aos="flip-up" data-aos-delay="600">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Success Stories
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { name: 'Rajesh Kumar', story: 'Got ₹5L MUDRA loan', achievement: 'Started Restaurant', image: '👨‍🍳' },
                                { name: 'Priya Sharma', story: 'Completed Training', achievement: 'Got Job at TCS', image: '👩‍💼' },
                                { name: 'Amit Singh', story: 'Legal Help', achievement: 'Business Registration', image: '👨‍💼' }
                            ].map((story, index) => (
                                <div 
                                    key={story.name}
                                    className="bg-white rounded-xl p-4 shadow-md flex items-center space-x-3"
                                    data-aos="slide-right"
                                    data-aos-delay={`${index * 100}`}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-2xl">
                                        {story.image}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{story.name}</h3>
                                        <p className="text-sm text-gray-600">{story.story}</p>
                                        <p className="text-xs text-green-600 font-medium">{story.achievement}</p>
                                    </div>
                                </div>
                            ))}
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
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                                <Link to="/" className="flex items-center gap-2 md:gap-3 lg:gap-5">
                                    <img src="/logo.png" alt="CreateBharat" className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain flex-shrink-0" />
                                    <div className="min-w-0">
                                        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate">CreateBharat</h1>
                                        <p className="text-xs md:text-sm text-gray-600 font-medium truncate hidden md:block">Empowering Your Dreams</p>
                                    </div>
                        </Link>
            </div>

                            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-4 flex-wrap justify-center flex-1 mx-2 md:mx-4">
                                <Link to="/" className="px-2 lg:px-3 xl:px-4 2xl:px-6 py-2 lg:py-2.5 xl:py-3 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Home</Link>
                                <Link to="/loans" className="px-2 lg:px-3 xl:px-4 2xl:px-6 py-2 lg:py-2.5 xl:py-3 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Loans</Link>
                                <Link to="/internships" className="px-2 lg:px-3 xl:px-4 2xl:px-6 py-2 lg:py-2.5 xl:py-3 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Internships</Link>
                                <Link to="/legal" className="px-2 lg:px-3 xl:px-4 2xl:px-6 py-2 lg:py-2.5 xl:py-3 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Legal</Link>
                                <Link to="/mentors" className="px-2 lg:px-3 xl:px-4 2xl:px-6 py-2 lg:py-2.5 xl:py-3 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Mentors</Link>
                                <Link to="/training" className="px-2 lg:px-3 xl:px-4 2xl:px-6 py-2 lg:py-2.5 xl:py-3 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Training</Link>
                                <Link to="/app-development" className="px-2 lg:px-3 xl:px-4 2xl:px-6 py-2 lg:py-2.5 xl:py-3 text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors whitespace-nowrap rounded-lg hover:bg-gray-50">Web Development</Link>
                            </nav>
                            
                            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                                <div className="flex items-center gap-1.5 md:gap-3">
                                    {isAuthenticated() ? (
                                        <>
                                            <Link 
                                                to="/profile"
                                                className="px-3 md:px-6 py-2 bg-white text-blue-600 font-semibold text-xs md:text-sm rounded-lg hover:bg-gray-50 transition-all duration-300 border border-blue-200 whitespace-nowrap"
                                            >
                                                Profile
                                            </Link>
                                    <button 
                                            onClick={() => {
                                                userLogout();
                                                navigate('/');
                                            }}
                                            className="px-3 md:px-6 py-2 bg-red-600 text-white font-semibold text-xs md:text-sm rounded-lg hover:bg-red-700 transition-all duration-300 whitespace-nowrap"
                                        >
                                            Logout
                                    </button>
                                        </>
                                    ) : (
                                    <button 
                                            onClick={() => navigate('/login')}
                                        className="px-3 md:px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-xs md:text-sm rounded-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap"
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
                <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                        Empower Your
                                        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent"> Dreams</span>
                                    </h1>
                                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                        Discover government loan schemes, explore career opportunities through internships, access expert legal services, and connect with experienced mentors. Your one-stop platform for career growth and business success in India.
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-8 pt-8">
                      <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">10K+</div>
                                        <div className="text-sm text-gray-600">Active Users</div>
                      </div>
                      <div className="text-center">
                                        <div className="text-3xl font-bold text-indigo-600">500+</div>
                                        <div className="text-sm text-gray-600">Success Stories</div>
                      </div>
                      <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">50+</div>
                                        <div className="text-sm text-gray-600">Partners</div>
                      </div>
                    </div>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative"
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
                                                    className="relative w-full"
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bank Account Service Banner - Desktop */}
        <section className="hidden md:block py-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-3xl">🏦</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Bank Account Opening</h3>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBankAccountForm(true)}
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-lg"
                >
                  Fill Form
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

                {/* Desktop Services Section */}
                <section className="py-16 lg:py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-8">
            <motion.div 
              initial="hidden"
                            animate="visible"
              variants={staggerContainer}
                            className="text-center mb-16"
                        >
              <motion.h2 
                variants={fadeInUp}
                                className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
                            >
                                Our Services
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                                Comprehensive solutions for your career and business growth
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
                            animate="visible"
              variants={staggerContainer}
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
                  <div key={service.name} className="flex flex-col">
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
            </motion.div>
          </div>
        </section>

                {/* Desktop Stats Section */}
                <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="max-w-7xl mx-auto px-8">
            <motion.div 
              initial="hidden"
                            animate="visible"
              variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {[
                                { number: '10,000+', label: 'Active Users', icon: '👥' },
                                { number: '500+', label: 'Success Stories', icon: '🎉' },
                                { number: '50+', label: 'Partner Companies', icon: '🏢' },
                                { number: '95%', label: 'Success Rate', icon: '📈' }
                            ].map((stat, index) => (
              <motion.div 
                                    key={stat.label}
                variants={fadeInUp}
                                    className="text-center text-white"
                                >
                                    <div className="text-5xl mb-2">{stat.icon}</div>
                                    <div className="text-4xl font-bold mb-2">{stat.number}</div>
                                    <div className="text-lg opacity-90">{stat.label}</div>
            </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Desktop Success Stories Section */}
                <section className="py-16 lg:py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                    <div className="max-w-7xl mx-auto px-8">
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="text-center mb-16"
                        >
                            <motion.h2 
                                variants={fadeInUp}
                                className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
                            >
                                Success Stories
                            </motion.h2>
                            <motion.p 
                                variants={fadeInUp}
                                className="text-xl text-gray-600 max-w-3xl mx-auto"
                            >
                                Real people, real results - see how we've helped transform lives
                            </motion.p>
                        </motion.div>

                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {[
                                { name: 'Rajesh Kumar', story: 'Got ₹5L MUDRA loan', achievement: 'Started Restaurant', image: '👨‍🍳', location: 'Mumbai' },
                                { name: 'Priya Sharma', story: 'Completed Training', achievement: 'Got Job at TCS', image: '👩‍💼', location: 'Bangalore' },
                                { name: 'Amit Singh', story: 'Legal Help', achievement: 'Business Registration', image: '👨‍💼', location: 'Delhi' }
                            ].map((story, index) => (
                                <motion.div 
                                    key={story.name}
                                    variants={fadeInUp}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="text-center mb-6">
                                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                                            {story.image}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{story.name}</h3>
                                        <p className="text-gray-600 mb-2">{story.location}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-700 mb-2">{story.story}</p>
                                        <p className="text-green-600 font-semibold">{story.achievement}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
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
                            <p>&copy; 2024 CreateBharat. All rights reserved.</p>
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
                    className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setShowBankAccountForm(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white w-full h-full md:rounded-none overflow-y-auto shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 md:rounded-t-2xl flex items-center justify-between z-10">
                            <div>
                                <h3 className="text-2xl font-bold">Bank Account Opening</h3>
                                <p className="text-blue-100 text-sm mt-1">Fill in your details</p>
                            </div>
                            <button
                                onClick={() => setShowBankAccountForm(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <form onSubmit={handleBankAccountFormSubmit} className="p-6 space-y-4 flex-1">
                            {/* Personal Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
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
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h4>
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

                            {/* Modal Footer */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
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
                                    {submitting ? '⏳ Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
    </>
  );
};

export default HomePage;