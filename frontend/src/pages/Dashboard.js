import React, { useState } from 'react';
import { useQuery } from 'react-query';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { poemService } from '../services/api';

const Dashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPoem, setSelectedPoem] = useState(null);

  // Fetch user's poems using poemService
  const { data: poems, isLoading, error } = useQuery(['userPoems', user.id], async () => {
    try {
      const response = await poemService.getUserPoems(user.id);
      return { data: response.poems || [] };
    } catch (err) {
      // If it's a 404, return empty array
      if (err.response?.status === 404) {
        return { data: [] };
      }
      throw new Error(t('dashboard:errors.loadPoems'));
    }
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleCreateNew = () => {
    setSelectedPoem(null);
    setOpenDialog(true);
  };

  const handleEdit = (poem) => {
    setSelectedPoem(poem);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPoem(null);
  };

  const getFilteredPoems = () => {
    if (!poems?.data) return [];
    switch (tab) {
      case 0: // All
        return poems.data;
      case 1: // Published
        return poems.data.filter(poem => poem.status === 'published');
      case 2: // Under Review
        return poems.data.filter(poem => poem.status === 'under_review');
      case 3: // Drafts
        return poems.data.filter(poem => poem.status === 'draft');
      default:
        return poems.data;
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
        <Alert severity="error">{t('dashboard:errors.loadPoems')}</Alert>
      </Container>
    );
  }

  const hasPoems = poems?.data && poems.data.length > 0;

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
                        label={poem.status}
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
        <DialogTitle>
          {selectedPoem ? t('dashboard:dialog.edit.title') : t('dashboard:dialog.create.title')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label={t('dashboard:dialog.form.title.label')}
              defaultValue={selectedPoem?.title}
              margin="normal"
            />
            <TextField
              fullWidth
              label={t('dashboard:dialog.form.content.label')}
              multiline
              rows={6}
              defaultValue={selectedPoem?.content}
              margin="normal"
            />
            <TextField
              fullWidth
              label={t('dashboard:dialog.form.tags.label')}
              defaultValue={selectedPoem?.tags.join(', ')}
              margin="normal"
              helperText={t('dashboard:dialog.form.tags.helper')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common:cancel')}</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseDialog}
          >
            {selectedPoem ? t('dashboard:dialog.edit.button') : t('dashboard:dialog.create.button')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
