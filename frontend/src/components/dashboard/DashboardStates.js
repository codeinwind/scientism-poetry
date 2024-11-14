import React from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
    <CircularProgress />
  </Box>
);

export const ErrorState = ({ error, onRetry }) => {
  const { t } = useTranslation(['dashboard']);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Alert 
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              {t('dashboard:retry')}
            </Button>
          )
        }
      >
        {error.message || t('dashboard:errors.loadPoems')}
      </Alert>
    </Container>
  );
};

export const EmptyState = ({ onCreate }) => {
  const { t } = useTranslation(['dashboard']);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        py: 8,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {t('dashboard:emptyState.title')}
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ mb: 4, maxWidth: 600 }}
      >
        {t('dashboard:emptyState.description')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<AddIcon />}
        onClick={onCreate}
      >
        {t('dashboard:emptyState.button')}
      </Button>
    </Box>
  );
};

export const UnauthorizedState = () => {
  const { t } = useTranslation(['dashboard']);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Alert severity="error">
        {t('dashboard:errors.unauthorized')}
      </Alert>
    </Container>
  );
};
