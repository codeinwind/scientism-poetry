import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, CardMedia, Grid, Button} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/shared/PageHeader';

const Press = () => {
  const { t, i18n } = useTranslation(['press', 'nav']);
  const currentLanguage = i18n.language.split('-')[0] || 'en';
  const FEATURE_CONFIG = {
    coverImages: {
      en: '/images/book-cover-en.jpg',
      zh: '/images/book-cover-zh.jpg'
    },
    amazonLinks: {
      en: "https://www.amazon.com/dp/B0DQJVM15R?ref=cm_sw_r_ffobk_mwn_dp_Z7E6A701AFW0KZ3N7KQS&ref_=cm_sw_r_ffobk_mwn_dp_Z7E6A701AFW0KZ3N7KQS&social_share=cm_sw_r_ffobk_mwn_dp_Z7E6A701AFW0KZ3N7KQS&peakEvent=5&dealEvent=0&language=en_US&skipTwisterOG=1&bestFormat=true",
      zh: "https://a.co/d/a42plM1"
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader title={t('nav:press')} />

      {/* Introduction */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Typography variant="body1" paragraph>
          {t('press:intro')}
        </Typography>
      </Paper>

      {/* New book preview */}
      <Grid item xs={12}>
        <Paper elevation={0} sx={{
          p: 3,
          bgcolor: 'grey.50',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.300',
          mb: 6,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
          height: 400
        }}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            <Grid item xs={12} md={8} sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%'
            }}>
              <Box sx={{
                textAlign: 'left',
                maxWidth: 600,
                margin: '0 auto'
              }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  color="grey.800"
                  sx={{
                    fontWeight: 'bold',
                    letterSpacing: '0.5px',
                    mb: 2
                  }}
                >
                  {t('press:newBookAnnouncement.title')}
                </Typography>

                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: '"Times New Roman", serif',
                    lineHeight: 1.3,
                    color: 'grey.700',
                    fontStyle: 'italic',
                    mb: 2
                  }}
                >
                  {t('press:newBookAnnouncement.details')}
                </Typography>

                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: '"Times New Roman", serif',
                    lineHeight: 1.3,
                    color: 'grey.700',
                    fontStyle: 'italic'
                  }}
                >
                  {t('press:newBookAnnouncement.date')}
                </Typography>
              </Box>
            </Grid>

            {/* Book Picture */}
            <Grid item xs={12} md={4} sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CardMedia
                component="img"
                image="/images/new-book-cover.jpg"
                alt={t('press:newBookAnnouncement.coverAlt')}
                sx={{
                  height: 'auto',
                  maxHeight: 300,
                  width: '80%',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Book */}
      <Grid container spacing={4} alignItems="center" sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image={FEATURE_CONFIG.coverImages[currentLanguage]}
            alt="Book Cover"
            sx={{
              height: { xs: 300, md: 450 },
              width: '100%',
              objectFit: 'contain',
              borderRadius: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pl: { md: 4 } }}>
            <Typography variant="h3" gutterBottom align="left">
              {t('press:featuredBook.title')}
            </Typography>
            <Typography variant="h4" gutterBottom align="left">
              {t('press:featuredBook.bookTitle')}
            </Typography>
            <Typography variant="body1" paragraph align="left">
              {t('press:featuredBook.description')}
            </Typography>
            <Box sx={{ mt: 0.1 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href={FEATURE_CONFIG.amazonLinks[currentLanguage]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('press:featuredBook.button')}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Services Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          {t('press:services.title')}
        </Typography>
        <List>
          {[1, 2, 3, 4, 5].map((num) => (
            <ListItem key={num} sx={{ pl: 0 }}>
              <ListItemText
                primary={t(`press:services.items.${num}`)}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 'medium',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          {t('press:benefits.title')}
        </Typography>
        <List>
          {[1, 2, 3].map((num) => (
            <ListItem key={num} sx={{ pl: 0 }}>
              <ListItemText
                primary={t(`press:benefits.items.${num}`)}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 'medium',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Contact Information */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
          {t('press:contact')}
        </Typography>
      </Box>
    </Container>
  );
};

export default Press;
