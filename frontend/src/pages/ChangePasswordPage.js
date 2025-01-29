import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { authService } from '../services';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
  const { t } = useTranslation(['profile', 'common']);
  const { user, logout} = useAuth();
  const navigate = useNavigate();

  // Form states
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Handle input changes
  const handleChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  // Handle password change submission
  const handleChangePassword = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords
    if (!passwords.currentPassword.trim() || !passwords.newPassword.trim()) {
      setError(t('profile:form.password.required'));
      setLoading(false);
      return;
    }
    if (passwords.newPassword.length < 6) {
      setError(t('profile:form.password.minLength'));
      setLoading(false);
      return;
    }
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setError(t('profile:form.password.mismatch'));
      setLoading(false);
      return;
    }

    try {
      const response = await authService.changePassword({
        userId: user._id,
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (response.success) {
        setSuccess(t('profile:messages.passwordUpdateSuccess'));
        setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 1500);
      } else {
        setError(response.message || t('profile:messages.updateFailed'));
      }
    } catch (err) {
      setError(err.message || t('profile:messages.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {t('profile:form.password.changeTitle')}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}>
          {/* Current Password */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="password"
              label={t('profile:form.password.current')}
              value={passwords.currentPassword}
              onChange={(e) => handleChange('currentPassword', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* New Password */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="password"
              label={t('profile:form.password.new')}
              value={passwords.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Confirm New Password */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="password"
              label={t('profile:form.password.confirm')}
              value={passwords.confirmNewPassword}
              onChange={(e) => handleChange('confirmNewPassword', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? t('common:loading') : t('profile:form.password.update')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ChangePasswordPage;
