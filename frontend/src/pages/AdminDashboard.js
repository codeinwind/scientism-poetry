import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Card,
  CardContent,
  CardActions,
  Tooltip,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { adminService } from '../services';

const AdminDashboard = () => {
  const { t } = useTranslation(['admin', 'common']);
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    moderators: 0,
    regularUsers: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Only fetch stats initially
        const statsResponse = await adminService.getStats();
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        // Only fetch users if superadmin
        if (user.role === 'superadmin') {
          const usersResponse = await adminService.getUsers();
          if (usersResponse.success) {
            setUsers(usersResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError(error.message || t('admin:errors.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t, user.role]);

  const handleRoleUpdate = async (userId, newRole) => {
    if (user.role !== 'superadmin') return;

    try {
      const response = await adminService.updateUserRole(userId, newRole);
      if (response.success) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ));

        const statsResponse = await adminService.getStats();
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      setError(error.message || t('admin:errors.actionFailed'));
    }
  };

  if (loading) return <Typography>{t('common:loading')}</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('admin:dashboard.title')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {user.role === 'superadmin' && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SupervisorAccountIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      {t('admin:dashboard.userManagement')}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin:dashboard.userManagementDesc')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          <Grid item xs={12} md={user.role === 'superadmin' ? 6 : 12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RateReviewIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {t('admin:moderation.title')}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('admin:moderation.description')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to="/admin/moderation"
                  variant="contained"
                  color="secondary"
                >
                  {t('admin:moderation.actions.viewDetails')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{t('admin:dashboard.stats.totalUsers')}</Typography>
              <Typography variant="h4">{stats.users}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{t('admin:dashboard.stats.admins')}</Typography>
              <Typography variant="h4">{stats.admins}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{t('admin:dashboard.stats.moderators')}</Typography>
              <Typography variant="h4">{stats.moderators}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{t('admin:dashboard.stats.regularUsers')}</Typography>
              <Typography variant="h4">{stats.regularUsers}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Users Table (only for superadmin) */}
        {user.role === 'superadmin' && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('admin:users.name')}</TableCell>
                  <TableCell>{t('admin:users.email')}</TableCell>
                  <TableCell>{t('admin:users.role')}</TableCell>
                  <TableCell>{t('admin:users.actionsHeader')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((userItem) => (
                  <TableRow key={userItem._id}>
                    <TableCell>{userItem.name}</TableCell>
                    <TableCell>{userItem.email}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {userItem.role}
                        <Tooltip title={t(`admin:roles.${userItem.role}.description`)}>
                          <IconButton size="small">
                            <HelpOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {userItem.role !== 'superadmin' && userItem._id !== user?._id && (
                        <Box>
                          {userItem.role !== 'admin' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => handleRoleUpdate(userItem._id, 'admin')}
                              sx={{ mr: 1 }}
                            >
                              {t('admin:users.actionButtons.makeAdmin')}
                            </Button>
                          )}
                          {userItem.role !== 'moderator' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              onClick={() => handleRoleUpdate(userItem._id, 'moderator')}
                              sx={{ mr: 1 }}
                            >
                              {t('admin:users.actionButtons.makeModerator')}
                            </Button>
                          )}
                          {userItem.role !== 'user' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleRoleUpdate(userItem._id, 'user')}
                            >
                              {t('admin:users.actionButtons.removePrivileges')}
                            </Button>
                          )}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default AdminDashboard;
