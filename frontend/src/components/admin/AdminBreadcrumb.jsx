import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronRight, FaHome } from 'react-icons/fa';

const AdminBreadcrumb = () => {
    const location = useLocation();

    
    const getBreadcrumbs = () => {
        const pathSegments = location.pathname.split('/').filter(segment => segment);
        const breadcrumbs = [];

        // Always start with Dashboard
        breadcrumbs.push({
            name: 'Dashboard',
            path: '/admin/dashboard',
            isActive: location.pathname === '/admin/dashboard'
        });

        // Add other segments
        if (pathSegments.length > 1) {
            const currentPath = pathSegments[1];
            const pathMap = {
                'loans': { name: 'Loans', path: '/admin/loans' },
                'legal': { name: 'Legal Services', path: '/admin/legal' },
                'training': { name: 'Training', path: '/admin/training' },
                'users': { name: 'Users', path: '/admin/users' },
                'analytics': { name: 'Analytics', path: '/admin/analytics' },
                'settings': { name: 'Settings', path: '/admin/settings' }
            };

            if (pathMap[currentPath]) {
                breadcrumbs.push({
                    ...pathMap[currentPath],
                    isActive: location.pathname === pathMap[currentPath].path
                });
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    // Don't show breadcrumb on dashboard
    if (location.pathname === '/admin/dashboard') {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-gray-200 px-4 lg:px-6"
        >
            <nav className="flex items-center space-x-2 py-3">
                <Link
                    to="/admin/dashboard"
                    className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <FaHome className="w-4 h-4 mr-1" />
                    <span className="text-sm">Admin</span>
                </Link>

                {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={breadcrumb.path}>
                        <FaChevronRight className="w-3 h-3 text-gray-400" />
                        {breadcrumb.isActive ? (
                            <span className="text-sm font-medium text-gray-900">
                                {breadcrumb.name}
                            </span>
                        ) : (
                            <Link
                                to={breadcrumb.path}
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {breadcrumb.name}
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </nav>
        </motion.div>
    );
};

export default AdminBreadcrumb;
