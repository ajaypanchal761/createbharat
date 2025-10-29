import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/mobile-login',
  '/terms',
  '/admin',
  '/admin/login',
  '/company/login',
  '/company/signup',
  '/ca/login',
  '/ca/signup',
  '/mentors/login',
  '/mentors/signup',
];

export default function ProtectedRoute({ children }) {
  const { user, isLoading, isAuthenticated } = useUser();
  const location = useLocation();

  const path = location.pathname || '/';
  const isPublic = publicPaths.some(p => path === p || path.startsWith(p + '/')) || path === '/';

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isPublic) return children;

  const isAuth = isAuthenticated ? isAuthenticated() : false;

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: path }} replace />;
  }

  return children;
}
