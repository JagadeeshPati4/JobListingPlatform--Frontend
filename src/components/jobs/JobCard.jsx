import React,{useContext} from 'react';
import { Link,useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Grid
} from '@mui/material';
import { 
  LocationOn, 
  Work, 
  AttachMoney, 
  Bookmark, 
  BookmarkBorder 
} from '@mui/icons-material';
import AuthContext from '../../contexts/AuthContext';
import {deleteJob} from '../../utils/api';
const JobCard = ({ job, isBookmarked, onBookmark, onApply }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log('JobCard',job);
  console.log('currentUser',currentUser);
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
  return (
    <Card sx={{ mb: 2, overflow: 'visible' }}>
      <CardContent >
        <Grid container spacing={2}  >
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }} component={Link} to={`/jobs/${job.id}`}>
              <Avatar 
                src={job.companyLogo} 
                alt={job.companyName}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Box>
                <Typography variant="h6" fontWeight="medium">{job.position}</Typography>
                <Typography variant="body2" color="text.secondary">{job.companyName}</Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">{job.location}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Work fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">{job.jobType}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">${job.monthlySalary.toLocaleString()}/month</Typography>
              </Box>
            </Stack>
            
            <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
              {job.skills.map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  size="small" 
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
            <Box sx={{ alignSelf: 'flex-end' }}>
              <IconButton 
                onClick={() => onBookmark(job.id,isBookmarked)} 
                color="primary"
                sx={{ p: 0 }}
              >
                {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Box>
            
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
                variant="contained" 
                color="primary" 
                component={Link}
                to={`/jobs/${job.id}`}
                sx={{ width: { xs: '100%', sm: 'auto' }, m: 1  }}
              >
                Apply Now
              </Button>
              )}
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Posted {job.postedDate}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default JobCard;
