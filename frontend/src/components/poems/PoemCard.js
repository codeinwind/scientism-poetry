import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Status configuration
const STATUS_CONFIG = {
  published: {
    color: 'success',
    key: 'published'
  },
  under_review: {
    color: 'warning',
    key: 'under_review'
  },
  draft: {
    color: 'default',
    key: 'draft'
  }
};

const PoemCard = ({ poem, onEdit, onDelete, showStatus = true }) => {
  const { t } = useTranslation(['dashboard']);

  // Debug logs
  console.log('Rendering PoemCard:', { 
    id: poem._id,
    title: poem.title,
    status: poem.status,
    showStatus
  });

  const getStatusConfig = (status) => {
    console.log('Getting status config for:', status); // Debug log
    return STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  };

  const statusConfig = getStatusConfig(poem.status);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ 
            wordBreak: 'break-word',
            maxWidth: showStatus ? 'calc(100% - 120px)' : '100%'
          }}>
            {poem.title}
          </Typography>
          {showStatus && (
            <Chip
              label={t(`dashboard:status.${statusConfig.key}`)}
              color={statusConfig.color}
              size="small"
              sx={{ ml: 1, flexShrink: 0 }}
              data-testid={`status-chip-${poem.status}`}
            />
          )}
        </Box>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-line',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word'
          }}
        >
          {poem.content}
        </Typography>
        <Box sx={{ mb: 1 }}>
          {poem.tags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary">
          {t('dashboard:poem.lastUpdated', {
            date: new Date(poem.updatedAt).toLocaleDateString()
          })}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(poem)}
          data-testid="edit-poem-button"
        >
          {t('dashboard:poem.actions.edit')}
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(poem)}
          data-testid="delete-poem-button"
        >
          {t('dashboard:poem.actions.delete')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PoemCard;
