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
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = React.useState('');
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('login.form.email.invalid'))
      .required(t('login.form.email.required')),
    password: Yup.string()
      .required(t('login.form.password.required'))
      .min(6, t('login.form.password.minLength')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('login.errors.failed'));
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
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          {t('login.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          {t('login.subtitle')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label={t('login.form.email.label')}
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
                label={t('login.form.password.label')}
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
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
                {t('login.form.submit')}
              </Button>
            </Form>
          )}
        </Formik>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" align="center">
            {t('login.noAccount')}{' '}
            <Link component={RouterLink} to="/register">
              {t('login.signUp')}
            </Link>
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            <Link component={RouterLink} to="/forgot-password">
              {t('login.forgotPassword')}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
