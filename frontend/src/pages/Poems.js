import React, { useEffect } from 'react'; 
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

// Custom hooks
import { usePublicPoems } from '../hooks/usePublicPoems';

// Components
import { LoadingState, ErrorState } from '../components/dashboard/DashboardStates';
import PoemSearch from '../components/poems/PoemSearch';
import PublicPoemCard from '../components/poems/PublicPoemCard';
import PoemCTA from '../components/poems/PoemCTA';
import FeedbackSnackbar from '../components/shared/FeedbackSnackbar';
import EmptyState from '../components/shared/EmptyState';
import AuthorsList from '../components/poems/PoemAuthorsList';

const Poems = () => {
  const { t, i18n } = useTranslation(['poems']);
  const { isAuthenticated, user } = useAuth();

  const {
    poems,
    pagination,
    isLoading,
    error,
    search,
    searchInput,
    snackbar,
    page,
    handleSearch,
    handlePageChange,
    handleLike,
    handleTagClick,
    handleClearSearch,
    setSearchInput,
    handleCloseSnackbar,
  } = usePublicPoems();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [i18n.language]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const hasPoems = poems && poems.length > 0;

  return (
    <Container maxWidth="lg">
      {/* Header Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t('poems:title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {t('poems:subtitle')}
        </Typography>
      </Box>

      {/* Search Section */}
      <PoemSearch
        value={searchInput}
        onChange={setSearchInput}
        onSubmit={handleSearch}
      />

      {/* Top10 authors Section */}
      <AuthorsList />

      {hasPoems ? (
        <>
          {/* Poems Grid */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {poems.map((poem) => (
              <Grid item xs={12} md={6} key={poem._id}>
                <PublicPoemCard
                  poem={poem}
                  onLike={handleLike}
                  onTagClick={handleTagClick}
                  isAuthenticated={isAuthenticated}
                  isLiked={poem.likes?.includes(user?.id)}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Pagination
                count={pagination.pages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <EmptyState
          title={search ? t('poems:emptyState.searchTitle') : t('poems:emptyState.title')}
          description={
            search
              ? t('poems:emptyState.searchDescription', { search })
              : t('poems:emptyState.description')
          }
          actionLabel={search ? t('poems:emptyState.clearSearch') : null}
          onAction={search ? handleClearSearch : null}
        />
      )}

      {/* Call to Action for Non-authenticated Users */}
      {!isAuthenticated && <PoemCTA />}

      {/* Feedback */}
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
};

export default Poems;
