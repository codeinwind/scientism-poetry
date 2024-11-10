import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Avatar,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';

const PoemCard = ({
  poem,
  onLike,
  onComment,
  showActions = true,
  showAuthor = true,
  elevation = 1,
}) => {
  const { user, isAuthenticated } = useAuth();
  const isLiked = poem.likes?.includes(user?.id);

  const handleLike = (e) => {
    e.preventDefault();
    if (onLike) onLike(poem._id);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (onComment) onComment(poem._id);
  };

  return (
    <Card elevation={elevation}>
      <CardContent>
        {showAuthor && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={poem.author.avatar}
              alt={poem.author.name}
              sx={{ width: 40, height: 40, mr: 2 }}
            >
              {poem.author.name[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" component="div">
                {poem.author.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(poem.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        )}

        <Typography variant="h6" component="div" gutterBottom>
          {poem.title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
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

        <Box sx={{ mb: 1 }}>
          {poem.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{ mr: 1, mb: 1 }}
              component={RouterLink}
              to={`/poems?tag=${tag}`}
              clickable
            />
          ))}
        </Box>
      </CardContent>

      {showActions && (
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={handleLike}
              disabled={!isAuthenticated}
              color={isLiked ? 'primary' : 'default'}
            >
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1, mr: 2 }}>
              {poem.likes?.length || 0}
            </Typography>

            <IconButton
              size="small"
              onClick={handleComment}
              disabled={!isAuthenticated}
            >
              <CommentIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {poem.comments?.length || 0}
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to={`/poems/${poem._id}`}
            size="small"
            color="primary"
          >
            Read More
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default PoemCard;
