import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminBreadcrumb from './AdminBreadcrumb';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check if user is authenticated as admin
    useEffect(() => {
        // Simple admin check - in production, this would be more robust
        const isAdmin = localStorage.getItem('userType') === 'admin' && 
                       localStorage.getItem('isAdmin') === 'true';
        
        if (!isAdmin) {
            // Redirect to admin login page with current location for redirect after login
            navigate('/admin/login', { 
                state: { from: { pathname: location.pathname } },
                replace: true 
            });
        }
    }, [navigate, location.pathname]);

    // Handle responsive design
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Close sidebar on mobile when route changes
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [location.pathname, isMobile]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AdminSidebar 
                isOpen={sidebarOpen} 
                isMobile={isMobile}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content area */}
            <div className={`transition-all duration-300 ${
                sidebarOpen && !isMobile ? 'lg:ml-64' : 'lg:ml-0'
            }`}>
                {/* Header */}
                <AdminHeader 
                    onToggleSidebar={toggleSidebar}
                    sidebarOpen={sidebarOpen}
                />

                {/* Breadcrumb */}
                <AdminBreadcrumb />

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-7xl mx-auto"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
