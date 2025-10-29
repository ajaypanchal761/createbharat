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
];

export default function ProtectedRoute({ children }) {
  const user = useUser();
  const location = useLocation();

  const path = location.pathname || '/';
  const isPublic = publicPaths.some(p => path === p || path.startsWith(p + '/')) || path === '/';

  const isAuth = Boolean(user && typeof user.isAuthenticated === 'function' ? user.isAuthenticated() : false);

  if (isPublic) return children;

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: path }} replace />;
  }

  return children;
}
