// src/components/dashboard/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Button, CircularProgress, 
  TextField, Avatar, IconButton, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { 
  fetchUserJobs, deleteJob, updateUser, 
  fetchBookmarkedJobs, removeBookmark 
} from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import JobCard from '../jobs/JobCard';

const UserDashboard = ({ activeTab, setToast }) => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [userJobs, setUserJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    jobId: null
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === 0) {
          const jobs = await fetchUserJobs();
          setUserJobs(jobs);
        } else if (activeTab === 1) {
          const bookmarked = await fetchBookmarkedJobs();
          setBookmarkedJobs(bookmarked);
        }
      } catch (error) {
        setToast({
          open: true,
          message: 'Failed to load data',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, setToast]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (profileData.newPassword !== profileData.confirmPassword) {
      setToast({
        open: true,
        message: 'New passwords do not match',
        type: 'error'
      });
      return;
    }
    
    try {
      const updatedUser = await updateUser({
        name: profileData.name,
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword || undefined
      });
      
      updateUserProfile(updatedUser);
      
      setToast({
        open: true,
        message: 'Profile updated successfully',
        type: 'success'
      });
      
      setProfileData({
        ...profileData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to update profile',
        type: 'error'
      });
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId);
      setUserJobs(userJobs.filter(job => job.id !== jobId));
      setToast({
        open: true,
        message: 'Job deleted successfully',
        type: 'success'
      });
    } catch (error) {
      setToast({
        open: true,
        message: 'Failed to delete job',
        type: 'error'
      });
    } finally {
      setDeleteConfirm({
        open: false,
        jobId: null
      });
    }
  };

  const handleRemoveBookmark = async (jobId) => {
    try {
      await removeBookmark(jobId);
      setBookmarkedJobs(bookmarkedJobs.filter(job => job.id !== jobId));
      setToast({
        open: true,
        message: 'Job removed from bookmarks',
        type: 'success'
      });
    } catch (error) {
      setToast({
        open: true,
        message: 'Failed to remove bookmark',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // My Job Listings Tab
  if (activeTab === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          My Job Listings
        </Typography>
        {userJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You haven't created any job listings yet.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/jobs/create')}
            >
              Create Your First Job Listing
            </Button>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="jobs table">
              <TableHead>
                <TableRow>
                  <TableCell>Job Position</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Posted Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.jobPosition}</TableCell>
                    <TableCell>{job.companyName}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>${job.monthlySalary}/month</TableCell>
                    <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        title="View"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/jobs/edit/${job.id}`)}
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => setDeleteConfirm({ open: true, jobId: job.id })}
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirm.open}
          onClose={() => setDeleteConfirm({ open: false, jobId: null })}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this job listing? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm({ open: false, jobId: null })}>Cancel</Button>
            <Button 
              onClick={() => handleDeleteJob(deleteConfirm.jobId)} 
              color="error" 
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Bookmarked Jobs Tab
  if (activeTab === 1) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Bookmarked Jobs
        </Typography>
        {bookmarkedJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You haven't bookmarked any jobs yet.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/jobs')}
            >
              Browse Jobs
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {bookmarkedJobs.map(job => (
              <Grid item xs={12} md={6} key={job.id}>
                <JobCard 
                  job={job} 
                  bookmarked={true} 
                  onBookmarkClick={() => handleRemoveBookmark(job.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  }

  // Profile Tab
  if (activeTab === 2) {
    return (
      <Box component="form" onSubmit={handleUpdateProfile}>
        <Typography variant="h6" gutterBottom>
          Profile Information
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ width: 80, height: 80, mr: 3 }}
            src={user?.profilePicture || ''}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since: {new Date(user?.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profileData.email}
              disabled
              helperText="Email cannot be changed"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Change Password
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type="password"
              value={profileData.currentPassword}
              onChange={handleProfileChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={profileData.newPassword}
              onChange={handleProfileChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={profileData.confirmPassword}
              onChange={handleProfileChange}
              error={profileData.newPassword !== profileData.confirmPassword && profileData.confirmPassword !== ''}
              helperText={profileData.newPassword !== profileData.confirmPassword && profileData.confirmPassword !== '' ? "Passwords don't match" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ mt: 2 }}
            >
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return null;
};

export default UserDashboard;