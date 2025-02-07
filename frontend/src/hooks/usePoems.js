import { useQuery } from 'react-query';
import { poemService } from '../services';
import { useAuth } from '../contexts/AuthContext';

// This component was not found to be in use, and the language was fixed to en
export const usePoems = (language = 'en', page = 1, limit = 10, search = '') => {
  const { isAuthenticated } = useAuth();

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['poems', page, search],
    () => poemService.getAllPoems(page, limit, search, language),
    {
      keepPreviousData: true,
      staleTime: 30000, // Consider data stale after 30 seconds
      refetchInterval: 60000, // Refetch every minute
    }
  );

  const handleLike = async (poemId) => {
    if (!isAuthenticated) {
      throw new Error('Must be logged in to like poems');
    }

    try {
      await poemService.likePoem(poemId);
      refetch();
    } catch (error) {
      throw new Error(error.message || 'Failed to like poem');
    }
  };

  const handleComment = async (poemId, comment) => {
    if (!isAuthenticated) {
      throw new Error('Must be logged in to comment');
    }

    try {
      await poemService.addComment(poemId, comment);
      refetch();
    } catch (error) {
      throw new Error(error.message || 'Failed to add comment');
    }
  };

  return {
    poems: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
    handleLike,
    handleComment,
  };
};
