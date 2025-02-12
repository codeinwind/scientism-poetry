import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    IconButton,
    TextField,
    InputAdornment,
    LinearProgress,
    Alert,
    Box,
    Typography,
    Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import adminService from '../services/adminService';

const SuperAdminManagement = () => {
    const { t } = useTranslation(['admin', 'common']);
    const { user: currentUser } = useAuth();
    const [superAdmins, setSuperAdmins] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailSearch, setEmailSearch] = useState('');
    const [foundUser, setFoundUser] = useState(null);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Obtain the super administrator list
    const loadSuperAdmins = async (page = 1, query = '') => {
        try {
            setLoading(true);
            const { data } = await adminService.getSuperAdmins(page, 10, query);
            setSuperAdmins(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        loadSuperAdmins(newPage, searchQuery);
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        handlePageChange(1);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminService.updateSuperAdmin(userId, newRole);
            loadSuperAdmins(currentPage, searchQuery);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEmailSearch = async () => {
        try {
            const { data } = await adminService.searchUserByEmail(emailSearch);
            setFoundUser(data);
            setError('');
        } catch (err) {
            setError(err.message);
            setFoundUser(null);
        }
    };

    const promoteToSuperAdmin = async () => {
        try {
            await adminService.updateSuperAdmin(foundUser._id, 'superadmin');
            await loadSuperAdmins();
            setEmailSearch('');
            setFoundUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        loadSuperAdmins();
    }, []);

    return (
        <div className="p-6">
            {error && <Alert severity="error">{error}</Alert>}
            {loading && <LinearProgress />}

            {/* Search bar */}
            <Box sx={{
                mb: 4,
                p: 3,
                border: '1px solid #eee',
                borderRadius: 2,
                bgcolor: 'background.paper'
            }}>
                <Typography variant="h6" gutterBottom>
                    {t('admin:roles.superadmin.searchTitle')}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={t('admin:roles.superadmin.emailPlaceholder')}
                        value={emailSearch}
                        onChange={(e) => setEmailSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />

                    <Button
                        variant="contained"
                        onClick={handleEmailSearch}
                        sx={{
                            px: 4,
                            flexShrink: 0
                        }}
                    >
                        {t('admin:roles.superadmin.searchButton')}
                    </Button>
                </Box>

                {/* Search results display */}
                {foundUser && (
                    <Box sx={{
                        mt: 2,
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        bgcolor: 'background.default'
                    }}>
                        <Typography variant="subtitle1">
                            {foundUser.name} ({foundUser.email})
                        </Typography>
                        <Button
                            sx={{ mt: 1 }}
                            variant="contained"
                            color="primary"
                            onClick={promoteToSuperAdmin}
                            disabled={foundUser.role === 'superadmin'}
                        >
                            {foundUser.role === 'superadmin'
                                ? t('admin:roles.superadmin.alreadyAdmin')
                                : t('admin:roles.superadmin.promoteButton')}
                        </Button>
                    </Box>
                )}
            </Box>


            {/* Super Administrator List */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('admin:users.name')}</TableCell>
                            <TableCell>{t('admin:users.email')}</TableCell>
                            <TableCell>{t('admin:users.role')}</TableCell>
                            <TableCell>{t('admin:authorApplications.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {superAdmins.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        disabled={user._id === currentUser.id}
                                    >
                                        <MenuItem value="superadmin">{t('admin:roles.superadmin.title')}</MenuItem>
                                        <MenuItem value="admin">{t('admin:roles.admin.title')}</MenuItem>
                                        <MenuItem value="moderator">{t('admin:roles.moderator.title')}</MenuItem>
                                        <MenuItem value="user">{t('admin:roles.user.title')}</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    {user._id !== currentUser.id && (
                                        <IconButton
                                            onClick={() => handleRoleChange(user._id, 'user')}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default SuperAdminManagement;