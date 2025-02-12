import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Divider,
  Paper,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import poemService from '../services/poemService';

const PoemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['poems']);
  const { isAuthenticated, user } = useAuth();
  
  const [poem, setPoem] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchPoem();
  }, [id]);

  const fetchPoem = async () => {
    try {
      setLoading(true);
      const response = await poemService.getPoemById(id);
      setPoem(response.data);
    } catch (error) {
      setError(error.message);
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      showSnackbar(t('poems:detail.loginToComment'), 'warning');
      return;
    }

    if (!newComment.trim()) {
      showSnackbar(t('poems:detail.commentRequired'), 'warning');
      return;
    }

    try {
      const response = await poemService.addComment(id, newComment);
      setNewComment('');
      setPoem(response.data);
      showSnackbar(t('poems:detail.commentAdded'), 'success');
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      showSnackbar(t('poems:detail.loginToLike'), 'warning');
      return;
    }

    try {
      const isCurrentlyLiked = poem.likes.includes(user.id);
      const updatedLikes = isCurrentlyLiked
        ? poem.likes.filter(id => id !== user.id)
        : [...poem.likes, user.id];
      
      setPoem(prev => ({
        ...prev,
        likes: updatedLikes
      }));

      const response = await poemService.likePoem(id);
      
      setPoem(prev => ({
        ...prev,
        likes: response.data.likes
      }));

      showSnackbar(
        isCurrentlyLiked 
          ? t('poems:actions.like.removed')
          : t('poems:actions.like.success'),
        'success'
      );
    } catch (error) {
      await fetchPoem();
      showSnackbar(t('poems:actions.like.error'), 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/poems')}
          sx={{ mt: 2 }}
        >
          {t('poems:detail.backToPoems')}
        </Button>
      </Container>
    );
  }

  if (!poem) return null;

  const isLiked = poem.likes?.includes(user?.id);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/poems')}
        sx={{ mb: 4 }}
        color="inherit"
      >
        {t('poems:detail.backToPoems')}
      </Button>

      <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: '#fafafa' }}>
        <Box sx={{ 
          textAlign: 'center',
          maxWidth: '600px',
          mx: 'auto',
          position: 'relative',
          '&::before, &::after': {
            content: '""',
            display: 'block',
            height: '2px',
            width: '40px',
            backgroundColor: 'primary.main',
            margin: '20px auto'
          }
        }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: 'primary.dark',
              mb: 2
            }}
          >
            {poem.title}
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            gutterBottom
            sx={{ 
              fontStyle: 'italic',
              mb: 3
            }}
          >
            {t('poems:poem.by', { author: poem.author.penName })}
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-line',
              mb: 3,
              lineHeight: 1.8,
              fontSize: '1.1rem',
              fontFamily: '"Merriweather", serif',
              color: '#2c3e50',
              textAlign: 'left' 
            }}
          >
            {poem.content}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {poem.tags?.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{ 
                  mr: 1, 
                  mb: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                  }
                }}
              />
            ))}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mt: 3
          }}>
            <Tooltip title={!isAuthenticated ? t('poems:detail.loginToLike') : ''}>
              <span>
                <IconButton
                  onClick={handleLike}
                  disabled={!isAuthenticated}
                  color={isLiked ? 'primary' : 'default'}
                  sx={{ 
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Typography 
              variant="body2"
              sx={{ 
                ml: 1,
                color: 'text.secondary',
                fontFamily: '"Roboto", sans-serif'
              }}
            >
              {t('poems:poem.likes', { count: poem.likes?.length || 0 })}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, backgroundColor: '#fff' }}>
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            fontFamily: '"Playfair Display", serif',
            color: 'primary.dark',
            mb: 3,
            textAlign: 'center'
          }}
        >
          {t('poems:detail.comments')}
        </Typography>
        
        {isAuthenticated ? (
          <Box sx={{ mb: 4 }}>
            <TextField
              label={t('poems:detail.addComment')}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            />
            <Box sx={{ textAlign: 'right' }}>
              <Button 
                variant="contained" 
                onClick={handleCommentSubmit}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                {t('poems:detail.submit')}
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              textAlign: 'center',
              fontStyle: 'italic'
            }}
          >
            {t('poems:detail.loginToComment')}
          </Typography>
        )}

        <List>
          {poem.comments?.map((comment, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <Divider variant="inset" component="li" sx={{ my: 1 }} />
              )}
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {comment.user.penName[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography 
                      sx={{ 
                        fontWeight: 500,
                        color: 'primary.dark'
                      }}
                    >
                      {comment.user.penName}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      sx={{ 
                        color: 'text.secondary',
                        mt: 0.5,
                        lineHeight: 1.6
                      }}
                    >
                      {comment.content}
                    </Typography>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PoemDetail;
