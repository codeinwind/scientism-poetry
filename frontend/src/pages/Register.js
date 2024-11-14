import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services';

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['auth', 'common']);
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth:register.form.confirmPassword.mismatch'));
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData);
      await login(response.user, response.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || t('auth:register.errors.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t('auth:register.title')}
          </Typography>

          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            {t('auth:register.subtitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth:register.form.name.label')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
              helperText={formData.name.length > 0 && formData.name.length < 2 ? t('auth:register.form.name.minLength') : ''}
              error={formData.name.length > 0 && formData.name.length < 2}
            />
            <TextField
              fullWidth
              label={t('auth:register.form.email.label')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              helperText={formData.email && !/\S+@\S+\.\S+/.test(formData.email) ? t('auth:register.form.email.invalid') : ''}
              error={formData.email && !/\S+@\S+\.\S+/.test(formData.email)}
            />
            <TextField
              fullWidth
              label={t('auth:register.form.password.label')}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              helperText={formData.password.length > 0 && formData.password.length < 6 ? t('auth:register.form.password.minLength') : ''}
              error={formData.password.length > 0 && formData.password.length < 6}
            />
            <TextField
              fullWidth
              label={t('auth:register.form.confirmPassword.label')}
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              helperText={formData.confirmPassword && formData.password !== formData.confirmPassword ? t('auth:register.form.confirmPassword.mismatch') : ''}
              error={formData.confirmPassword && formData.password !== formData.confirmPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? t('common:loading') : t('auth:register.form.submit')}
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              {t('auth:register.hasAccount')}{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                {t('auth:register.signIn')}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
