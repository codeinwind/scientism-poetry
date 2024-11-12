import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/shared/PageHeader';

const Press = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader title={t('nav.press')} />
      
      {/* Introduction */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Typography variant="body1" paragraph>
          {t('press.intro')}
        </Typography>
      </Paper>

      {/* Services Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          {t('press.services.title')}
        </Typography>
        <List>
          {[1, 2, 3, 4, 5].map((num) => (
            <ListItem key={num} sx={{ pl: 0 }}>
              <ListItemText
                primary={t(`press.services.items.${num}`)}
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
          {t('press.benefits.title')}
        </Typography>
        <List>
          {[1, 2, 3].map((num) => (
            <ListItem key={num} sx={{ pl: 0 }}>
              <ListItemText
                primary={t(`press.benefits.items.${num}`)}
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
          {t('press.contact')}
        </Typography>
      </Box>
    </Container>
  );
};

export default Press;
