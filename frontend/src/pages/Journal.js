import React from 'react';
import {
  Container,
  CardMedia,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/shared/PageHeader';

const Journal = () => {
  const { t, i18n } = useTranslation(['journal', 'nav']);
  const currentLanguage = i18n.language.split('-')[0] || 'en';
  const FEATURE_CONFIG = {
    coverImages: {
      en: '/images/book-cover-en.jpg',
      zh: '/images/book-cover-zh.jpg'
    },
    amazonLinks: {
      en: "https://www.amazon.com/dp/B0DQJVM15R?ref=cm_sw_r_ffobk_mwn_dp_Z7E6A701AFW0KZ3N7KQS&ref_=cm_sw_r_ffobk_mwn_dp_Z7E6A701AFW0KZ3N7KQS&social_share=cm_sw_r_ffobk_mwn_dp_Z7E6A701AFW0KZ3N7KQS&peakEvent=5&dealEvent=0&language=en_US&skipTwisterOG=1&bestFormat=true",
      zh: "https://a.co/d/a42plM1"
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader title={t('nav:journal')} />

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

      {/* New book preview */}
      <Grid item xs={12}>
        <Paper elevation={0} sx={{
          p: 3,
          bgcolor: 'grey.50',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.300',
          mb: 6,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
          height: 400
        }}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            <Grid item xs={12} md={8} sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%'
            }}>
              <Box sx={{
                textAlign: 'left',
                maxWidth: 600,
                margin: '0 auto'
              }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  color="grey.800"
                  sx={{
                    fontWeight: 'bold',
                    letterSpacing: '0.5px',
                    mb: 2
                  }}
                >
                  {t('journal:newBookAnnouncement.title')}
                </Typography>

                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: '"Times New Roman", serif',
                    lineHeight: 1.3,
                    color: 'grey.700',
                    fontStyle: 'italic',
                    mb: 2
                  }}
                >
                  {t('journal:newBookAnnouncement.details')}
                </Typography>

                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: '"Times New Roman", serif',
                    lineHeight: 1.3,
                    color: 'grey.700',
                    fontStyle: 'italic'
                  }}
                >
                  {t('journal:newBookAnnouncement.date')}
                </Typography>
              </Box>
            </Grid>

            {/* Book Picture */}
            <Grid item xs={12} md={4} sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CardMedia
                component="img"
                image="/images/new-book-cover.jpg"
                alt={t('journal:newBookAnnouncement.coverAlt')}
                sx={{
                  height: 'auto',
                  maxHeight: 300,
                  width: '80%',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Book */}
      <Grid container spacing={4} alignItems="center" sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image={FEATURE_CONFIG.coverImages[currentLanguage]}
            alt="Book Cover"
            sx={{
              height: { xs: 300, md: 450 },
              width: '100%',
              objectFit: 'contain',
              borderRadius: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pl: { md: 4 } }}>
            <Typography variant="h3" gutterBottom align="left">
              {t('journal:featuredBook.title')}
            </Typography>
            <Typography variant="h4" gutterBottom align="left">
              {t('journal:featuredBook.bookTitle')}
            </Typography>
            <Typography variant="body1" paragraph align="left">
              {t('journal:featuredBook.description')}
            </Typography>
            <Box sx={{ mt: 0.1 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href={FEATURE_CONFIG.amazonLinks[currentLanguage]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('home:featuredBook.button')}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

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
