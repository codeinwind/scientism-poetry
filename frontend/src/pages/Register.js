import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Alert,
  Paper,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = React.useState('');
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('register.form.name.required'))
      .min(2, t('register.form.name.minLength')),
    email: Yup.string()
      .email(t('register.form.email.invalid'))
      .required(t('register.form.email.required')),
    password: Yup.string()
      .required(t('register.form.password.required'))
      .min(6, t('register.form.password.minLength')),
    confirmPassword: Yup.string()
      .required(t('register.form.confirmPassword.required'))
      .oneOf([Yup.ref('password'), null], t('register.form.confirmPassword.mismatch')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            {t('register.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {t('register.subtitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={t('register.form.name.label')}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label={t('register.form.email.label')}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label={t('register.form.password.label')}
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label={t('register.form.confirmPassword.label')}
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  margin="normal"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {t('register.form.submit')}
                </Button>
              </Form>
            )}
          </Formik>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" align="center">
              {t('register.hasAccount')}{' '}
              <Link component={RouterLink} to="/login">
                {t('register.signIn')}
              </Link>
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            {t('register.terms.text')}{' '}
            <Link component={RouterLink} to="/terms">
              {t('register.terms.termsLink')}
            </Link>{' '}
            {t('register.terms.and')}{' '}
            <Link component={RouterLink} to="/privacy">
              {t('register.terms.privacyLink')}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
