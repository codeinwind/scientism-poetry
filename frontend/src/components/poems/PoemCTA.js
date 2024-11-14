import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const PoemCTA = () => {
  const { t } = useTranslation(['poems']);

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        p: 4,
        borderRadius: 2,
        textAlign: 'center',
        mt: 4,
      }}
    >
      <Typography variant="h5" gutterBottom>
        {t('poems:cta.title')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('poems:cta.description')}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        href="/register"
      >
        {t('poems:cta.button')}
      </Button>
    </Box>
  );
};

export default PoemCTA;
