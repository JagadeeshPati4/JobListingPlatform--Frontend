import React from 'react';
import { Box, Typography, Pagination } from '@mui/material';
import JobCard from './JobCard';

const JobList = ({ 
  jobs, 
  bookmarkedJobs = [], 
  onBookmark, 
  onApply,
  totalPages,
  currentPage,
  onPageChange
}) => {
  console.log('JobList',jobs);
  console.log('bookmarkedJobs',bookmarkedJobs)
  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Box>
      {jobs.length > 0 ? (
        <>
          {jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              isBookmarked={bookmarkedJobs.some(bookmark => bookmark.jobId === job.id)}
              onBookmark={onBookmark}
              onApply={onApply}
            />
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No job listings found.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search filters.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default JobList;