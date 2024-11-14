import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { poemService } from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Dashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [poemToDelete, setPoemToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const queryClient = useQueryClient();

  // Form validation schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .required(t('dashboard:validation.titleRequired'))
      .min(3, t('dashboard:validation.titleMin'))
      .max(100, t('dashboard:validation.titleMax')),
    content: Yup.string()
      .required(t('dashboard:validation.contentRequired'))
      .min(10, t('dashboard:validation.contentMin'))
      .max(5000, t('dashboard:validation.contentMax')),
    tags: Yup.string()
      .matches(/^[a-zA-Z0-9, ]*$/, t('dashboard:validation.tagsFormat')),
  });

  // Form handling with Formik
  const formik = useFormik({
    initialValues: {
      title: selectedPoem?.title || '',
      content: selectedPoem?.content || '',
      tags: selectedPoem?.tags.join(', ') || '',
      status: selectedPoem?.status || 'under_review',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const poemData = {
        ...values,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      if (selectedPoem) {
        editPoemMutation.mutate({ id: selectedPoem._id, ...poemData });
      } else {
        createPoemMutation.mutate(poemData);
      }
    },
  });

  // Fetch user's poems using poemService
  const { data: poemsData, isLoading, error } = useQuery(['userPoems', user.id], async () => {
    try {
      const response = await poemService.getUserPoems(user.id);
      return { 
        poems: response.poems || [], // Updated to match new API response structure
        count: response.count || 0
      };
    } catch (err) {
      if (err.response?.status === 404) {
        return { poems: [], count: 0 };
      }
      throw new Error(t('dashboard:errors.loadPoems'));
    }
  });

  // Mutations
  const createPoemMutation = useMutation(
    (poemData) => poemService.createPoem(poemData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userPoems', user.id]);
        handleCloseDialog();
        showSnackbar(t('dashboard:success.created'), 'success');
      },
      onError: (error) => {
        const message = error.response?.data?.message || t('dashboard:errors.create');
        showSnackbar(message, 'error');
      },
    }
  );

  const editPoemMutation = useMutation(
    ({ id, ...poemData }) => poemService.updatePoem(id, poemData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userPoems', user.id]);
        handleCloseDialog();
        showSnackbar(t('dashboard:success.updated'), 'success');
      },
      onError: (error) => {
        const message = error.response?.data?.message || t('dashboard:errors.update');
        showSnackbar(message, 'error');
      },
    }
  );

  const deletePoemMutation = useMutation(
    (id) => poemService.deletePoem(id),
    {
      onMutate: async (deletedId) => {
        await queryClient.cancelQueries(['userPoems', user.id]);
        const previousData = queryClient.getQueryData(['userPoems', user.id]);
        queryClient.setQueryData(['userPoems', user.id], old => ({
          poems: old.poems.filter(poem => poem._id !== deletedId),
          count: (old.count || 0) - 1
        }));
        return { previousData };
      },
      onSuccess: () => {
        handleCloseDeleteConfirm();
        showSnackbar(t('dashboard:success.deleted'), 'success');
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(['userPoems', user.id], context.previousData);
        const message = error.response?.data?.message || t('dashboard:errors.delete');
        showSnackbar(message, 'error');
      },
      onSettled: () => {
        queryClient.invalidateQueries(['userPoems', user.id]);
      },
    }
  );

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleCreateNew = () => {
    setSelectedPoem(null);
    formik.resetForm();
    setOpenDialog(true);
  };

  const handleEdit = (poem) => {
    setSelectedPoem(poem);
    formik.setValues({
      title: poem.title,
      content: poem.content,
      tags: poem.tags.join(', '),
      status: poem.status,
    });
    setOpenDialog(true);
  };

  const handleDelete = (poem) => {
    setPoemToDelete(poem);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPoem(null);
    formik.resetForm();
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setPoemToDelete(null);
  };

  const confirmDelete = () => {
    if (poemToDelete) {
      deletePoemMutation.mutate(poemToDelete._id);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getFilteredPoems = () => {
    if (!poemsData?.poems) return [];
    switch (tab) {
      case 0: // All
        return poemsData.poems;
      case 1: // Published
        return poemsData.poems.filter(poem => poem.status === 'published');
      case 2: // Under Review
        return poemsData.poems.filter(poem => poem.status === 'under_review');
      case 3: // Drafts
        return poemsData.poems.filter(poem => poem.status === 'draft');
      default:
        return poemsData.poems;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error.message || t('dashboard:errors.loadPoems')}</Alert>
      </Container>
    );
  }

  const hasPoems = poemsData?.poems && poemsData.poems.length > 0;

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          {t('dashboard:title')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('dashboard:welcome', { name: user.name })}
        </Typography>
      </Box>

      {hasPoems ? (
        <>
          {/* Action Button */}
          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
            >
              {t('dashboard:createPoem')}
            </Button>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs value={tab} onChange={handleTabChange}>
              <Tab label={t('dashboard:tabs.all')} />
              <Tab label={t('dashboard:tabs.published')} />
              <Tab label={t('dashboard:tabs.underReview')} />
              <Tab label={t('dashboard:tabs.drafts')} />
            </Tabs>
          </Box>

          {/* Poems Grid */}
          <Grid container spacing={4}>
            {getFilteredPoems().map((poem) => (
              <Grid item xs={12} md={6} key={poem._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h5">{poem.title}</Typography>
                      <Chip
                        label={t(`dashboard:status.${poem.status}`)}
                        color={
                          poem.status === 'published'
                            ? 'success'
                            : poem.status === 'under_review'
                            ? 'warning'
                            : 'default'
                        }
                        size="small"
                      />
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
                      onClick={() => handleEdit(poem)}
                    >
                      {t('dashboard:poem.actions.edit')}
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(poem)}
                    >
                      {t('dashboard:poem.actions.delete')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        // Empty State
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('dashboard:emptyState.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
            {t('dashboard:emptyState.description')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            {t('dashboard:emptyState.button')}
          </Button>
        </Box>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {selectedPoem ? t('dashboard:dialog.edit.title') : t('dashboard:dialog.create.title')}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label={t('dashboard:dialog.form.title.label')}
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                margin="normal"
              />
              <TextField
                fullWidth
                id="content"
                name="content"
                label={t('dashboard:dialog.form.content.label')}
                multiline
                rows={6}
                value={formik.values.content}
                onChange={formik.handleChange}
                error={formik.touched.content && Boolean(formik.errors.content)}
                helperText={
                  (formik.touched.content && formik.errors.content) ||
                  t('dashboard:dialog.form.content.counter', {
                    current: formik.values.content.length,
                    max: 5000
                  })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                id="tags"
                name="tags"
                label={t('dashboard:dialog.form.tags.label')}
                value={formik.values.tags}
                onChange={formik.handleChange}
                error={formik.touched.tags && Boolean(formik.errors.tags)}
                helperText={
                  (formik.touched.tags && formik.errors.tags) ||
                  t('dashboard:dialog.form.tags.helper')
                }
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('common:cancel')}</Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {selectedPoem ? t('dashboard:dialog.edit.button') : t('dashboard:dialog.create.button')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>{t('dashboard:deleteDialog.title')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('dashboard:deleteDialog.message', { title: poemToDelete?.title })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>{t('common:cancel')}</Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
            disabled={deletePoemMutation.isLoading}
          >
            {t('dashboard:deleteDialog.confirm')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default Dashboard;
