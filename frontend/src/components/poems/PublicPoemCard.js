import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
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

  return (
    <Card>
      <CardContent>
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
          {poem.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{ mr: 1, mb: 1 }}
              onClick={() => onTagClick(tag)}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Box>
          <IconButton
            size="small"
            color={isLiked ? "primary" : "default"}
            onClick={() => onLike(poem._id)}
            disabled={!isAuthenticated}
          >
            <FavoriteIcon />
          </IconButton>
          <Typography variant="body2" component="span" sx={{ ml: 1 }}>
            {t('poems:poem.likes', { count: poem.likes?.length || 0 })}
          </Typography>
          <IconButton
            size="small"
            sx={{ ml: 2 }}
            onClick={() => window.location.href = `/poems/${poem._id}`}
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
          href={`/poems/${poem._id}`}
        >
          {t('poems:poem.readMore')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PublicPoemCard;
