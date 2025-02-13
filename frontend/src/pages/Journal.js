import React from 'react';
import {
  Container,
  CardContent,
  Typography,
  Button,
  Grid,
  Card,
  Box,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/shared/PageHeader';
import SimpleCarousel from '../components/shared/SimpleCarousel';

const Journal = () => {
  const { t } = useTranslation(['journal', 'nav']);
  const carouselItems = [
    { image: "/images/carousel1.jpg", alt: t('journal:carousel.image1Alt') },
    { image: "/images/carousel2.jpg", alt: t('journal:carousel.image2Alt') },
    { image: "/images/carousel3.jpg", alt: t('journal:carousel.image3Alt') }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader title={t('nav:journal')} />

      {/* Carousel component */}
      <Box sx={{ mb: 6 }}>
        <SimpleCarousel items={carouselItems} />
      </Box>

      {/* Introduction */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          {t('journal:title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {t('journal:subtitle')}
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto' }}>
          {t('journal:description')}
        </Typography>
      </Box>

      {/* Current Issue */}
      <Paper elevation={2} sx={{ p: 4, mb: 6, bgcolor: 'background.paper' }}>
        <Typography variant="h4" gutterBottom>
          {t('journal:currentIssue.title')}
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          {t('journal:currentIssue.number', { number: 12 })}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {t('journal:currentIssue.theme', { theme: 'Quantum Mechanics & Poetry' })}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('journal:currentIssue.description')}
        </Typography>
      </Paper>

      {/* Submissions and Archive */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {t('journal:submissions.title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('journal:submissions.description')}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                {t('journal:submissions.button')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {t('journal:archive.title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('journal:archive.description')}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
              >
                {t('journal:archive.button')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Journal;
