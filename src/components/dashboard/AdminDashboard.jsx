// src/components/dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Tabs, Tab, Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, Switch, Chip, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { 
  fetchAllUsers, fetchAllJobs, toggleUserStatus, 
  toggleJobStatus, deleteJob, deleteUser
} from '../../utils/api';

const AdminDashboard = ({ setToast }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    type: null, // 'user' or 'job'
    id: null
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === 0) {
          const usersData = await fetchAllUsers();
          setUsers(usersData);
        } else if (activeTab === 1) {
          const jobsData = await fetchAllJobs();
          setJobs(jobsData);
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await toggleUserStatus(userId, !currentStatus);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, active: !currentStatus } : user
      ));
      setToast({
        open: true,
        message: `User ${currentStatus ? 'deactivated' : 'activated'} successfully`,
        type: 'success'
      });
    } catch (error) {
      setToast({
        open: true,
        message: 'Failed to update user status',
        type: 'error'
      });
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    try {
      await toggleJobStatus(jobId, !currentStatus);
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, active: !currentStatus } : job
      ));
      setToast({
        open: true,
        message: `Job ${currentStatus ? 'deactivated' : 'activated'} successfully`,
        type: 'success'
      });
    } catch (error) {
      setToast({
        open: true,
        message: 'Failed to update job status',
        type: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteConfirm.type === 'user') {
        await deleteUser(deleteConfirm.id);
        setUsers(users.filter(user => user.id !== deleteConfirm.id));
        setToast({
          open: true,
          message: 'User deleted successfully',
          type: 'success'
        });
      } else if (deleteConfirm.type === 'job') {
        await deleteJob(deleteConfirm.id);
        setJobs(jobs.filter(job => job.id !== deleteConfirm.id));
        setToast({
          open: true,
          message: 'Job deleted successfully',
          type: 'success'
        });
      }
    } catch (error) {
      setToast({
        open: true,
        message: `Failed to delete ${deleteConfirm.type}`,
        type: 'error'
      });
    } finally {
      setDeleteConfirm({
        open: false,
        type: null,
        id: null
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

  return (
    <Box>
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="admin dashboard tabs">
          <Tab label="Manage Users" />
          <Tab label="Manage Job Listings" />
        </Tabs>
        <Box p={3}>
          {activeTab === 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                User Management
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="users table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Joined Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            color={user.role === 'admin' ? 'secondary' : 'primary'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={user.active}
                            onChange={() => handleToggleUserStatus(user.id, user.active)}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton 
                            size="small"
                            disabled={user.role === 'admin'}
                            onClick={() => setDeleteConfirm({ open: true, type: 'user', id: user.id })}
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
            </>
          )}
          
          {activeTab === 1 && (
            <>
              <Typography variant="h6" gutterBottom>
                Job Listings Management
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="jobs table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Posted By</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Posted Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                    // Continuing from where the code left off in AdminDashboard.jsx
                  </TableHead>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>{job.id}</TableCell>
                        <TableCell>{job.position}</TableCell>
                        <TableCell>{job.companyName}</TableCell>
                        <TableCell>{job.user?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <Switch
                            checked={job.active}
                            onChange={() => handleToggleJobStatus(job.id, job.active)}
                            color="primary"
                          />
                        </TableCell>
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
                            onClick={() => setDeleteConfirm({ open: true, type: 'job', id: job.id })}
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
            </>
          )}
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, type: null, id: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {deleteConfirm.type}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, type: null, id: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;