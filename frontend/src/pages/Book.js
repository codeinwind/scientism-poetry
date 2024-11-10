import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Book = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          The Quantum Verses
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          A Collection of Scientific Poetry
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          By The Scientism Poetry Community
        </Typography>
      </Box>

      {/* Book Details Section */}
      <Grid container spacing={6} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="/images/book-cover.jpg"
            alt="The Quantum Verses Book Cover"
            sx={{
              width: '100%',
              maxWidth: 500,
              height: 'auto',
              display: 'block',
              margin: 'auto',
              boxShadow: 3,
              borderRadius: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            About the Book
          </Typography>
          <Typography variant="body1" paragraph>
            "The Quantum Verses" is a groundbreaking collection of poetry that
            explores the fascinating world of quantum mechanics through the lens
            of artistic expression. This anthology brings together works from
            renowned scientists and poets, creating a unique bridge between
            scientific understanding and poetic creativity.
          </Typography>
          <Typography variant="body1" paragraph>
            Each poem in this collection has been carefully crafted to maintain
            scientific accuracy while weaving beautiful metaphors that make
            complex concepts accessible to readers of all backgrounds.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="https://amazon.com/book-link"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<MenuBookIcon />}
              sx={{ mr: 2 }}
            >
              Buy on Amazon
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              href="#preview"
              startIcon={<AutoStoriesIcon />}
            >
              Read Preview
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Key Features */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          What's Inside
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Scientific Accuracy
                </Typography>
                <Typography variant="body1">
                  Each poem has been reviewed by scientists to ensure accuracy
                  while maintaining poetic beauty.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Beautiful Illustrations
                </Typography>
                <Typography variant="body1">
                  Features original artwork that complements the poems and helps
                  visualize scientific concepts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Educational Notes
                </Typography>
                <Typography variant="body1">
                  Includes detailed notes explaining the scientific concepts
                  behind each poem.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Reviews Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Reviews
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              author: 'Dr. Sarah Chen',
              title: 'Quantum Physicist',
              review: 'A masterful blend of scientific accuracy and poetic beauty.',
            },
            {
              author: 'James Miller',
              title: 'Poetry Review Monthly',
              review: 'Breaks new ground in making complex science accessible through verse.',
            },
            {
              author: 'Prof. Michael Roberts',
              title: 'Science Communication Institute',
              review: 'An innovative approach to science communication that truly works.',
            },
          ].map((review, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} sx={{ color: 'primary.main' }} />
                    ))}
                  </Box>
                  <Typography variant="body1" paragraph>
                    "{review.review}"
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {review.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
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
          Get Your Copy Today
        </Typography>
        <Typography variant="body1" paragraph>
          Join thousands of readers who have already discovered the beauty of
          scientific poetry.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          href="https://amazon.com/book-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Order Now on Amazon
        </Button>
      </Box>
    </Container>
  );
};

export default Book;
