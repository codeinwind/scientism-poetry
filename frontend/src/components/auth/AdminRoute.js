import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Check if user is authenticated and has admin or superadmin role
  if (!isAuthenticated || !['admin', 'superadmin'].includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
