import React, { useState, useEffect,useMemo,useCallback, useContext } from 'react';
import { Container, Typography, Box, Grid, Button, CircularProgress } from '@mui/material';
import JobFilter from '../components/jobs/JobFilter';
import JobList from '../components/jobs/JobList';
import Toast from '../components/common/Toast';
import { fetchAllJobs, addBookmark,getUserdBookmark,removeBookmark } from '../utils/api';
import AuthContext from '../contexts/AuthContext';

const HomePage = () => {
  console.log('HomePage');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    type: 'info'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10
  });
  const [filters, setFilters] = useState({
    search: '',
    jobType: [],
    location: '',
    salaryRange: [0, 0],
    remote: false
  });
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    loadJobs();
  }, [pagination.currentPage, filters]);
  const userBookmarkData = async () => {
    console.log('currentUser',currentUser)
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
      const responce =await getUserdBookmark();
      console.log('responce all bookmark',responce);
      setUserBookmarks(responce.bookmarks);
      loadJobs();
    } catch (error) {
      console.log('Failed to get user bookmark job');
      setToast({
        open: true,
        message: 'Failed to get user bookmark job',
        type: 'error'
      });
    }
  }
  useEffect(() => {
    console.log('getting bookmard user data')
    userBookmarkData();
  }, [currentUser]);

  const loadJobs = async () => {
    console.log('loadJobs');
    try {
      setLoading(true);
      const response = await fetchAllJobs(pagination.currentPage, pagination.limit, filters);
      console.log('response of all jobs',response);
      setJobs(response.jobs);
      setFilteredJobs(response.jobs);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        limit: pagination.limit
      });
    } catch (error) {
      console.log('error occered')
      setToast({
        open: true,
        message: 'Failed to load jobs. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };


  const filteredSearchJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = filters.search.length > 0
        ? job.position.toLowerCase().includes(filters.search.toLowerCase())
        : true;
        const matchesSearchSkills = filters.search
        ? job.skills.some(skill => skill.toLowerCase().includes(filters.search.toLowerCase()))
        : false;

      const matchesJobType =
        filters.jobType.length > 0 ? filters.jobType.includes(job.jobType) : false;

      const matchesLocation = filters.location
        ? job.location.toLowerCase().includes(filters.location.toLowerCase())
        : false;

      const matchesSalary =filters.salaryRange[0]>0 && filters.salaryRange[1]>0 && filters.salaryRange[0] <= filters.salaryRange[1]
        ?
        job.monthlySalary >= filters.salaryRange[0] &&
        job.monthlySalary <= filters.salaryRange[1]:false;

      const matchesRemote = filters.remote
        ? job.workplaceType.toLowerCase() === "remote"
        : false;
      console.log('matchesSearch',matchesSearch);
      console.log('matchesSearchSkills',matchesSearchSkills);
      console.log('matchesJobType',matchesJobType);
      console.log('matchesLocation',matchesLocation);
      console.log('matchesSalary',matchesSalary);
      console.log('matchesRemote',matchesRemote);

      return matchesSearch || matchesSearchSkills || matchesJobType || matchesLocation || matchesSalary || matchesRemote;
    });
  }, [filters,jobs]);


  useEffect(() => {
    setFilteredJobs(filteredSearchJobs);
  }, [filteredSearchJobs]);


  const handleFilterChange = useCallback((newFilters) => {
    console.log('handleFilterChange');
    setFilters(newFilters);
    
    setPagination({ ...pagination, currentPage: 1 });
   

  }, []);

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
      setToast({
        open: true,
        message: 'Job unbookmarked  successfully',
        type: 'success'
      });
      }else{

      await addBookmark(jobId);
      setToast({
        open: true,
        message: 'Job bookmarked  successfully',
        type: 'success'
      });
    }
      loadJobs();
      userBookmarkData();
    } catch (error) {
      console.log('Failed to bookmark job');
      setToast({
        open: true,
        message: 'Failed to bookmark job',
        type: 'error'
      });
    }
  });


  const onclearFilter = useCallback((filterClear) => {
    console.log('onclearFilter',filterClear);
    setFilters(filterClear);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      limit: 10
    });
    console.log('filters changed')
  },[]);


  const handlePageChange = (event, newPage) => {
    setPagination({ ...pagination, currentPage: newPage });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };
  console.log('jobs',jobs);
  console.log('filteredJobs',filteredJobs);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Find Your Dream Job
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <JobFilter  onFilterChange={handleFilterChange} onClear={onclearFilter} />
          </Grid>
          
          <Grid item xs={12} >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <JobList 
                jobs={filteredJobs} 
                onBookmark={handleBookmark}
                bookmarkedJobs={userBookmarks}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </Grid>
        </Grid>
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

export default HomePage;