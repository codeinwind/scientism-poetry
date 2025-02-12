import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { authService } from '../services';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const Profile = () => {
  const { t } = useTranslation(['profile', 'common']);
  const { user: globalUser, updateUser } = useAuth();

  // Maintain a local copy of the user (localUser) and form fields (fieldValues)
  const [localUser, setLocalUser] = useState(globalUser || {});
  const [fieldValues, setFieldValues] = useState({
    bio: localUser.bio || '',
    penName: localUser.penName || '',
  });

  const [editableFields, setEditableFields] = useState({ bio: false, penName: false });

  // If the global user changes (for example, a new user is obtained after a new login or page refresh), synchronize the change to the local computer
  useEffect(() => {
    setLocalUser(globalUser || {});
    setFieldValues({
      bio: globalUser?.bio || '',
      penName: globalUser?.penName || '',
    });
  }, [globalUser]);

  const [activityStats, setActivityStats] = useState({
    publishedPoems: 0,
    totalLikes: 0,
    commentsMade: 0,
  });

  const [authorApplication, setAuthorApplication] = useState(null);
  const [statement, setStatement] = useState('');
  const [applicationLoading, setApplicationLoading] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await authService.getAuthorApplication(localUser._id);
        if (response.application) {
          setAuthorApplication(prev => ({ ...prev, ...response.application }));
          setStatement(response.application.content.statement);
        }
      } catch (error) {
        console.error('Failed to obtain the application status. Procedure:', error);
      }
    };
    fetchApplication();
  }, []);

  const handleApplicationSubmit = async () => {
    if (!statement.trim()) {
      setError(t('profile:authorApplication.sections.statement.validation.required'));
      return;
    }
    if (statement.length < 10 || statement.length > 2000) {
      setError(t('profile:authorApplication.sections.statement.validation.length'));
      return;
    }

    setApplicationLoading(true);
    const params = {
      userId: localUser._id,
      statement: statement.trim()
    };

    try {
      const response = await authService.submitAuthorApplication(params);
      setAuthorApplication(response.application);
      setSuccess(
        response.message
          ? t('profile:authorApplication.messages.submitSuccess')
          : t('profile:authorApplication.messages.updateSuccess')
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setApplicationLoading(false);
    }
  };

  useEffect(() => {
    const fetchActivityStats = async () => {
      try {
        const response = await authService.getActivityStats();
        if (response.success) {
          setActivityStats(response);
        }
      } catch (error) {
        console.error('Failed to fetch activity stats:', error);
      }
    };
    fetchActivityStats();
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleEditClick = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleCancelClick = (field) => {
    setFieldValues((prev) => ({
      ...prev,
      [field]: localUser[field] || '',
    }));
    setEditableFields((prev) => ({ ...prev, [field]: false }));
    setError('');
    setSuccess('');
  };

  const handleSaveClick = async (field) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let response;

      if (field === 'bio') {
        response = await authService.updateAuthorBio(localUser._id, fieldValues.bio);
      } else if (field === 'penName') {
        if (!fieldValues.penName.trim()) {
          setError(t('profile:form.penName.required'));
          setLoading(false);
          return;
        }

        response = await authService.updatePenName(localUser._id, fieldValues.penName);
      } else {
        throw new Error('Invalid field to update');
      }

      if (response && response.author) {
        const updatedUser = response.author;
        setLocalUser(updatedUser);
        setFieldValues((prev) => ({
          ...prev,
          [field]: updatedUser[field] || '',
        }));

        updateUser(updatedUser);
        setSuccess(t('profile:messages.updateSuccess'));
      }

      setEditableFields((prev) => ({ ...prev, [field]: false }));
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || t('profile:messages.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" gutterBottom>
        {t('profile:title')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t('profile:profileInfo')}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ flexBasis: '25%' }}>
                {t('profile:form.name.label')}
              </Typography>
              <Typography variant="body1" sx={{ flex: 1 }}>
                {localUser?.name || 'N/A'}
              </Typography>
            </Box>

            {/* Email */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ flexBasis: '25%' }}>
                {t('profile:form.email.label')}
              </Typography>
              <Typography variant="body1" sx={{ flex: 1 }}>
                {localUser?.email || 'N/A'}
              </Typography>
            </Box>

            {/* Pen Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ flexBasis: '25%' }}>
                {t('profile:form.penName.label')}
              </Typography>
              {editableFields.penName ? (
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <TextField
                    value={fieldValues.penName}
                    onChange={(e) => handleChange('penName', e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <IconButton onClick={() => handleSaveClick('penName')} disabled={loading}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={() => handleCancelClick('penName')}>
                    <CancelIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    {localUser?.penName || t('profile:noValue')}
                  </Typography>
                  <IconButton onClick={() => handleEditClick('penName')}>
                    <EditIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* Bio */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ flexBasis: '25%' }}>
                {t('profile:form.bio.label')}
              </Typography>
              {editableFields.bio ? (
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <TextField
                    value={fieldValues.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <IconButton onClick={() => handleSaveClick('bio')} disabled={loading}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={() => handleCancelClick('bio')}>
                    <CancelIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    {localUser?.bio?.trim() || t('profile:form.bio.noBio')}
                  </Typography>
                  <IconButton onClick={() => handleEditClick('bio')}>
                    <EditIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Profile Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {localUser?.name?.charAt(0)}
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6">{localUser?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('profile:stats.memberSince', {
                      date: formatDate(localUser?.createdAt),
                    })}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2">{t('profile:stats.title')}</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  {t('profile:stats.publishedPoems', { count: activityStats.publishedPoems })}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {t('profile:stats.totalLikes', { count: activityStats.totalLikes })}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {t('profile:stats.commentsMade', { count: activityStats.commentsMade })}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* hot author request block */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DescriptionIcon sx={{ mr: 1 }} />
              {t('profile:authorApplication.title')}
            </Typography>
            <Divider sx={{ my: 2 }} />

            {authorApplication ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ mr: 2 }}>
                    {t('profile:authorApplication.sections.status.current')}
                  </Typography>
                  {authorApplication.status === 'approved' && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={t('profile:authorApplication.sections.status.approved')}
                      color="success"
                      variant="outlined"
                    />
                  )}
                  {authorApplication.status === 'rejected' && (
                    <Chip
                      label={t('profile:authorApplication.sections.status.rejected')}
                      color="error"
                      variant="outlined"
                    />
                  )}
                  {['draft', 'submitted', 'under_review'].includes(authorApplication.status) && (
                    <Chip
                      icon={<HourglassEmptyIcon />}
                      label={t(`profile:authorApplication.sections.status.${authorApplication.status}`)}
                      color="warning"
                      variant="outlined"
                    />
                  )}
                </Box>

                {authorApplication?.status !== 'approved' && ( // Only show the form when there is no application OR when it's not approved
                  <>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={statement}
                      onChange={(e) => setStatement(e.target.value)}
                      label={t('profile:authorApplication.sections.statement.label')}
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleApplicationSubmit}
                      disabled={applicationLoading}
                      startIcon={applicationLoading ? <CircularProgress size={20} /> : null}
                    >
                      {t(`profile:authorApplication.actions.${authorApplication.status === 'draft' ? 'saveDraft' : 'update'}`)}
                    </Button>
                  </>
                )}
              </Box>
            ) : (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder={t('profile:authorApplication.sections.statement.placeholder')}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleApplicationSubmit}
                  disabled={applicationLoading}
                  startIcon={applicationLoading ? <CircularProgress size={20} /> : null}
                >
                  {t('profile:authorApplication.actions.submit')}
                </Button>
              </Box>
            )
            }
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
