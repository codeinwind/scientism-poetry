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
            <Typography variant="body2" sx={{ color: 'inherit' }}>
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
                href="https://www.amazon.com/dp/B0DQJVM15R?ref=cm_sw_r_ffobk_mwn_dp_Z7E6A701AFW0KZ3N7KQS&ref_=cm_sw_r_ffobk_mwn_dp_Z7E6A701AFW0KZ3N7KQS&social_share=cm_sw_r_ffobk_mwn_dp_Z7E6A701AFW0KZ3N7KQS&peakEvent=5&dealEvent=0&language=en_US&skipTwisterOG=1&bestFormat=true"
                target="_blank"
                rel="noopener noreferrer"
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
                href="mailto:ScientismPoetry@gmail.com" 
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
                href="https://x.com/ScientismPoetry"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ mb: 1 }}
              >
                {t('footer:social.twitter')}
              </MuiLink>
              <MuiLink
                href="https://www.facebook.com/profile.php?id=61573033499932"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ mb: 1 }}
              >
                {t('footer:social.facebook')}
              </MuiLink>
              <MuiLink
                href="https://www.instagram.com/poetryscientism/"
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
          <Typography variant="body2" align="center" sx={{ color: 'inherit' }}>
            {t('footer:copyright', { year: currentYear })}
          </Typography>
          <Typography variant="body2" align="center" sx={{ color: 'inherit' }}>
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
