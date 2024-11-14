import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useDialogManagement = () => {
  const { t } = useTranslation(['dashboard']);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [poemToDelete, setPoemToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCreateNew = () => {
    setSelectedPoem(null);
    setOpenDialog(true);
  };

  const handleEdit = (poem) => {
    setSelectedPoem(poem);
    setOpenDialog(true);
  };

  const handleDelete = (poem) => {
    setPoemToDelete(poem);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedPoem(null);
    setOpenDialog(false);
  };

  const handleCloseDeleteConfirm = () => {
    setPoemToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSuccess = (type) => {
    let message;
    switch (type) {
      case 'created':
        message = t('dashboard:success.created');
        break;
      case 'updated':
        message = t('dashboard:success.updated');
        break;
      case 'deleted':
        message = t('dashboard:success.deleted');
        break;
      case 'savedAsDraft':
        message = t('dashboard:success.savedAsDraft');
        break;
      case 'submittedForReview':
        message = t('dashboard:success.submittedForReview');
        break;
      default:
        message = '';
    }
    
    setSnackbar({
      open: true,
      message,
      severity: 'success'
    });
  };

  const handleError = (error, type) => {
    let message;
    switch (type) {
      case 'create':
        message = t('dashboard:errors.create');
        break;
      case 'update':
        message = t('dashboard:errors.update');
        break;
      case 'delete':
        message = t('dashboard:errors.delete');
        break;
      default:
        message = error.message || t('dashboard:errors.unknown');
    }

    setSnackbar({
      open: true,
      message,
      severity: 'error'
    });
  };

  return {
    openDialog,
    selectedPoem,
    deleteConfirmOpen,
    poemToDelete,
    snackbar,
    handleCreateNew,
    handleEdit,
    handleDelete,
    handleCloseDialog,
    handleCloseDeleteConfirm,
    handleCloseSnackbar,
    handleSuccess,
    handleError,
  };
};

export default useDialogManagement;
