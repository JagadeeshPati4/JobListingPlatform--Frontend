// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';


// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JobDetailPage from './pages/JobDetailPage';
import CreateJobPage from './pages/CreateJobPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';



const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Header />
            <main style={{ minHeight: 'calc(100vh - 128px)', padding: '24px 0' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route 
                  path="/jobs/create/" 
                  element={ <ProtectedRoute>
                    <CreateJobPage />
                  </ProtectedRoute>} 
                />
                <Route 
                  path="/jobs/edit/:id" 
                  element={<ProtectedRoute element={<CreateJobPage />} />} 
                />
                <Route 
                  path="/dashboard/*" 
                  element={<ProtectedRoute element={<DashboardPage />} />} 
                />
                 <Route 
                  path="/profile" 
                  element={<ProtectedRoute element={<ProfilePage  />} />} 
                  />
                 <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;