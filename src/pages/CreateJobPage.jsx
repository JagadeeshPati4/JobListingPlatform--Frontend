// src/pages/CreateJobPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper } from '@mui/material';
import JobForm from '../components/jobs/JobForm';
import Toast from '../components/common/Toast';
import { createJob } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const CreateJobPage = () => {
  console.log('CreateJobPage');
  const navigate = useNavigate();
  const { isAuthenticated,currentUser } = useAuth();
  const [toast, setToast] = useState({
    open: false,
    message: '',
    type: 'info'
  });

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/jobs/create', message: 'Please login to create a job' } });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (jobData) => {
    console.log('jobData',jobData);
    try {
      await createJob(jobData);
      setToast({
        open: true,
        message: 'Job listing created successfully!',
        type: 'success'
      });
      
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to create job listing',
        type: 'error'
      });
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Job Listing
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Fill in the details below to create a new job listing.
          </Typography>
          <JobForm onSubmit={handleSubmit} />
        </Paper>
      </Container>
      <Toast 
        open={toast.open} 
        message={toast.message} 
        severity={toast.type} 
        onClose={handleCloseToast} 
      />
    </Box>
  );
};

export default CreateJobPage;