import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { poemService } from '../services';

// Status mapping for tabs - ensure exact match with backend enum values
const STATUS_MAP = {
  published: 'published',
  under_review: 'under_review',
  draft: 'draft'
};

export const usePoemManagement = (userId) => {
  const { t } = useTranslation(['dashboard']);
  const queryClient = useQueryClient();

  // Queries
  const {
    data: poemsData,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['userPoems', userId],
    async () => {
      try {
        const response = await poemService.getUserPoems(userId);

        // Ensure all poems have valid status
        const poems = response.poems?.map(poem => ({
          ...poem,
          status: STATUS_MAP[poem.status] || 'under_review'
        })) || [];

        return {
          poems,
          count: poems.length
        };
      } catch (err) {
        console.error('Error fetching poems:', err); // Debug log
        if (err.response?.status === 404) {
          return { poems: [], count: 0 };
        }
        throw new Error(t('dashboard:errors.loadPoems'));
      }
    },
    {
      enabled: !!userId,
      staleTime: 30000,
      refetchInterval: 60000,
      retry: 3,
    }
  );

  // Mutations
  const createPoemMutation = useMutation(
    (poemData) => poemService.createPoem(poemData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userPoems', userId]);
        queryClient.invalidateQueries('poems');
      },
    }
  );

  const editPoemMutation = useMutation(
    ({ id, ...poemData }) => poemService.updatePoem(id, poemData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userPoems', userId]);
        queryClient.invalidateQueries('poems');
      },
    }
  );

  const deletePoemMutation = useMutation(
    (id) => poemService.deletePoem(id),
    {
      onMutate: async (deletedId) => {
        await queryClient.cancelQueries(['userPoems', userId]);
        await queryClient.cancelQueries('poems');

        const previousUserPoems = queryClient.getQueryData(['userPoems', userId]);
        const previousPoems = queryClient.getQueryData('poems');

        queryClient.setQueryData(['userPoems', userId], old => ({
          poems: old.poems.filter(poem => poem._id !== deletedId),
          count: (old.count || 0) - 1
        }));

        if (previousPoems) {
          queryClient.setQueryData('poems', old => ({
            ...old,
            data: old.data.filter(poem => poem._id !== deletedId),
          }));
        }

        return { previousUserPoems, previousPoems };
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(['userPoems', userId], context.previousUserPoems);
        if (context.previousPoems) {
          queryClient.setQueryData('poems', context.previousPoems);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(['userPoems', userId]);
        queryClient.invalidateQueries('poems');
      },
    }
  );

  // Filter poems by status
  const getFilteredPoems = (poems = [], status = null) => {
    console.log('Filtering poems with status:', status); // Debug log
    console.log('Available poems:', poems); // Debug log

    if (!poems.length) {
      console.log('No poems available to filter'); // Debug log
      return [];
    }

    if (!status) {
      console.log('No status filter, returning all poems'); // Debug log
      return poems;
    }

    const filtered = poems.filter(poem => {
      const match = poem.status === status;
      console.log(`Poem ${poem._id} status: ${poem.status}, matches ${status}: ${match}`); // Debug log
      return match;
    });

    console.log('Filtered result:', filtered); // Debug log
    return filtered;
  };

  // Get tab counts
  const getTabCounts = (poems = []) => {
    console.log('Calculating tab counts for poems:', poems); // Debug log
    const counts = {
      all: poems.length,
      published: poems.filter(poem => poem.status === STATUS_MAP.published).length,
      underReview: poems.filter(poem => poem.status === STATUS_MAP.under_review).length,
      drafts: poems.filter(poem => poem.status === STATUS_MAP.draft).length,
    };
    console.log('Tab counts:', counts); // Debug log
    return counts;
  };

  // Debug log current state
  console.log('Current poems data:', {
    totalPoems: poemsData?.poems?.length || 0,
    loading: isLoading,
    error: error?.message,
  });

  return {
    poemsData,
    isLoading,
    error,
    refetch,
    createPoemMutation,
    editPoemMutation,
    deletePoemMutation,
    getFilteredPoems,
    getTabCounts,
  };
};
