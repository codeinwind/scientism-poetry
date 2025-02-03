import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import adminService from '../services/adminService';
import VpnKeyIcon from '@mui/icons-material/VpnKey';


const UserSecurityManagement = () => {
    const { t } = useTranslation(['admin', 'common']);
    const [email, setEmail] = useState('');
    const [userData, setUserData] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState({ search: false, action: false });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleAction = async (actionFn, successMessage) => {
        setLoading(prev => ({ ...prev, action: true }));
        try {
            await actionFn();
            setSuccess(t(successMessage));
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(prev => ({ ...prev, action: false }));
        }
    };

    return (
        <Box sx={{ p: 3, width: '50vw', margin: '0 auto' }}>

            {/* Notification */}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    mb: 3,
                    mt: 4,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <VpnKeyIcon sx={{
                    fontSize: '1.5rem',
                    mr: 1.5,
                    mt: 0.2
                }} />
                {t('admin:dashboard.userSecurity')}
            </Typography>

            {/* Search Module */}
            <Paper sx={{ p: 2, mb: 6 }} elevation={2}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={9}>
                        <TextField
                            fullWidth
                            label={t('admin:dashboard.searchByEmail')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading.search}
                            sx={{
                                '& .MuiInputBase-root': {
                                    height: '56px'
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={async () => {
                                setLoading(prev => ({ ...prev, search: true }));
                                try {
                                    const res = await adminService.searchUserByEmail(email);
                                    setUserData(res.data);
                                } catch (err) {
                                    setError(err.message);
                                    setTimeout(() => setError(''), 5000);
                                } finally {
                                    setLoading(prev => ({ ...prev, search: false }));
                                }
                            }}
                            disabled={!email || loading.search}
                            sx={{ height: '56px' }}
                            startIcon={loading.search && <CircularProgress size={20} />}
                        >
                            {t('admin:common.search')}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {userData && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {userData.name} ({userData.email})
                        </Typography>
                        <Typography color="textSecondary" sx={{ mb: 2 }}>
                            {t('admin:dashboard.userStatus')}:{' '}
                            <span style={{ color: userData.isEmailVerified ? 'green' : 'orange' }}>
                                {userData.isEmailVerified ? t('common:verified') : t('common:unverified')}
                            </span>
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={t('admin:dashboard.newPassword')}
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={loading.action}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    size="small"
                                                    sx={{ mr: -1 }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="warning"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleAction(
                                        () => adminService.resetUserPassword(userData._id, newPassword),
                                        'admin:dashboard.passwordResetSuccess'
                                    )}
                                    disabled={!newPassword || loading.action}
                                >
                                    {t('admin:dashboard.resetPassword')}
                                </Button>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleAction(
                                        async () => {
                                            await adminService.verifyUserEmail(userData._id);
                                            setUserData(prev => ({
                                                ...prev,
                                                isEmailVerified: true
                                            }));
                                        },
                                        'admin:dashboard.emailVerifySuccess'
                                    )}
                                    disabled={userData.isEmailVerified || loading.action}
                                >
                                    {userData.isEmailVerified
                                        ? t('admin:dashboard.emailVerified')
                                        : t('admin:dashboard.verifyEmail')}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default UserSecurityManagement;