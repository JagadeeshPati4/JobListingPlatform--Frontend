import React, { useState, useEffect,useContext,useCallback } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Button, Chip, Divider, CircularProgress } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import PaidIcon from '@mui/icons-material/Paid';
import Toast from '../components/common/Toast';
import { fetchJobById, addBookmark, checkIfBookmarked,deleteJob,removeBookmark } from '../utils/api';
import AuthContext from '../contexts/AuthContext';


const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    type: 'info'
  });

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const data = await fetchJobById(id);
        setJob(data.job);
        
        if (currentUser) {
          const bookmarked = await checkIfBookmarked(id);
          setIsBookmarked(bookmarked);
        }
      } catch (error) {
        setToast({
          open: true,
          message: 'Failed to load job details',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadJob();
  }, [id, currentUser]);

  const handleBookmark =  useCallback(async(jobId,isBookmarked) => {
      console.log('handleBookmark called',);
      if (!currentUser) {
        console.log('Please login to bookmark jobs');
        setToast({
          open: true,
          message: 'Please login to bookmark jobs',
          type: 'warning'
        });
        return;
      }
  
      try {
        console.log('bookmarkJob called entered api');
        if(isBookmarked){
          await removeBookmark(jobId);
          setIsBookmarked(!isBookmarked)
        setToast({
          open: true,
          message: 'Job unbookmarked  successfully',
          type: 'success'
        });
        }else{
  
        await addBookmark(jobId);
        setIsBookmarked(!isBookmarked)
        setToast({
          open: true,
          message: 'Job bookmarked  successfully',
          type: 'success'
        });
      }
      } catch (error) {
        console.log('Failed to bookmark job');
        setToast({
          open: true,
          message: 'Failed to bookmark job',
          type: 'error'
        });
      }
    });
  const handleApply=()=>{
    setToast({
      open: true,
      message: 'Job Applied successfully',
      type: 'success'
    });
    setTimeout(() => {
    navigate('/');
      
    }, 1000);
  }
  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }
  console.log('job',job);
  const onDelete = async(id) => {
      console.log('delete',id);
      try {
      const responce = await deleteJob(id);
      console.log('responce',responce);
      setTimeout(()=>{
        navigate('/');
      },100)
  
        
      } catch (error) {
        
      }
    }
  if (!job) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Container sx={{ flexGrow: 1, py: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Job not found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/jobs')}>
            Browse All Jobs
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column',  }}>
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom>
                {job.jobPosition}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">{job.companyName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 0.5, fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body1">{job.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon sx={{ mr: 0.5, fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body1">{job.jobType}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PaidIcon sx={{ mr: 0.5, fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body1">${job.monthlySalary}/month</Typography>
                </Box>
                <Chip 
                  label={job.remote ? "Remote" : "In-Office"} 
                  color={job.remote ? "success" : "info"} 
                  size="small" 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button 
                  variant="outlined" 
                  startIcon={isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  onClick={()=>handleBookmark(id,isBookmarked)}
                  sx={{ mb: 2 }}
                >
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Posted on: {new Date(job.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>Job Description</Typography>
              <Typography variant="body1" paragraph>
                {job.jobDescription}
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>About the Company</Typography>
              <Typography variant="body1" paragraph>
                {job.aboutCompany}
              </Typography>
              
              {job.additionalInfo && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Additional Information</Typography>
                  <Typography variant="body1" paragraph>
                    {job.additionalInfo}
                  </Typography>
                </>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2, gap: 5, borderRadius: 2 }}>
                <Typography   variant="g6" gutterBottom>Skills Required :</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1,m:1 }}>
                  {job.skills && job.skills.map((skill, index) => (
                    <Chip key={index} label={skill} size="small" />
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
              {currentUser && (currentUser.id == job.userId || currentUser.role == 'admin' )&& (
                              <>
                              <Button 
                              component={Link}
                              to={`/jobs/edit/${job.id}`}
                              variant="contained" 
                              color="primary" 
                              sx={{ width: { xs: '100%', sm: 'auto' }, m: 1 }}
                            >
                              Edit
                            </Button>
                            <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => onDelete(job.id)}
                            sx={{ width: { xs: '100%', sm: 'auto' }, m: 1 }}
                          >
                            Delete
                          </Button>
                          </>
                            )}
              {currentUser && currentUser.id != job.userId &&(
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleApply}
                sx={{ width: { xs: '100%', sm: 'auto' }, m: 1  }}
              >
                Apply Now
              </Button>
            )}
            </Box>
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

export default JobDetailPage;