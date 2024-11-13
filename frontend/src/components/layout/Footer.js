import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation(['footer']);
  const currentYear = new Date().getFullYear();

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
              {t('footer:about.title')}
            </Typography>
            <Typography variant="body2">
              {t('footer:about.description')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              {t('footer:links.title')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <MuiLink
                component={Link}
                to="/about"
                color="inherit"
                sx={{ mb: 1 }}
              >
                {t('footer:links.about')}
              </MuiLink>
              <MuiLink
                component={Link}
                to="/book"
                color="inherit"
                sx={{ mb: 1 }}
              >
                {t('footer:links.book')}
              </MuiLink>
              <MuiLink
                component={Link}
                to="/poems"
                color="inherit"
                sx={{ mb: 1 }}
              >
                {t('footer:links.poems')}
              </MuiLink>
              <MuiLink
                component={Link}
                to="/contact"
                color="inherit"
                sx={{ mb: 1 }}
              >
                {t('footer:links.contact')}
              </MuiLink>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              {t('footer:social.title')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <MuiLink
                href="https://twitter.com/scientismpoetry"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ mb: 1 }}
              >
                {t('footer:social.twitter')}
              </MuiLink>
              <MuiLink
                href="https://facebook.com/scientismpoetry"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ mb: 1 }}
              >
                {t('footer:social.facebook')}
              </MuiLink>
              <MuiLink
                href="https://instagram.com/scientismpoetry"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ mb: 1 }}
              >
                {t('footer:social.instagram')}
              </MuiLink>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 5, borderTop: 1, pt: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <Typography variant="body2" align="center">
            {t('footer:copyright', { year: currentYear })}
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            <MuiLink
              component={Link}
              to="/privacy"
              color="inherit"
              sx={{ mx: 1 }}
            >
              {t('footer:legal.privacy')}
            </MuiLink>
            |
            <MuiLink
              component={Link}
              to="/terms"
              color="inherit"
              sx={{ mx: 1 }}
            >
              {t('footer:legal.terms')}
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
