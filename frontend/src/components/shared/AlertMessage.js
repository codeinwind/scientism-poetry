import React from 'react';
import {
  Alert,
  AlertTitle,
  Snackbar,
  Slide,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AlertMessage = ({
  open,
  onClose,
  message,
  title,
  severity = 'success',
  duration = 6000,
  vertical = 'top',
  horizontal = 'right',
}) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
      TransitionComponent={Slide}
    >
      <Alert
        elevation={6}
        variant="filled"
        severity={severity}
        onClose={handleClose}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          width: '100%',
          minWidth: '300px',
          boxShadow: (theme) => theme.shadows[3],
        }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

// Alert Message Context for global usage
export const AlertMessageContext = React.createContext({
  showAlert: () => {},
  hideAlert: () => {},
});

export const AlertMessageProvider = ({ children }) => {
  const [alert, setAlert] = React.useState({
    open: false,
    message: '',
    title: '',
    severity: 'success',
    duration: 6000,
  });

  const showAlert = ({
    message,
    title,
    severity = 'success',
    duration = 6000,
  }) => {
    setAlert({
      open: true,
      message,
      title,
      severity,
      duration,
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <AlertMessageContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AlertMessage
        open={alert.open}
        onClose={hideAlert}
        message={alert.message}
        title={alert.title}
        severity={alert.severity}
        duration={alert.duration}
      />
    </AlertMessageContext.Provider>
  );
};

// Custom hook for using alert messages
export const useAlertMessage = () => {
  const context = React.useContext(AlertMessageContext);
  if (!context) {
    throw new Error('useAlertMessage must be used within an AlertMessageProvider');
  }
  return context;
};

export default AlertMessage;
