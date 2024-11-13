import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/shared/PageHeader';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';

const News = () => {
  const { t } = useTranslation(['news', 'nav']);
  const [filter, setFilter] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState(false);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    if (email) {
      setSubscribeSuccess(true);
      setEmail('');
    } else {
      setSubscribeError(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader title={t('nav:newsAndEvents')} />
      
      {/* Introduction */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          {t('news:title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {t('news:subtitle')}
        </Typography>
      </Box>

      {/* Featured Event */}
      <Paper elevation={3} sx={{ p: 4, mb: 6, bgcolor: 'background.paper' }}>
        <Typography variant="h4" gutterBottom>
          {t('news:featured.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, color: 'text.secondary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarMonthIcon sx={{ mr: 1 }} />
            {t('news:featured.date', { date: '2024-02-01' })}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon sx={{ mr: 1 }} />
            {t('news:featured.location', { location: 'Online' })}
          </Box>
        </Box>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          {t('news:featured.register')}
        </Button>
      </Paper>

      {/* Filter */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t('news:filter.label')}:
        </Typography>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="content filter"
        >
          <ToggleButton value="all">{t('news:filter.all')}</ToggleButton>
          <ToggleButton value="events">{t('news:filter.events')}</ToggleButton>
          <ToggleButton value="news">{t('news:filter.news')}</ToggleButton>
          <ToggleButton value="announcements">{t('news:filter.announcements')}</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Categories */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {['upcoming', 'past', 'announcements'].map((category) => (
          <Grid item xs={12} md={4} key={category}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t(`news:categories.${category}`)}
                </Typography>
                {category === 'upcoming' && (
                  <Typography color="text.secondary">
                    {t('news:noEvents')}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small">
                  {t('news:readMore')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Newsletter Subscription */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {t('news:newsletter.title')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('news:newsletter.description')}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubscribe}
          sx={{
            display: 'flex',
            gap: 2,
            maxWidth: 500,
            mx: 'auto',
          }}
        >
          <TextField
            fullWidth
            placeholder={t('news:newsletter.placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained">
            {t('news:newsletter.button')}
          </Button>
        </Box>
      </Paper>

      {/* Success/Error Messages */}
      <Snackbar
        open={subscribeSuccess}
        autoHideDuration={6000}
        onClose={() => setSubscribeSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSubscribeSuccess(false)}>
          {t('news:newsletter.success')}
        </Alert>
      </Snackbar>
      <Snackbar
        open={subscribeError}
        autoHideDuration={6000}
        onClose={() => setSubscribeError(false)}
      >
        <Alert severity="error" onClose={() => setSubscribeError(false)}>
          {t('news:newsletter.error')}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default News;
