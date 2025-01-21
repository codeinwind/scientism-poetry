import React from 'react';
import { Box, Typography, Grid, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FeaturesOverview = () => {
  const { t } = useTranslation(['home']);
  const navigate = useNavigate();

  const features = [
    { 
      title: t('home:features.poems.title'), 
      description: t('home:features.poems.description'), 
      image: '/images/publish.jpg', 
      link: '/poems' 
    },
    { 
      title: t('home:features.association.title'), 
      description: t('home:features.association.description'), 
      image: '/images/community.jpg', 
      link: '/association' 
    },
    { 
      title: t('home:features.journal.title'), 
      description: t('home:features.journal.description'), 
      image: '/images/workshops.jpg', 
    
      link: '/journal' 
    },
    { 
      title: t('home:features.press.title'), 
      description: t('home:features.press.description'), 
      image: '/images/journal.jpg', 
      link: '/press' 
    },
  ];

  return (
    <Box sx={{ py: 6 }}>
      <Grid 
        container 
        spacing={4} 
        sx={{ maxWidth: 900, margin: '0 auto' }} 
        alignItems="stretch" 
      >
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                borderRadius: 3,
                boxShadow: 3,
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                cursor: 'pointer',
                backgroundColor: '#fff',
                height: '100%', 
              }}
              onClick={() => navigate(feature.link)}
            >
              <CardMedia
                component="img"
                height="180"
                image={feature.image}
                alt={feature.title}
                sx={{
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  padding: 3,
                  flexGrow: 1, 
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturesOverview;
