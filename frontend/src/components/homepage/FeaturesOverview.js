import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FeaturesOverview = () => {
  const { t } = useTranslation(['home']);
  const navigate = useNavigate();

  const features = [
    { 
      title: t('home:features.poems.title'), 
      description: t('home:features.poems.description'), 
      link: '/poems' 
    },
    { 
      title: t('home:features.association.title'), 
      description: t('home:features.association.description'), 
      link: '/association' 
    },
    { 
      title: t('home:features.journal.title'), 
      description: t('home:features.journal.description'), 
      link: '/journal' 
    },
    { 
      title: t('home:features.press.title'), 
      description: t('home:features.press.description'), 
      link: '/press' 
    },
    { 
      title: t('home:features.news.title'), 
      description: t('home:features.news.description'), 
      link: '/news' 
    },
    { 
      title: t('home:features.about.title'), 
      description: t('home:features.about.description'), 
      link: '/about' 
    },
  ];

  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {t('home:features.title')}
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        {t('home:features.subtitle')}
      </Typography>
      <List sx={{ maxWidth: 800, margin: '0 auto', padding: 0 }}>
        {features.map((feature, index) => (
          <ListItem
            key={index}
            sx={{
              display: 'block',
              marginBottom: 3,
              padding: 2,
              border: '1px solid #ddd',
              borderRadius: 2,
              backgroundColor: '#f9f9f9',
              transition: 'background-color 0.2s ease, transform 0.2s ease',
              '&:hover': {
                backgroundColor: '#f1f1f1',
                transform: 'translateY(-2px)',
              },
              cursor: 'pointer',
            }}
            onClick={() => navigate(feature.link)} 
          >
            <ListItemText
              primary={
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="textSecondary">
                  {feature.description}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FeaturesOverview;
