import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Avatar,
  Paper,
  IconButton,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import poemService from '../services/poemService';
import { useTranslation } from 'react-i18next';

const AuthorPoemsPage = () => {
  const { t } = useTranslation(['authorPoemPage']);
  const { authorId } = useParams();
  const navigate = useNavigate();
  const [poems, setPoems] = useState([]);
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchAuthorPoems = async () => {
      try {
        const response = await poemService.getAuthorPoems(authorId);
        if (!response.author || !response.poems) {
          throw new Error('Invalid response format');
        }
        setAuthor(response.author);
        setBio(response.author.bio || '');
        setPoems(response.poems);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorPoems();
  }, [authorId]);

  const handleNavigateToDetail = (poemId) => {
    if (poemId) {
      navigate(`/poems/${poemId}`);
    }
  };

  const handleSaveBio = async () => {
    try {
      await poemService.updateAuthorBio(authorId, bio);
      setAuthor((prev) => ({ ...prev, bio }));
      setIsEditingBio(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setBio(author.bio || '');
    setIsEditingBio(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Typography color="error" variant="h6">
          Failed to load poems: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {author && (
        <Paper elevation={3} sx={{ p: 3, mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 64, height: 64, mr: 3 }}>
              {author.name?.[0] || 'A'}
            </Avatar>
            <Box>
              <Typography variant="h5">{author.name || 'Unknown'}</Typography>
              <Typography variant="caption" display="block">
                {t('authors:joinedOn')} {author.createdAt ? new Date(author.createdAt).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mt: 2,
              cursor: isEditingBio ? 'default' : 'pointer',
            }}
            onClick={!isEditingBio ? () => setIsEditingBio(true) : undefined}
          >
            {isEditingBio ? (
              <>
                <TextField
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
                <IconButton color="primary" onClick={handleSaveBio}>
                  <SaveIcon />
                </IconButton>
                <IconButton color="secondary" onClick={handleCancelEdit}>
                  <CancelIcon />
                </IconButton>
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ flex: 1 }}>
                  {author.bio || 'Click to add a bio'}
                </Typography>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Paper>
      )}
      {/* List of Poems */}
      <Typography variant="h4" component="h1" gutterBottom>
        {author
          ? t('authors:poemsBy', { authorName: author.name || 'Unknown' })
          : t('authors:unknownAuthor')}
      </Typography>

      {poems.length === 0 ? (
        <Typography variant="h6" color="text.primary" sx={{ textAlign: 'center', mt: 4 }}>
          {t('authors:noPoems')}
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {poems.map((poem) => (
            <Grid item xs={12} sm={6} md={4} key={poem._id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => handleNavigateToDetail(poem._id)}
              >
                <CardContent>
                  <Typography variant="h6">{poem.title}</Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      whiteSpace: 'pre-line',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-word',
                    }}
                  >
                    {poem.content?.substring(0, 100) || 'No content available'}...
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ marginTop: 2, textAlign: 'right' }}
                  >
                    {poem.createdAt
                      ? t('authors:publishedOn', {
                          date: new Date(poem.createdAt).toLocaleDateString(),
                        })
                      : 'Unknown'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AuthorPoemsPage;
