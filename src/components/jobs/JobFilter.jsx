import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  OutlinedInput,
  Paper,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear
} from '@mui/icons-material';

const JobFilter = ({  onClear,onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    jobType: [],
    location: '',
    salaryRange: [0, 0],
    skills: []
  });
  
  const [expanded, setExpanded] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const handleMultiSelectChange = (event, fieldName) => {
    const {
      target: { value },
    } = event;
    
    setFilters({
      ...filters,
      [fieldName]: typeof value === 'string' ? value.split(',') : value,
    });
  };
  
  const handleSalaryChange = (event, newValue) => {
    setFilters({
      ...filters,
      salaryRange: newValue
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };
  
  const handleClear = () => {
    setFilters({
      search: '',
      jobType: [],
      location: '',
      salaryRange: [0, 0],
      skills: []
    });
    onClear({
      search: '',
      jobType: [],
      location: '',
      salaryRange: [0, 0],
      skills: []
    });
  };
  
  return (
    <Paper sx={{ p: 3, mb: 3,boxShadow: '0px  0px 7px rgb(255, 77, 79)',  }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Search Jobs</Typography>
        <IconButton onClick={() => setExpanded(!expanded)}>
          <FilterList />
        </IconButton>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          placeholder="Search by job title, company, or keywords"
          name="search"
          value={filters.search}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: filters.search ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setFilters({ ...filters, search: '' })}
                  edge="end"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
          sx={{ mb: 2 }}
        />
        
        {expanded && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Job Type</InputLabel>
                <Select
                  multiple
                  name="jobType"
                  value={filters.jobType}
                  onChange={(e) => handleMultiSelectChange(e, 'jobType')}
                  input={<OutlinedInput label="Job Type" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Remote'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={filters.location}
                onChange={handleChange}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Salary Range (monthly)
              </Typography>
              <Slider
                value={filters.salaryRange}
                onChange={handleSalaryChange}
                valueLabelDisplay="auto"
                min={0}
                max={15000}
                step={500}
                valueLabelFormat={(value) => `$${value}`}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  ${filters.salaryRange[0]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ${filters.salaryRange[1]}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Skills</InputLabel>
                <Select
                  multiple
                  name="skills"
                  value={filters.skills}
                  onChange={(e) => handleMultiSelectChange(e, 'skills')}
                  input={<OutlinedInput label="Skills" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'PHP', 'Ruby'].map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      {skill}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Search
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={handleClear}
            fullWidth
          >
            Clear
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default JobFilter;