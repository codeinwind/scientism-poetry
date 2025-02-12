import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { Create as CreateIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

// Custom hooks
import { usePoemManagement } from '../hooks/usePoemManagement';
import { useDialogManagement } from '../hooks/useDialogManagement';

// Components
import DashboardHeader from '../components/dashboard/DashboardHeader';
import PoemTabs from '../components/dashboard/PoemTabs';
import PoemGrid from '../components/dashboard/PoemGrid';
import PoemDialog from '../components/poems/PoemDialog';
import DeleteConfirmDialog from '../components/poems/DeleteConfirmDialog';
import FeedbackSnackbar from '../components/shared/FeedbackSnackbar';
import EmptyState from '../components/shared/EmptyState';
import {
  LoadingState,
  ErrorState,
  UnauthorizedState,
} from '../components/dashboard/DashboardStates';

// Status mapping for tabs - ensure exact match with backend enum values
const TAB_STATUS = {
  0: null,          // All poems
  1: 'published',   // Published poems
  2: 'under_review', // Under review poems
  3: 'draft'        // Draft poems
};

const Dashboard = () => {
  const { t } = useTranslation(['dashboard']);
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

  // Custom hooks
  const {
    poemsData,
    isLoading,
    error,
    refetch,
    createPoemMutation,
    editPoemMutation,
    deletePoemMutation,
    getFilteredPoems,
    getTabCounts,
  } = usePoemManagement(user?.id);

  const {
    openDialog,
    selectedPoem,
    deleteConfirmOpen,
    poemToDelete,
    snackbar,
    handleCreateNew,
    handleEdit,
    handleDelete,
    handleCloseDialog,
    handleCloseDeleteConfirm,
    handleCloseSnackbar,
    handleSuccess,
    handleError,
  } = useDialogManagement();

  // Get filtered poems based on current tab
  const currentStatus = TAB_STATUS[tab];
  const filteredPoems = poemsData?.poems ? getFilteredPoems(poemsData.poems, currentStatus) : [];
  const tabCounts = poemsData?.poems ? getTabCounts(poemsData.poems) : { all: 0, published: 0, underReview: 0, drafts: 0 };

  // Debug logs for current status
  useEffect(() => {
    console.log('Current status based on tab:', currentStatus); // Debug log
  }, [tab]);

  // Debug logs for translations
  useEffect(() => {
    console.log('Translations for empty state:', {
      title: t('dashboard:emptyState.title'),
      description: t('dashboard:emptyState.description'),
      button: t('dashboard:emptyState.button'),
    });
  }, [t]);

  // Debug logs
  useEffect(() => {
    console.log('Current state:', {
      tab,
      status: currentStatus,
      allPoems: poemsData?.poems,
      filteredPoems,
      tabCounts
    });
  }, [tab, poemsData?.poems, filteredPoems, tabCounts, currentStatus]);

  // Event Handlers
  const handleTabChange = (event, newValue) => {
    console.log('Tab changed to:', newValue, 'status:', TAB_STATUS[newValue]); // Debug log
    setTab(newValue);
  };

  const handleSubmitPoem = async (poemData) => {
    try {
      if (selectedPoem) {
        await editPoemMutation.mutateAsync({ id: selectedPoem._id, ...poemData });
        handleSuccess(poemData.status === 'draft' ? 'savedAsDraft' : 'submittedForReview');
      } else {
        await createPoemMutation.mutateAsync(poemData);
        handleSuccess(poemData.status === 'draft' ? 'savedAsDraft' : 'submittedForReview');
      }
      handleCloseDialog();
    } catch (error) {
      handleError(error, selectedPoem ? 'update' : 'create');
    }
  };

  const handleConfirmDelete = async () => {
    if (!poemToDelete) return;
    
    try {
      await deletePoemMutation.mutateAsync(poemToDelete._id);
      handleSuccess('deleted');
      handleCloseDeleteConfirm();
    } catch (error) {
      handleError(error, 'delete');
    }
  };

  // Render conditions
  if (!user) return <UnauthorizedState />;
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const hasPoems = poemsData?.poems && poemsData.poems.length > 0;


  return (
    <Container maxWidth="lg">
      <DashboardHeader
        userName={user.penName}
        title={t('dashboard:title')} // Add title translation
        onCreateNew={handleCreateNew}
      />

      {hasPoems ? (
        <>
          <PoemTabs
            currentTab={tab}
            onTabChange={handleTabChange}
            tabCounts={tabCounts}
          />

          <PoemGrid
            poems={filteredPoems}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      ) : (
        <EmptyState
          icon={CreateIcon}
          title={t('dashboard:emptyState.title')}
          description={t('dashboard:emptyState.description')}
          actionLabel={t('dashboard:emptyState.button')}
          onAction={handleCreateNew}
        />
      )}

      {/* Dialogs */}
      <PoemDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitPoem}
        selectedPoem={selectedPoem}
        isSubmitting={createPoemMutation.isLoading || editPoemMutation.isLoading}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
        poemTitle={poemToDelete?.title}
        isDeleting={deletePoemMutation.isLoading}
      />

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

export default Dashboard;
