// src/components/auth/LoginForm.jsx
import React, { useState,useContext } from 'react';
import{useNavigate} from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Link, 
  Paper,
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthContext from '../../contexts/AuthContext';
import useNotification from '../../contexts/NotificationContext';
const LoginForm = () => {
   const { login,error } = useContext(AuthContext);
    const { showNotification } = useContext(useNotification);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Call login function
    const responce = await login(formData);
    if(responce){
      showNotification('Login Successful','success');
      navigate('/');

    }else{
      console.log('error',error);
      console.log('responce failed');
      showNotification(error,'error');
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Already have an account?
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Button 
              type="submit"
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            
            <Box textAlign="center">
              <Typography variant="body2">
                Don't have an account? <Link href="/signup" underline="hover">Create an account</Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            backgroundColor: '#5c39f8',
            backgroundImage: 'linear-gradient(135deg, #5c39f8 0%, #ff4d4f 100%)',
            borderRadius: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            color: 'white'
          }}
        >
          <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 2 }}>
            Your Personal Job Portal
          </Typography>
          <Typography variant="body1" textAlign="center">
            Find your dream job or post opportunities for others
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
