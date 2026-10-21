import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--slate-muted)' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Loading AdmitWise session...</div>
        <div style={{ fontSize: '0.9rem' }}>Verifying your credentials</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
