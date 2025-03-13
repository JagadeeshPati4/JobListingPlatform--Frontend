import React from 'react';
import { Snackbar, Alert as MuiAlert, Typography, Box } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Notification = ({ open, message, type, onClose }) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={5000} 
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
        <Box>
          <Typography variant="body1">{message}</Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default Notification;
