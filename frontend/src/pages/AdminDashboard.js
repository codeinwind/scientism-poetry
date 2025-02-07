import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const AdminDashboard = () => {
  const { t } = useTranslation(['admin', 'common']);
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('admin:dashboard.title')}
        </Typography>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {user.role === 'superadmin' && (
            <Grid item xs={12} md={user.role === 'superadmin' ? 6 : 12}>
              <Card sx={{
                height: '100%',
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    padding: '12px 16px',
                    backgroundColor: 'action.hover',
                    borderRadius: 1
                  }}>
                    <SupervisorAccountIcon sx={{
                      mr: 2,
                      fontSize: 32,
                      color: 'primary.dark'
                    }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('admin:dashboard.userManagement')}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin:dashboard.userManagementDesc')}
                  </Typography>
                </CardContent>
                <CardActions sx={{ padding: 2 }}>
                <Button
                  component={RouterLink}
                  to="/admin/user/management/permission"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontWeight: 'bold',
                    letterSpacing: 0.5
                  }}>
                  {t('admin:dashboard.authorityManagement')}
                </Button>
              </CardActions>
              </Card>
            </Grid>
          )}

          <Grid item xs={12} md={user.role === 'superadmin' ? 6 : 12}>
            <Card sx={{
              height: '100%',
              boxShadow: 3,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  padding: '12px 16px',
                  backgroundColor: 'action.hover',
                  borderRadius: 1
                }}>
                  <RateReviewIcon sx={{
                    mr: 2,
                    fontSize: 32,
                    color: 'secondary.dark'
                  }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('admin:moderation.title')}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('admin:moderation.description')}
                </Typography>
              </CardContent>
              <CardActions sx={{ padding: 2 }}>
                <Button
                  component={RouterLink}
                  to="/admin/moderation"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontWeight: 'bold',
                    letterSpacing: 0.5
                  }}>
                  {t('admin:moderation.actions.viewDetails')}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Author review page */}
          {user.role === 'superadmin' && (
            <Grid item xs={12} md={user.role === 'superadmin' ? 6 : 12}>
              <Card sx={{
                height: '100%',
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    padding: '12px 16px',
                    backgroundColor: 'action.hover',
                    borderRadius: 1
                  }}>
                    <LibraryBooksIcon sx={{
                      mr: 2,
                      fontSize: 32,
                      color: 'warning.dark'
                    }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('admin:dashboard.columnWriterReview')}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin:dashboard.columnWriterReviewDesc')}
                  </Typography>
                </CardContent>
                <CardActions sx={{ padding: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/admin/author/review"
                    variant="contained"
                    color="warning"
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontWeight: 'bold',
                      letterSpacing: 0.5
                    }}>
                    {t('admin:dashboard.reviewApplications')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}

          {user.role === 'superadmin' && (
            <Grid item xs={12} md={user.role === 'superadmin' ? 6 : 12}>
              <Card sx={{
                height: '100%',
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    padding: '12px 16px',
                    backgroundColor: 'action.hover',
                    borderRadius: 1
                  }}>
                    <VpnKeyIcon sx={{
                      mr: 2,
                      fontSize: 32,
                      color: 'success.dark'
                    }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('admin:dashboard.userSecurity')}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin:dashboard.userSecurityDesc')}
                  </Typography>
                </CardContent>
                <CardActions sx={{ padding: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/admin/author/managment/reset"
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontWeight: 'bold',
                      letterSpacing: 0.5
                    }}>
                    {t('admin:dashboard.manageCredentials')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}
          {/* Poetry Management card */}
          {user.role === 'superadmin' && (
            <Grid item xs={12} md={6}>
              <Card sx={{
                height: '100%',
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}>
                <CardContent>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: '12px 16px',
                    backgroundColor: 'action.hover',
                    borderRadius: 1
                  }}>
                    <MenuBookIcon sx={{ mr: 2, fontSize: 32, color: 'info.dark' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('admin:dashboard.poemsManagement')}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin:dashboard.poemsManagementDesc')}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/admin/poem/managment/delete"
                    variant="contained"
                    color="info"
                    fullWidth
                    sx={{ py: 1.5, fontWeight: 'bold', letterSpacing: 0.5 }}>
                    {t('admin:dashboard.managePoems')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}
        </Grid>

      </Box>
    </Container>
  );
};

export default AdminDashboard;
