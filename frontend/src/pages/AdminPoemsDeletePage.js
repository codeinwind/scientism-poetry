// Used to delete posts in bulk or at a point(Superadmin only)
import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    TextField,
    Button,
    CircularProgress,
    IconButton,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import adminService from '../services/adminService';
import { useNavigate } from 'react-router-dom';

const AdminPoemsDeletePage = () => {
    const { t } = useTranslation(['admin', 'common']);
    const [poems, setPoems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedPoems, setSelectedPoems] = useState([]);
    const navigate = useNavigate();

    const limit = 10;
    const loaderRef = useRef(null);
    const fetchPoems = async (pageToFetch) => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminService.getPublishedPoems(search, pageToFetch, limit);
            if (response.success) {
                const newPoems = response.data;
                setPoems(prev => pageToFetch === 1 ? newPoems : [...prev, ...newPoems]);
                const { page: currentPage, pages } = response.pagination;
                setHasMore(currentPage < pages);
                setPage(currentPage + 1);
            }
        } catch (err) {
            setError(err.message || t('admin:errors.loadFailed'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
          const timer = setTimeout(() => {
            setError(null);
          }, 3000);
          return () => clearTimeout(timer);
        }
      }, [error]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    fetchPoems(page);
                }
            },
            { threshold: 1.0 }
        );
        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [hasMore, loading, page]);

    // Delete a single poem
    const handleDelete = async (poemId) => {
        if (window.confirm(t('admin:poemsManagement.confirmDelete'))) {
            try {
                await adminService.deletePoem(poemId);
                setPoems(poems.filter(p => p._id !== poemId));
            } catch (err) {
                setError(err.message || t('admin:errors.actionFailed'));
            }
        }
    };

    // Batch select/cancel
    const handleSelectPoem = (poemId) => {
        if (selectedPoems.includes(poemId)) {
            setSelectedPoems(selectedPoems.filter(id => id !== poemId));
        } else {
            setSelectedPoems([...selectedPoems, poemId]);
        }
    };

    // Batch delete operation
    const handleDeleteSelected = async () => {
        if (window.confirm(t('admin:poemsManagement.confirmDeleteSelected'))) {
            try {
                await Promise.all(selectedPoems.map(id => adminService.deletePoem(id)));
                setPoems(poems.filter(p => !selectedPoems.includes(p._id)));
                setSelectedPoems([]);
            } catch (err) {
                setError(err.message || t('admin:errors.actionFailed'));
            }
        }
    };

    // Search box correlation
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPoems([]);
        setPage(1);
        setHasMore(true);
        fetchPoems(1);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('admin:poemsManagement.pageTitle')}
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Search area */}
                <Box
                    component="form"
                    onSubmit={handleSearchSubmit}
                    sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                >
                    <TextField
                        label={t('admin:poemsManagement.searchPlaceholder')}
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={handleSearchChange}
                        sx={{ mr: 2, flex: 1 }}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        {t('admin:poemsManagement.searchButton')}
                    </Button>
                </Box>

                {/* Batch delete button */}
                {selectedPoems.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Button variant="contained" color="error" onClick={handleDeleteSelected}>
                            {t('admin:poemsManagement.deleteSelected')}
                        </Button>
                    </Box>
                )}

                {/* List of poems */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('admin:poemsManagement.tableHeaders.select')}</TableCell>
                                <TableCell>{t('admin:poemsManagement.tableHeaders.title')}</TableCell>
                                <TableCell>{t('admin:poemsManagement.tableHeaders.author')}</TableCell>
                                <TableCell>{t('admin:poemsManagement.tableHeaders.createdAt')}</TableCell>
                                <TableCell>{t('admin:poemsManagement.tableHeaders.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {poems.map((poem) => (
                                <TableRow
                                    key={poem._id}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s',
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}
                                    onClick={() => navigate(`/poems/${poem._id}`)}
                                >
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selectedPoems.includes(poem._id)}
                                            onChange={() => handleSelectPoem(poem._id)}
                                            // Prevent events from bubbling and avoid touch release clicks
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </TableCell>
                                    <TableCell>{poem.title}</TableCell>
                                    <TableCell>{poem.author?.name}</TableCell>
                                    <TableCell>
                                        {new Date(poem.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(poem._id);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress />
                    </Box>
                )}
                <div ref={loaderRef} />
            </Box>
        </Container>
    );
};

export default AdminPoemsDeletePage;
