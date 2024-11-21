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
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation(['about']);

  return (
    <Container maxWidth="lg">
      {/* Main Introduction */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t('about:title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {t('about:subtitle')}
        </Typography>
      </Box>

      {/* What is Scientism Poetry */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {t('about:whatIs.title')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('about:whatIs.description1')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('about:whatIs.description2')}
          </Typography>
          <Button
            component={RouterLink}
            to="/poems"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            {t('about:whatIs.readButton')}
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
          {t('about:mission.title')}
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ScienceIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {t('about:mission.promote.title')}
                </Typography>
                <Typography variant="body1">
                  {t('about:mission.promote.description')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <MenuBookIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {t('about:mission.foster.title')}
                </Typography>
                <Typography variant="body1">
                  {t('about:mission.foster.description')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <GroupsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {t('about:mission.build.title')}
                </Typography>
                <Typography variant="body1">
                  {t('about:mission.build.description')}
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
          {t('about:join.title')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('about:join.description')}
        </Typography>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
        >
          {t('about:join.button')}
        </Button>
      </Box>
    </Container>
  );
};

export default About;
