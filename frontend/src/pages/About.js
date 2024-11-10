import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupsIcon from '@mui/icons-material/Groups';

const About = () => {
  return (
    <Container maxWidth="lg">
      {/* Main Introduction */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          About Scientism Poetry
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Where Scientific Understanding Meets Poetic Expression
        </Typography>
      </Box>

      {/* What is Scientism Poetry */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            What is Scientism Poetry?
          </Typography>
          <Typography variant="body1" paragraph>
            Scientism Poetry is a unique form of artistic expression that bridges
            the gap between scientific understanding and poetic creativity. It
            seeks to explore and explain scientific concepts, discoveries, and
            phenomena through the lens of poetry.
          </Typography>
          <Typography variant="body1" paragraph>
            Our poets combine technical accuracy with creative metaphors,
            making complex scientific ideas accessible and emotionally resonant
            for readers of all backgrounds.
          </Typography>
          <Button
            component={RouterLink}
            to="/poems"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Read Our Poems
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="/images/science-poetry.jpg"
            alt="Science meets Poetry"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2,
            }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 8 }} />

      {/* Our Mission */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Our Mission
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ScienceIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Promote Scientific Understanding
                </Typography>
                <Typography variant="body1">
                  Make scientific concepts more accessible and engaging through
                  creative expression and poetic interpretation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <MenuBookIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Foster Creativity
                </Typography>
                <Typography variant="body1">
                  Encourage poets to explore scientific themes in their work
                  and develop unique ways to communicate complex ideas.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <GroupsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Build Community
                </Typography>
                <Typography variant="body1">
                  Create a space for like-minded individuals to share their work
                  and passion for both science and poetry.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Join Us Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 6,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Join Our Community
        </Typography>
        <Typography variant="body1" paragraph>
          Become part of our growing community of poets and science enthusiasts.
          Share your work, participate in workshops, and connect with others who
          share your passion.
        </Typography>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
        >
          Join Now
        </Button>
      </Box>
    </Container>
  );
};

export default About;
