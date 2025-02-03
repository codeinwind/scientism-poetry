import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import adminService from '../services/adminService';

const AuthorReviewPage = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApplications(page);
  }, [page]);

  const fetchApplications = async (page) => {
    setLoading(true);
    try {
      const response = await adminService.getAuthorApplications(page);
      setApplications(response.data);
      setTotalPages(response.pagination);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (applicationId, action) => {
    try {
      const response = await adminService.reviewAuthorApplication(applicationId, action);
      setApplications(applications.filter((app) => app._id !== applicationId));
      alert(response.message);
    } catch (error) {
      console.error('Review action failed:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        {t('admin:authorApplications.title')}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('admin:authorApplications.name')}</TableCell>
                  <TableCell>{t('admin:authorApplications.statement')}</TableCell>
                  <TableCell>{t('admin:authorApplications.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>{app.user.name}</TableCell>
                    <TableCell>{app.content.statement}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleReview(app._id, 'approved')}
                        sx={{ mr: 1 }}
                      >
                        {t('admin:authorApplications.approve')}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleReview(app._id, 'rejected')}
                      >
                        {t('admin:authorApplications.reject')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            sx={{ mt: 2 }}
          />
        </>
      )}
    </Container>
  );
};

export default AuthorReviewPage;
