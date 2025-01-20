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
import FeaturesOverview from '../components/homepage/FeaturesOverview';

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/hero-bg.jpg')`,
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
  const { t } = useTranslation(['home', 'common']);

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={10}>
              <Typography
                component="h1"
                variant="h2"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                {t('home:hero.title')}
              </Typography>
              <Typography variant="h5" paragraph>
                {t('home:hero.subtitle')}
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: 'white', fontStyle: 'italic', mb: 2 }}
                >
                  {t('home:hero.slogan')}
                </Typography>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  color="secondary"
                  sx={{ mr: 2 }}
                >
                  {t('home:hero.joinButton')}
                </Button>
                <Button
                  component={RouterLink}
                  to="/poems"
                  variant="outlined"
                  size="large"
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  {t('home:hero.readButton')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container maxWidth="lg">
        <Container maxWidth="lg">
          {/* Featured Section */}
          <Box sx={{ mb: 8 }}>
            <Grid container spacing={6} alignItems="stretch">
              {/* Left Column: Featured Book */}
              <Grid item xs={12} md={6}>
                <Typography variant="h3" gutterBottom align="center">
                  {t('home:featuredBook.title')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    image="/images/book-cover.jpg"
                    alt="Book Cover"
                    sx={{
                      height: { xs: 300, md: 450 },
                      width: '100%',
                      maxWidth: 400,
                      objectFit: 'cover',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h4" gutterBottom align="center">
                    {t('home:featuredBook.bookTitle')}
                  </Typography>
                  <Typography variant="body1" paragraph align="center">
                    {t('home:featuredBook.description')}
                  </Typography>
                </Box>
              </Grid>

              {/* Right Column: Featured Poem */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h4" 
                  gutterBottom
                  align="center"
                  sx={{ mb: 1 }} 
                >
                  {t('home:featuredPoem.title')}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant="h5" 
                    gutterBottom
                    sx={{ fontStyle: 'italic', mb: 2 }} 
                  >
                    {t('home:featuredPoem.poemTitle')}
                  </Typography>
                  <Typography
                    variant="body2" 
                    sx={{
                      whiteSpace: 'pre-line',
                      fontSize: '1rem',  
                      maxWidth: '80%',
                      margin: '0 auto',
                    }}
                  >
                    {t('home:featuredPoem.poemText')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>

        {/* Overview of navigation features */}
        <FeaturesOverview />

      </Container>
    </Box>
  );
};

export default Home;
