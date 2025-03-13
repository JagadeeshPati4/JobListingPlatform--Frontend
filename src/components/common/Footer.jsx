import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) => theme.palette.grey[100],
        p: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              JobBoard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find your dream job or post opportunities for others. We connect
              talent with opportunities.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              For Job Seekers
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <Link href="#" color="inherit" underline="hover">Browse Jobs</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <Link href="#" color="inherit" underline="hover">Saved Jobs</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <Link href="#" color="inherit" underline="hover">Career Advice</Link>
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              For Employers
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <Link href="#" color="inherit" underline="hover">Post a Job</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <Link href="#" color="inherit" underline="hover">Pricing</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <Link href="#" color="inherit" underline="hover">Resources</Link>
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Company
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <Link href="#" color="inherit" underline="hover">About Us</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <Link href="#" color="inherit" underline="hover">Contact</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <Link href="#" color="inherit" underline="hover">Privacy Policy</Link>
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} JobBoard. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="#" color="inherit">
              <Facebook />
            </Link>
            <Link href="#" color="inherit">
              <Twitter />
            </Link>
            <Link href="#" color="inherit">
              <LinkedIn />
            </Link>
            <Link href="#" color="inherit">
              <Instagram />
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;