import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, Paper, Snackbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';

const ForgotPasswordPage = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        setSuccess(true);
        setSnackbarOpen(true);
     
        setTimeout(() => navigate('/login'), 5000);
      } else {
        setError(response.message);
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError(err.message || t('auth:forgotPassword.error'));
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
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
            {t('auth:forgotPassword.title')}
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            {t('auth:forgotPassword.instructions')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {t('auth:forgotPassword.success')}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth:forgotPassword.form.email.label')}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              margin="normal"
              required
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading || success}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? t('auth:forgotPassword.loading') : t('auth:forgotPassword.form.submit')}
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              <Link to="/login" style={{ textDecoration: 'none' }}>
                {t('auth:forgotPassword.backToLogin')}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={
          error ||
          (success ? t('auth:forgotPassword.success') : '')
        }
      />
    </Container>
  );
};

export default ForgotPasswordPage;


