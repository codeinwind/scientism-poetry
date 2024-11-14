import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import PoemCard from '../poems/PoemCard';
import { useTranslation } from 'react-i18next';

const PoemGrid = ({ poems, onEdit, onDelete }) => {
  const { t } = useTranslation(['dashboard']);

  // Debug logs
  console.log('PoemGrid received poems:', poems);

  if (!poems?.length) {
    // Show message when no poems match the current filter
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard:noPoems')}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      {poems.map((poem) => {
        // Debug log for each poem
        console.log('Rendering poem:', {
          id: poem._id,
          title: poem.title,
          status: poem.status
        });

        return (
          <Grid item xs={12} md={6} key={poem._id}>
            <PoemCard
              poem={poem}
              onEdit={onEdit}
              onDelete={onDelete}
              showStatus={true}
              data-testid={`poem-card-${poem._id}`}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PoemGrid;
