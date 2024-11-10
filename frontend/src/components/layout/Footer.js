import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Scientism Poetry
            </Typography>
            <Typography variant="body2">
              Exploring the intersection of science and poetry, creating a unique space for
              scientific expression through verse.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <MuiLink
                component={Link}
                to="/about"
                color="inherit"
                sx={{ mb: 1 }}
              >
                About Us
              </MuiLink>
              <MuiLink
                component={Link}
                to="/book"
                color="inherit"
                sx={{ mb: 1 }}
              >
                Our Book
              </MuiLink>
              <MuiLink
                component={Link}
                to="/poems"
                color="inherit"
                sx={{ mb: 1 }}
              >
                Member Poems
              </MuiLink>
              <MuiLink
                component={Link}
                to="/contact"
                color="inherit"
                sx={{ mb: 1 }}
              >
                Contact Us
              </MuiLink>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <MuiLink
                href="https://twitter.com/scientismpoetry"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ mb: 1 }}
              >
                Twitter
              </MuiLink>
              <MuiLink
                href="https://facebook.com/scientismpoetry"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ mb: 1 }}
              >
                Facebook
              </MuiLink>
              <MuiLink
                href="https://instagram.com/scientismpoetry"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ mb: 1 }}
              >
                Instagram
              </MuiLink>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 5, borderTop: 1, pt: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Scientism Poetry. All rights reserved.
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            <MuiLink
              component={Link}
              to="/privacy"
              color="inherit"
              sx={{ mx: 1 }}
            >
              Privacy Policy
            </MuiLink>
            |
            <MuiLink
              component={Link}
              to="/terms"
              color="inherit"
              sx={{ mx: 1 }}
            >
              Terms of Service
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
