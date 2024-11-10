import { useQuery, useMutation, useQueryClient } from 'react-query';
import { poemService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const usePoems = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get all poems with pagination and search
  const useGetPoems = (page = 1, limit = 10, search = '') => {
    return useQuery(
      ['poems', page, limit, search],
      () => poemService.getAllPoems(page, limit, search),
      {
        keepPreviousData: true,
      }
    );
  };

  // Get user's poems
  const useGetUserPoems = () => {
    return useQuery(
      ['userPoems', user?.id],
      () => poemService.getUserPoems(user?.id),
      {
        enabled: !!user,
      }
    );
  };

  // Get single poem
  const useGetPoemById = (id) => {
    return useQuery(['poem', id], () => poemService.getPoemById(id), {
      enabled: !!id,
    });
  };

  // Create poem mutation
  const useCreatePoem = () => {
    return useMutation(poemService.createPoem, {
      onSuccess: () => {
        // Invalidate and refetch poems queries
        queryClient.invalidateQueries('poems');
        queryClient.invalidateQueries('userPoems');
      },
    });
  };

  // Update poem mutation
  const useUpdatePoem = () => {
    return useMutation(
      ({ id, data }) => poemService.updatePoem(id, data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries('poems');
          queryClient.invalidateQueries('userPoems');
        },
      }
    );
  };

  // Delete poem mutation
  const useDeletePoem = () => {
    return useMutation(poemService.deletePoem, {
      onSuccess: () => {
        queryClient.invalidateQueries('poems');
        queryClient.invalidateQueries('userPoems');
      },
    });
  };

  // Like poem mutation
  const useLikePoem = () => {
    return useMutation(poemService.likePoem, {
      onSuccess: () => {
        queryClient.invalidateQueries('poems');
        queryClient.invalidateQueries('userPoems');
      },
    });
  };

  // Add comment mutation
  const useAddComment = () => {
    return useMutation(
      ({ id, comment }) => poemService.addComment(id, comment),
      {
        onSuccess: () => {
          queryClient.invalidateQueries('poems');
          queryClient.invalidateQueries('userPoems');
        },
      }
    );
  };

  // Helper function to format poem data
  const formatPoemData = (data) => {
    return {
      title: data.title.trim(),
      content: data.content.trim(),
      tags: data.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      status: data.status || 'draft',
    };
  };

  return {
    useGetPoems,
    useGetUserPoems,
    useGetPoemById,
    useCreatePoem,
    useUpdatePoem,
    useDeletePoem,
    useLikePoem,
    useAddComment,
    formatPoemData,
  };
};

// Custom hook for managing poem filters and pagination
export const usePoemFilters = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = React.useState(initialPage);
  const [limit, setLimit] = React.useState(initialLimit);
  const [search, setSearch] = React.useState('');
  const [filters, setFilters] = React.useState({
    status: 'all',
    sortBy: 'newest',
  });

  const resetFilters = () => {
    setPage(initialPage);
    setSearch('');
    setFilters({
      status: 'all',
      sortBy: 'newest',
    });
  };

  return {
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    filters,
    setFilters,
    resetFilters,
  };
};

export default usePoems;
