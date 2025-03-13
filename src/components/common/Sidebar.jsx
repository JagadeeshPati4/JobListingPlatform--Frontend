import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Typography,
  Avatar
} from '@mui/material';
import {
  Dashboard,
  Business,
  Bookmark,
  Person,
  Settings,
  ExitToApp
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'My Jobs', icon: <Business />, path: '/my-jobs' },
    { text: 'Bookmarked', icon: <Bookmark />, path: '/bookmarked' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
    { text: 'Settings', icon: <Settings />, path: '/settings' }
  ];
  
  return (
    <Paper sx={{ height: '100%', borderRadius: 0 }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          src={user?.avatar}
          alt={user?.name}
          sx={{ width: 80, height: 80, mb: 2 }}
        />
        <Typography variant="h6" align="center">
          {user?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {user?.email}
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 77, 79, 0.1)',
                borderLeft: '4px solid #ff4d4f',
                '&:hover': {
                  backgroundColor: 'rgba(255, 77, 79, 0.2)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        <ListItem button onClick={onLogout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Sidebar;