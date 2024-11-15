import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const PublicPoemCard = ({ 
  poem, 
  onLike, 
  onTagClick, 
  isAuthenticated, 
  isLiked 
}) => {
  const { t } = useTranslation(['poems']);
  const navigate = useNavigate();

  const handleNavigateToDetail = () => {
    navigate(`/poems/${poem._id}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike(poem._id);
  };

  const handleTagClick = (e, tag) => {
    e.stopPropagation();
    onTagClick(tag);
  };

  return (
    <Card sx={{ 
      cursor: 'pointer',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4,
      }
    }}>
      <CardContent onClick={handleNavigateToDetail}>
        <Typography variant="h5" gutterBottom>
          {poem.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {t('poems:poem.by', { author: poem.author.name })}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-line',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {poem.content}
        </Typography>
        <Box sx={{ mb: 2 }}>
          {poem.tags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{ mr: 1, mb: 1 }}
              onClick={(e) => handleTagClick(e, tag)}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Tooltip title={isAuthenticated ? '' : t('poems:loginToLike')}>
            <span>
              <IconButton
                size="small"
                color={isLiked ? "primary" : "default"}
                onClick={handleLikeClick}
                disabled={!isAuthenticated}
              >
                <FavoriteIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Typography variant="body2" component="span" sx={{ ml: 1 }}>
            {t('poems:poem.likes', { count: poem.likes?.length || 0 })}
          </Typography>
          <IconButton
            size="small"
            sx={{ ml: 2 }}
            onClick={handleNavigateToDetail}
          >
            <CommentIcon />
          </IconButton>
          <Typography variant="body2" component="span" sx={{ ml: 1 }}>
            {t('poems:poem.comments', { count: poem.comments?.length || 0 })}
          </Typography>
        </Box>
        <Button
          size="small"
          color="primary"
          onClick={handleNavigateToDetail}
        >
          {t('poems:poem.readMore')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PublicPoemCard;
