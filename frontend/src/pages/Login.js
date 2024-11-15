import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Snackbar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(['auth', 'common']);
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showResend, setShowResend] = useState(false); // New state for showing resend button

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('verified') === 'true') {
      setError(t('auth:login.verificationEmailSent'));
      setSnackbarOpen(true);
    }
  }, [location, t]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      await login(response.user, response.token);
      navigate('/dashboard');
    } catch (error) {
      if (error.message === 'Email not registered') {
        setError(t('auth:login.errors.emailNotRegistered'));
      } else if (error.message === 'Incorrect password') {
        setError(t('auth:login.errors.incorrectPassword'));
      } else if (error.message === 'Email not verified') {
        setError(t('auth:login.errors.emailNotVerified'));
        setShowResend(true); // Show resend button on email not verified
      } else {
        setError(t('auth:login.errors.failed'));
      }
      setSnackbarOpen(true); // Open snackbar on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setIsLoading(true);

    try {
      await authService.resendVerification({ email: formData.email });
      setError(t('auth:login.errors.verificationEmailSent')); // Set message for snackbar
      setSnackbarOpen(true); // Open snackbar on success
    } catch (error) {
      setError(error.message || t('auth:login.errors.failed'));
      setSnackbarOpen(true); // Open snackbar on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t('auth:login.title')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth:login.form.email.label')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label={t('auth:login.form.password.label')}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? t('common:loading') : t('auth:login.form.submit')}
            </Button>
            {showResend && ( // Conditionally render the resend button
              <Button
                type="button"
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={handleResendVerification}
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                {t('auth:login.resendVerification')}
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              {t('auth:login.noAccount')}{' '}
              <Link to="/register" style={{ textDecoration: 'none' }}>
                {t('auth:login.signUp')}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={error}
      />
    </Container>
  );
};

export default Login;
