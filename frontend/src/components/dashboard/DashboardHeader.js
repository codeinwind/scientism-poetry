import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const DashboardHeader = ({ userName, onCreateNew }) => {
  const { t } = useTranslation(['dashboard']);

  return (
    <>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          {t('dashboard:title')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('dashboard:welcome', { name: userName })}
        </Typography>
      </Box>

      {/* Action Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
          data-testid="create-poem-button"
        >
          {t('dashboard:createPoem')}
        </Button>
      </Box>
    </>
  );
};

export default DashboardHeader;
