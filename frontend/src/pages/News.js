import React from 'react';
import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/shared/PageHeader';

const News = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader title={t('nav.newsAndEvents')} />
      <Typography variant="body1" paragraph>
        Content for the News & Events page will be added here.
      </Typography>
    </Container>
  );
};

export default News;
