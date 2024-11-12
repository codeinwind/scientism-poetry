import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/hero-bg.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(15, 0),
  marginTop: theme.spacing(-4),
  marginBottom: theme.spacing(6),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const Home = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography
                component="h1"
                variant="h2"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                {t('home.hero.title')}
              </Typography>
              <Typography variant="h5" paragraph>
                {t('home.hero.subtitle')}
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  color="secondary"
                  sx={{ mr: 2 }}
                >
                  {t('home.hero.joinButton')}
                </Button>
                <Button
                  component={RouterLink}
                  to="/poems"
                  variant="outlined"
                  size="large"
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  {t('home.hero.readButton')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container maxWidth="lg">
        {/* Featured Book Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom align="center">
            {t('home.featuredBook.title')}
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                height="400"
                image="/images/book-cover.png"
                alt="Book Cover"
                sx={{ objectFit: 'contain' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {t('home.featuredBook.bookTitle')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('home.featuredBook.description')}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                href="https://amazon.com/book-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('home.featuredBook.button')}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Featured Sections */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardMedia
                component="img"
                height="200"
                image="/images/community.png"
                alt="Community"
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t('home.features.community.title')}
                </Typography>
                <Typography variant="body1">
                  {t('home.features.community.description')}
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardMedia
                component="img"
                height="200"
                image="/images/workshops.png"
                alt="Workshops"
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t('home.features.workshops.title')}
                </Typography>
                <Typography variant="body1">
                  {t('home.features.workshops.description')}
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardMedia
                component="img"
                height="200"
                image="/images/publish.png"
                alt="Publish"
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t('home.features.publish.title')}
                </Typography>
                <Typography variant="body1">
                  {t('home.features.publish.description')}
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
