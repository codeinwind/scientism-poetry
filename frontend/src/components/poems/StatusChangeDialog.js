import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const STATUS_WORKFLOW = {
  draft: ['under_review'],
  under_review: ['published', 'draft'],
  published: ['under_review']
};

const STATUS_MESSAGES = {
  'draft-under_review': 'workflow.draft',
  'under_review-published': 'workflow.publish',
  'under_review-draft': 'workflow.reject',
  'published-under_review': 'workflow.unpublish'
};

const StatusChangeDialog = ({
  open,
  onClose,
  onConfirm,
  poem,
  newStatus,
  isSubmitting = false
}) => {
  const { t } = useTranslation(['admin']);

  if (!poem || !newStatus) return null;

  const isValidTransition = STATUS_WORKFLOW[poem.status]?.includes(newStatus);
  const transitionKey = `${poem.status}-${newStatus}`;
  const messageKey = STATUS_MESSAGES[transitionKey];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('poem.status.change')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {t('poem.status.current')}: {t(`dashboard:status.${poem.status}`)}
          </Typography>
          <Typography variant="subtitle1">
            {t('poem.status.next')}: {t(`dashboard:status.${newStatus}`)}
          </Typography>
        </Box>
        
        {!isValidTransition && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {t('poem.status.invalidTransition')}
          </Alert>
        )}

        <Typography>
          {t(`confirmations.${messageKey}`, {
            title: poem.title,
            defaultValue: t('confirmations.generic')
          })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {t('common:cancel')}
        </Button>
        <Button
          variant="contained"
          color={newStatus === 'published' ? 'success' : 'primary'}
          onClick={() => onConfirm(newStatus)}
          disabled={isSubmitting || !isValidTransition}
        >
          {t(`actions.${newStatus === 'published' ? 'publish' : 
            newStatus === 'draft' ? 'reject' : 'review'}`)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusChangeDialog;
