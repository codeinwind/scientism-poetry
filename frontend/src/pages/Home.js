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
                Where Science Meets Poetry
              </Typography>
              <Typography variant="h5" paragraph>
                Explore the beauty of scientific concepts through the art of verse.
                Join our community of poets who blend scientific insight with creative expression.
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
                  Join the Club
                </Button>
                <Button
                  component={RouterLink}
                  to="/poems"
                  variant="outlined"
                  size="large"
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Read Poems
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
            Featured Book
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                height="400"
                image="/images/book-cover.jpg"
                alt="Book Cover"
                sx={{ objectFit: 'contain' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                "The Quantum Verses"
              </Typography>
              <Typography variant="body1" paragraph>
                Dive into our latest collection of scientism poetry, where the
                mysteries of quantum mechanics meet the beauty of artistic expression.
                Available now on Amazon.
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
                Get the Book
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
                image="/images/community.jpg"
                alt="Community"
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Join Our Community
                </Typography>
                <Typography variant="body1">
                  Connect with fellow poets who share your passion for science and
                  creative expression. Share your work and get inspired.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardMedia
                component="img"
                height="200"
                image="/images/workshops.jpg"
                alt="Workshops"
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Monthly Workshops
                </Typography>
                <Typography variant="body1">
                  Participate in our monthly workshops where we explore different
                  scientific concepts through poetry writing exercises.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardMedia
                component="img"
                height="200"
                image="/images/publish.jpg"
                alt="Publish"
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Get Published
                </Typography>
                <Typography variant="body1">
                  Submit your poems for our monthly featured collection and get a
                  chance to be published in our upcoming anthologies.
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
