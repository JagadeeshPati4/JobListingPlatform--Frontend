import React, { useState, useEffect,useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  InputAdornment
} from '@mui/material';

const SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'HTML', 'CSS',
  'TypeScript', 'Angular', 'Vue.js', 'PHP', 'Python', 'Java', 'C#', '.NET',
  'AWS', 'Docker', 'Kubernetes', 'DevOps', 'UI/UX', 'Figma', 'Adobe XD'
];

const JOB_TYPES = [
  'Full-Time', 'Part-Time', 'Internship', 'Contract', 'Freelance', 'Remote'
];

const JobForm = ({ job, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyLogoUrl: '',
    position: '',
    monthlySalary: '',
    jobType: '',
    workplaceType: false,
    location: '',
    description: '',
    aboutCompany: '',
    skills: [],
    additionalInfo: ''
  });
  
  const [errors, setErrors] = useState({});
  // If editing, populate form with job data
  useEffect(() => {
    if (job) {
      setFormData({
        ...job
      });
    }
  }, [job]);
  
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleSkillsChange = (event) => {
    const {
      target: { value },
    } = event;
    
    setFormData({
      ...formData,
      skills: typeof value === 'string' ? value.split(',') : value,
    });
  };
  
  const handleSubmit = (e) => {
    console.log('cliked submit')
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.position) newErrors.position = 'Job position is required';
    if (!formData.monthlySalary) newErrors.monthlySalary = 'Salary is required';
    if (!formData.jobType) newErrors.jobType = 'Job type is required';
    if (!formData.location && !formData.workplaceType) newErrors.location = 'Location is required for non-remote jobs';
    if (!formData.description) newErrors.description = 'Job description is required';
    if (!formData.skills.length) newErrors.skills = 'At least one skill is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }else{
      setErrors({});
    }
    console.log('formData',formData);
    if(!formData.workplaceType){
      formData.workplaceType="Remote";
    }
    onSubmit(formData);
  };
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {job ? 'Edit Job Listing' : 'Create New Job Listing'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              error={!!errors.companyName}
              helperText={errors.companyName}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Logo URL"
              name="companyLogoUrl"
              value={formData.companyLogoUrl}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Job Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              error={!!errors.position}
              helperText={errors.position}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Monthly Salary"
              name="monthlySalary"
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              value={formData.monthlySalary}
              onChange={handleChange}
              error={!!errors.monthlySalary}
              helperText={errors.monthlySalary}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Job Type</InputLabel>
              <Select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                label="Job Type"
                error={!!errors.jobType}
              >
                {JOB_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.jobType && (
                <Typography variant="caption" color="error">
                {errors.jobType}
              </Typography>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="workplaceType"
                  checked={formData.workplaceType}
                  onChange={handleChange}
                />
              }
              label="Remote Job"
            />
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.workplaceType? "remote":formData.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.skills}>
            <InputLabel>Skills Required</InputLabel>
            <Select
              multiple
              name="skills"
              value={formData.skills}
              onChange={handleSkillsChange}
              input={<OutlinedInput label="Skills Required" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {SKILLS.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  <Checkbox checked={formData.skills.indexOf(skill) > -1} />
                  {skill}
                </MenuItem>
              ))}
            </Select>
            {errors.skills && (
              <Typography variant="caption" color="error">
                {errors.skills}
              </Typography>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Job Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="About The Company"
            name="aboutCompany"
            multiline
            rows={4}
            value={formData.aboutCompany}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Information"
            name="additionalInfo"
            multiline
            rows={3}
            value={formData.additionalInfo}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Submitting...' : job ? 'Update Job Listing' : 'Create Job Listing'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  </Paper>
);
};

export default JobForm;