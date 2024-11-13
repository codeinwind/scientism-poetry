import React from 'react';
import { Container, Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/shared/PageHeader';

const Association = () => {
  const { t } = useTranslation(['association', 'nav']);

  const cards = [
    {
      key: "purpose",
      title: t('association:cards.purpose.title'),
      content: t('association:cards.purpose.content')
    },
    {
      key: "mission",
      title: t('association:cards.mission.title'),
      content: t('association:cards.mission.content')
    },
    {
      key: "publishing",
      title: t('association:cards.publishing.title'),
      content: t('association:cards.publishing.content')
    },
    {
      key: "vision",
      title: t('association:cards.vision.title'),
      content: t('association:cards.vision.content')
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader title={t('nav:association')} />
      
      {/* Welcome Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          {t('association:welcome.title')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('association:welcome.intro')}
        </Typography>
        <Box component="ol" sx={{ pl: 2 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <Typography key={num} component="li" paragraph>
              {t(`association:welcome.reasons.${num}`)}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" paragraph>
          {t('association:welcome.conclusion')}
        </Typography>
      </Box>

      {/* Cards Section */}
      <Grid container spacing={4}>
        {cards.map((card) => (
          <Grid item xs={12} md={6} key={card.key}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {card.title}
                </Typography>
                <Typography variant="body1">
                  {card.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Association;
