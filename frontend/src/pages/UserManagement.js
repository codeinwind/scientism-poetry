import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { adminService } from '../services';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const UserManagement = () => {
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

        const statsResponse = await adminService.getStats();
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (user.role === 'superadmin') {
          const usersResponse = await adminService.getUsers();
          if (usersResponse.success) {
            setUsers(usersResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || t('admin:errors.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t, user.role]);

  const handleRoleUpdate = async (userId, newRole) => {
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
      console.error('Error updating role:', error);
      setError(error.message || t('admin:errors.actionFailed'));
    }
  };

  if (loading) return <Typography>{t('common:loading')}</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('admin:dashboard.userManagement')}
        </Typography>

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

        {/* Users Table */}
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

export default UserManagement;