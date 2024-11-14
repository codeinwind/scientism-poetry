import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { SentimentDissatisfied as EmptyIcon } from '@mui/icons-material';

const EmptyState = ({
  icon: Icon = EmptyIcon,
  title,
  description,
  actionLabel,
  onAction,
  iconSize = 64,
  spacing = 8,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        py: spacing,
      }}
    >
      <Icon sx={{ fontSize: iconSize, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        paragraph 
        sx={{ mb: 4, maxWidth: 600 }}
      >
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button
          variant="text"
          color="primary"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
