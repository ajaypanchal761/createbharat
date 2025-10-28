import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNavbar from '../../components/common/BottomNavbar';

// Bottom Nav Icons
const HomeIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> );
const SearchIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> );
const HeartIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> );
const ClipboardIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> );
const UserIcon = ({ active }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Mock course data - same as in InternshipsPage
  const placementCourses = [
    { 
      id: 1, 
      title: 'Full Stack Web Development', 
      company: 'Tech Academy Pro',
      location: 'Online',
      duration: '6 months',
      type: 'Full-time',
      postedDate: '1 week ago',
      category: 'Technology',
      stipend: '₹25,000 - ₹40,000',
      rating: '4.8',
      students: '2,450 enrolled',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      color: 'from-orange-500 to-cyan-500',
      placement: '95% placement rate',
      description: 'Comprehensive full-stack web development course covering frontend, backend, and database technologies. Learn modern frameworks and tools used in the industry.',
      curriculum: [
        'HTML5 & CSS3 Fundamentals',
        'JavaScript ES6+ & DOM Manipulation',
        'React.js & Redux',
        'Node.js & Express.js',
        'MongoDB & Database Design',
        'RESTful APIs & GraphQL',
        'Authentication & Security',
        'Deployment & DevOps'
      ],
      requirements: [
        'Basic computer knowledge',
        'Logical thinking ability',
        'Dedication to learn',
        'Laptop/Computer with internet'
      ],
      benefits: [
        'Industry-relevant curriculum',
        'Live project experience',
        'Mentorship from experts',
        'Job placement assistance',
        'Certificate of completion',
        'Lifetime access to materials'
      ]
    },
    { 
      id: 2, 
      title: 'Data Science & Analytics', 
      company: 'Data Skills Institute',
      location: 'Hybrid',
      duration: '5 months',
      type: 'Full-time',
      postedDate: '3 days ago',
      category: 'Data Science',
      stipend: '₹30,000 - ₹50,000',
      rating: '4.9',
      students: '1,890 enrolled',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      color: 'from-purple-500 to-pink-500',
      placement: '92% placement rate',
      description: 'Master data science and analytics with hands-on experience in Python, machine learning, and statistical analysis. Build real-world projects and get job-ready.',
      curriculum: [
        'Python Programming',
        'Statistics & Mathematics',
        'Data Visualization',
        'Machine Learning Algorithms',
        'Deep Learning & Neural Networks',
        'Big Data Technologies',
        'SQL & Database Management',
        'Data Engineering & ETL'
      ],
      requirements: [
        'Basic mathematics knowledge',
        'Logical reasoning skills',
        'Problem-solving mindset',
        'Computer with Python installed'
      ],
      benefits: [
        'Real-world project portfolio',
        'Industry mentorship',
        'Job placement support',
        'Certification program',
        'Networking opportunities',
        'Career guidance'
      ]
    },
    { 
      id: 3, 
      title: 'Digital Marketing Mastery', 
      company: 'Marketing Pro',
      location: 'Remote',
      duration: '4 months',
      type: 'Part-time',
      postedDate: '5 days ago',
      category: 'Marketing',
      stipend: '₹20,000 - ₹35,000',
      rating: '4.7',
      students: '3,120 enrolled',
      icon: '📢',
      color: 'from-orange-500 to-red-500',
      placement: '88% placement rate',
      description: 'Comprehensive digital marketing course covering all aspects of online marketing, from SEO to social media advertising and analytics.',
      curriculum: [
        'Digital Marketing Fundamentals',
        'SEO & Content Marketing',
        'Social Media Marketing',
        'Google Ads & PPC',
        'Email Marketing',
        'Analytics & Reporting',
        'E-commerce Marketing',
        'Marketing Automation'
      ],
      requirements: [
        'Basic computer skills',
        'Creative thinking',
        'Communication skills',
        'Internet connection'
      ],
      benefits: [
        'Hands-on campaign experience',
        'Industry certification',
        'Portfolio development',
        'Job placement assistance',
        'Networking events',
        'Ongoing support'
      ]
    },
    { 
      id: 4, 
      title: 'UI/UX Design Pro', 
      company: 'Design Academy',
      location: 'Online',
      duration: '5 months',
      type: 'Full-time',
      postedDate: '2 days ago',
      category: 'Design',
      stipend: '₹22,000 - ₹38,000',
      rating: '4.8',
      students: '1,650 enrolled',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" /></svg>,
      color: 'from-emerald-500 to-teal-500',
      placement: '90% placement rate',
      description: 'Master UI/UX design principles and tools. Learn user research, wireframing, prototyping, and design systems to create exceptional user experiences.',
      curriculum: [
        'Design Thinking Process',
        'User Research & Analysis',
        'Wireframing & Prototyping',
        'Visual Design Principles',
        'Figma & Adobe XD',
        'Design Systems',
        'Usability Testing',
        'Mobile & Web Design'
      ],
      requirements: [
        'Creative mindset',
        'Basic design sense',
        'Computer with design software',
        'Portfolio development interest'
      ],
      benefits: [
        'Professional portfolio',
        'Industry mentorship',
        'Design certification',
        'Job placement support',
        'Design community access',
        'Freelance opportunities'
      ]
    }
  ];

  const course = placementCourses.find(c => c.id === parseInt(courseId));

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link to="/internships" className="text-orange-600 hover:text-orange-700">
            Back to Internships
          </Link>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    setIsEnrolling(true);
    // Simulate enrollment process
    setTimeout(() => {
      alert(`Successfully enrolled in ${course.title}! You will receive confirmation details via email.`);
      setIsEnrolling(false);
    }, 2000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-indigo-100 pb-32">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-white/90 backdrop-blur-lg border-b border-gradient-to-r from-orange-200 to-purple-200 shadow-lg"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.1, x: -2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gradient-to-r from-orange-100 to-purple-100 hover:from-orange-200 hover:to-purple-200 transition-all duration-300"
            onClick={() => navigate('/internships')}
          >
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Course Details
          </motion.h1>
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <div className="px-4 pt-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          {/* Course Header */}
          <motion.div
            variants={fadeInUp}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40 mb-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${course.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
                {course.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-xl text-gray-600 mb-4">{course.company}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {course.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {course.stipend}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500">{course.rating}</div>
                <div className="text-sm text-gray-500">{course.students}</div>
                <div className="text-sm font-medium text-green-600">{course.placement}</div>
              </div>
            </div>
          </motion.div>

          {/* Course Description */}
          <motion.div
            variants={fadeInUp}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Curriculum */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Curriculum</h3>
              <ul className="space-y-3">
                {course.curriculum.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Requirements */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-3">
                {course.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Benefits */}
          <motion.div
            variants={fadeInUp}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40 mb-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">What You'll Get</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Enroll Button */}
          <motion.div
            variants={fadeInUp}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnroll}
              disabled={isEnrolling}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                isEnrolling
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl'
              }`}
            >
              {isEnrolling ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enrolling...
                </div>
              ) : (
                'Enroll Now'
              )}
            </motion.button>
            <p className="text-sm text-gray-500 mt-3">
              Join {course.students} students already enrolled
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar 
        tabs={[
          { name: 'Home', path: '/', icon: <HomeIcon /> },
          { name: 'Search', path: '/internships', icon: <SearchIcon /> },
          { name: 'Saved', path: '/internships/saved', icon: <HeartIcon /> },
          { name: 'Applied', path: '/internships/applied', icon: <ClipboardIcon /> },
          { name: 'Profile', path: '/internships/profile', icon: <UserIcon /> }
        ]}
      />
    </div>
  );
};

export default CourseDetailPage;
