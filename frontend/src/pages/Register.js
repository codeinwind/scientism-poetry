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
import * as Yup from 'yup';
import { useFormik } from 'formik';

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['auth', 'common']);
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('auth:register.form.name.required'))
      .min(2, t('auth:register.form.name.minLength')),
    penName: Yup.string()
      .required(t('auth:register.form.penName.required')), // New validation for pen name
    email: Yup.string()
      .email(t('auth:register.form.email.invalid'))
      .required(t('auth:register.form.email.required')),
    password: Yup.string()
      .min(6, t('auth:register.form.password.minLength'))
      .required(t('auth:register.form.password.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('auth:register.form.confirmPassword.mismatch'))
      .required(t('auth:register.form.confirmPassword.required')),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      penName: '', // Initialize pen name
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      setIsLoading(true);

      try {
        const { confirmPassword, ...registerData } = values;
        const response = await authService.register(registerData);
        await login(response.user, response.token);
        navigate('/dashboard');
      } catch (error) {
        setError(error.message || t('auth:register.errors.failed'));
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t('auth:register.title')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label={t('auth:register.form.name.label')}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              margin="normal"
              required
              helperText={formik.touched.name && formik.errors.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
            />
            <TextField
              fullWidth
              label={t('auth:register.form.penName.label')} // New field for pen name
              name="penName"
              value={formik.values.penName}
              onChange={formik.handleChange}
              margin="normal"
              required
              helperText={formik.touched.penName && formik.errors.penName}
              error={formik.touched.penName && Boolean(formik.errors.penName)}
            />
            <TextField
              fullWidth
              label={t('auth:register.form.email.label')}
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              margin="normal"
              required
              helperText={formik.touched.email && formik.errors.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
            />
            <TextField
              fullWidth
              label={t('auth:register.form.password.label')}
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              margin="normal"
              required
              helperText={formik.touched.password && formik.errors.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
            <TextField
              fullWidth
              label={t('auth:register.form.confirmPassword.label')}
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              margin="normal"
              required
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
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
