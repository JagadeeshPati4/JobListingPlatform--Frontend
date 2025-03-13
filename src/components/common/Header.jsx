import React, { useState,useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Dashboard,
  Business,
  WorkOutline,
  Person,
  Bookmark,
  ExitToApp
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';


const Header = () => {
  const { isAuthenticated, user, logout  } = useContext(AuthContext);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  
  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/');
  };
  
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'My Jobs', icon: <Business />, path: '/my-jobs' },
    { text: 'Bookmarked', icon: <Bookmark />, path: '/bookmarked' },
    { text: 'Profile', icon: <Person />, path: '/profile' }
  ];
  
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        JobBoard
      </Typography>
      <Divider />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <WorkOutline />
          </ListItemIcon>
          <ListItemText primary="Browse Jobs" />
        </ListItem>
        
        {isAuthenticated ? (
          <>
            {menuItems.map((item) => (
              <ListItem key={item.text} button component={Link} to={item.path}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/signup">
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );
  
  return (
    <>
      <AppBar position="static" color="default" elevation={1} sx={{backgroundColor:'rgb(255, 77, 79)', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            JobBoard
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                component={Link}
                to="/"
                color="primary"
                variant="contained"
                sx={{ mr: 2,backgroundColor:"whtie" }}
              >
                Browse Jobs
              </Button>
              
              {isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    to="jobs/create/"
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    Post a Job
                  </Button>
                  
                  <IconButton
                    color="white"
                    onClick={handleNotificationMenuOpen}
                    sx={{ mr: 2 }}
                  >
                    <Badge badgeContent={3} color="error">
                      <Notifications color='white' />
                    </Badge>
                  </IconButton>
                  
                  <Button
                    color="inherit"
                    onClick={handleProfileMenuOpen}
                    startIcon={
                      <Avatar
                        src={user?.avatar}
                        alt={user?.name}
                        sx={{ width: 32, height: 32 }}
                      />
                    }
                  >
                    {user?.name}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    color="inherit"
                    borderColor="white"
                    sx={{ mr: 2 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    color="primary"
                    backgroundColor="whtie"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={Link} to="/dashboard">
          <Dashboard fontSize="small" sx={{ mr: 1 }} /> Dashboard
        </MenuItem>
        <MenuItem component={Link} to="/my-jobs">
          <Business fontSize="small" sx={{ mr: 1 }} /> My Jobs
        </MenuItem>
        <MenuItem component={Link} to="/bookmarked">
          <Bookmark fontSize="small" sx={{ mr: 1 }} /> Bookmarked
        </MenuItem>
        <MenuItem component={Link} to="/profile">
          <Person fontSize="small" sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ExitToApp fontSize="small" sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>
      
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 360,
            maxHeight: 400,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          <Button size="small">Mark all as read</Button>
        </Box>
        <Divider />
        <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
          <MenuItem sx={{ py: 2 }}>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Your job application was viewed
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your application for Frontend Developer at TechCorp was viewed by the recruiter.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2 hours ago
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem sx={{ py: 2 }}>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                New job matches your skills
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3 new jobs match your skills in React development.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Yesterday
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem sx={{ py: 2 }}>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Profile view notification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your profile was viewed by 5 recruiters this week.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2 days ago
              </Typography>
            </Box>
          </MenuItem>
        </Box>
        <Divider />
        <MenuItem sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="primary">
            View all notifications
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
