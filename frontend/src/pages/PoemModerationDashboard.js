import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { adminService } from '../services';

const PoemModerationDashboard = () => {
  const { t } = useTranslation(['admin', 'common']);
  const { user } = useAuth();
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [comment, setComment] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchPoems();
  }, []);

  const fetchPoems = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPoemsForModeration();
      if (response.success) {
        setPoems(response.data);
      }
    } catch (error) {
      console.error('Error fetching poems:', error);
      setError(t('admin:errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (poemId, newStatus) => {
    try {
      const response = await adminService.updatePoemStatus(poemId, newStatus);
      if (response.success) {
        await fetchPoems(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating poem status:', error);
      setError(t('admin:errors.actionFailed'));
    }
  };

  const handleAddComment = async () => {
    if (!selectedPoem || !comment.trim()) return;

    try {
      const response = await adminService.addReviewComment(selectedPoem._id, comment);
      if (response.success) {
        setComment('');
        setDialogOpen(false);
        await fetchPoems(); // Refresh the list
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(t('admin:errors.actionFailed'));
    }
  };

  const openCommentDialog = (poem) => {
    setSelectedPoem(poem);
    setDialogOpen(true);
  };

  if (loading) return <Typography>{t('common:loading')}</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('admin:moderation.title')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('admin:moderation.table.title')}</TableCell>
                <TableCell>{t('admin:moderation.table.author')}</TableCell>
                <TableCell>{t('admin:moderation.table.status')}</TableCell>
                <TableCell>{t('admin:moderation.table.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {poems.map((poem) => (
                <TableRow key={poem._id}>
                  <TableCell>
                    <Typography variant="subtitle1">{poem.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {poem.content.substring(0, 100)}...
                    </Typography>
                  </TableCell>
                  <TableCell>{poem.author.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`admin:moderation.status.${poem.status}`)}
                      color={poem.status === 'under_review' ? 'warning' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => openCommentDialog(poem)}
                      >
                        {t('admin:moderation.actions.addComment')}
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusUpdate(poem._id, 'published')}
                      >
                        {t('admin:moderation.actions.approve')}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleStatusUpdate(poem._id, 'draft')}
                      >
                        {t('admin:moderation.actions.reject')}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {poems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t('admin:moderation.noPoems')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('admin:moderation.dialog.title')}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t('admin:moderation.dialog.commentLabel')}
              fullWidth
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="inherit">
              {t('common:cancel')}
            </Button>
            <Button onClick={handleAddComment} color="primary" variant="contained">
              {t('admin:moderation.dialog.submit')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default PoemModerationDashboard;
