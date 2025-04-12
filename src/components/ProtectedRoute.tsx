
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  requireSuperAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireSuperAdmin = false }) => {
  const { user, isLoading, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // While we're checking authentication status, show a loading state
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-powerbi-primary"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires super admin and user is not super admin
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated (and has required role if specified), render children
  return <Outlet />;
};

export default ProtectedRoute;
