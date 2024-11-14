import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const DeleteConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  poemTitle,
  isDeleting = false 
}) => {
  const { t } = useTranslation(['dashboard', 'common']);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('dashboard:deleteDialog.title')}</DialogTitle>
      <DialogContent>
        <Typography>
          {t('dashboard:deleteDialog.message', { title: poemTitle })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common:cancel')}</Button>
        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {t('dashboard:deleteDialog.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
