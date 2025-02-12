import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import poemService from '../services/poemService';
import { useTranslation } from 'react-i18next';

const AuthorsPage = () => {
  const { t } = useTranslation(['authorsPage']);
  const navigate = useNavigate(); 
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await poemService.getAllAuthors();
        setAuthors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Typography color="error" variant="h6">
          Failed to load authors: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        {t('authors:allUser')}
      </Typography>
      <Grid container spacing={4}>
        {authors.map((author) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={author._id}
          >
            <Card
              onClick={() => navigate(`/author/${author._id}`)}
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)', 
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', 
                },
              }}
            >
              <CardContent>
                <Typography variant="h6">{author.penName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {t('authors:joinedOn')} {new Date(author.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AuthorsPage;
