// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Grid, Paper, Tabs, Tab, 
  Button, CircularProgress, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Sidebar from '../components/common/Sidebar';
import Toast from '../components/common/Toast';
import UserDashboard from '../components/dashboard/UserDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    type: 'info'
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/dashboard', message: 'Please login to view your dashboard' } });
    }
  }, [user, authLoading, navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };
  console.log("authLoading",authLoading)
  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Container>
        <Footer />
      </Box>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1">
                Dashboard
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => navigate('/jobs/create')}
              >
                Post New Job
              </Button>
            </Box>

            {user.role === 'admin' ? (
              <AdminDashboard setToast={setToast} />
            ) : (
              <>
                <Paper sx={{ width: '100%', mb: 4 }}>
                  <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard tabs" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="My Listings" />
                    <Tab label="Bookmarked Jobs" />
                    <Tab label="Profile" />
                  </Tabs>
                  <Box p={3}>
                    <UserDashboard activeTab={activeTab} setToast={setToast} />
                  </Box>
                </Paper>
              </>
            )}
          </Container>
        </Box>
      </Box>
      <Footer />
      <Toast 
        open={toast.open} 
        message={toast.message} 
        severity={toast.type} 
        onClose={handleCloseToast} 
      />
    </Box>
  );
};

export default DashboardPage;