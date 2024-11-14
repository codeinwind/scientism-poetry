import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import StatusChangeDialog from './StatusChangeDialog';

const STATUS_WORKFLOW = {
  draft: ['under_review'],
  under_review: ['published', 'draft'],
  published: ['under_review']
};

const STATUS_COLORS = {
  published: 'success',
  under_review: 'warning',
  draft: 'default'
};

const AdminPoemCard = ({ 
  poem, 
  onEdit, 
  onDelete, 
  onStatusChange,
  isSubmitting = false 
}) => {
  const { t } = useTranslation(['dashboard', 'admin']);
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleStatusClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusClose = () => {
    setAnchorEl(null);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setStatusDialogOpen(true);
    handleStatusClose();
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
    setSelectedStatus(null);
  };

  const handleStatusConfirm = async (status) => {
    await onStatusChange(poem._id, status);
    handleStatusDialogClose();
  };

  const availableStatuses = STATUS_WORKFLOW[poem.status] || [];

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" sx={{ 
              wordBreak: 'break-word',
              maxWidth: 'calc(100% - 140px)'
            }}>
              {poem.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Chip
                label={t(`dashboard:status.${poem.status}`)}
                color={STATUS_COLORS[poem.status]}
                size="small"
                sx={{ mr: 1 }}
              />
              <IconButton
                size="small"
                onClick={handleStatusClick}
                aria-label="change status"
                disabled={availableStatuses.length === 0 || isSubmitting}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleStatusClose}
              >
                {availableStatuses.map((status) => (
                  <MenuItem
                    key={status}
                    onClick={() => handleStatusSelect(status)}
                  >
                    {t(`dashboard:status.${status}`)}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
          >
            {t('admin:poem.by', { author: poem.author.name })}
          </Typography>
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
            {poem.tags.map((tag, index) => (
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
            disabled={isSubmitting}
          >
            {t('dashboard:poem.actions.edit')}
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(poem)}
            disabled={isSubmitting}
          >
            {t('dashboard:poem.actions.delete')}
          </Button>
        </CardActions>
      </Card>

      <StatusChangeDialog
        open={statusDialogOpen}
        onClose={handleStatusDialogClose}
        onConfirm={handleStatusConfirm}
        poem={poem}
        newStatus={selectedStatus}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default AdminPoemCard;
