import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  console.log('isAuthenticated',isAuthenticated);
  console.log('isAdmin',isAdmin); 
  console.log('loading',loading);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    if (adminOnly && !isAdmin) {
      return <Navigate to="/dashboard" />;
    }
  console.log('children routed',children);
  return children;
};

export default ProtectedRoute;