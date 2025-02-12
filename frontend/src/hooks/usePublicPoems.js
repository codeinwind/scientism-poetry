import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { poemService } from '../services';
import { useDebounce } from './useDebounce';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const usePublicPoems = () => {
  const { t, i18n } = useTranslation(['poems']);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const { user } = useAuth();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const debouncedSearch = useDebounce(search, 500);

  const currentLanguage = i18n.language.split('-')[0] || 'en';
  // Fetch poems query
  const { data, isLoading, error } = useQuery(
    ['poems', page, debouncedSearch, currentLanguage],
    () => poemService.getAllPoems(page, 10, debouncedSearch, currentLanguage),
    {
      keepPreviousData: true,
      staleTime: 30000,
      refetchInterval: 60000,
    }
  );

  useEffect(() => {
    setPage(1);
  }, [currentLanguage]);

  // Event handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  // const handleLike = async (poemId) => {
  //   try {
  //     const response = await poemService.likePoem(poemId);

  //     // Update the poems cache with the new like status
  //     queryClient.setQueryData(['poems', page, debouncedSearch, currentLanguage], (oldData) => {
  //       if (!oldData) return oldData;

  //       return {
  //         ...oldData,
  //         data: oldData.data.map((poem) =>
  //           poem._id === poemId ? { ...poem, likes: response.data.likes } : poem
  //         ),
  //       };
  //     });

  //     showSnackbar(t('poems:actions.like.success'), 'success');
  //   } catch (error) {
  //     showSnackbar(error.message || t('poems:actions.like.error'), 'error');
  //   }
  // };

  const handleLike = async (poemId) => {
    let previousPoems;
    const queryKey = ['poems', page, debouncedSearch, currentLanguage];
    try {
      previousPoems = queryClient.getQueryData(queryKey);
      const wasLiked = previousPoems?.data?.find(p => p._id === poemId)?.likes?.includes(user._id); 

      queryClient.setQueryData(['poems', page, debouncedSearch, currentLanguage], (old) => ({
        ...old,
        data: old.data.map(poem =>
          poem._id === poemId
            ? {
              ...poem,
              likes: wasLiked
                ? poem.likes.filter(id => id !== user._id) 
                : [...poem.likes, user._id] 
            }
            : poem
        )
      }));

      const response = await poemService.likePoem(poemId);
      const isActuallyLiked = response.data.likes.includes(user._id); 
      const messageKey = isActuallyLiked ? 'like.success' : 'like.removed'; 
      showSnackbar(t(`poems:actions.${messageKey}`), 'success'); 

    } catch (error) {
      queryClient.setQueryData(['poems', page, debouncedSearch, currentLanguage], previousPoems);
      showSnackbar(error.message || t('poems:actions.like.error'), 'error');
    }
  };

  const handleTagClick = (tag) => {
    setSearchInput(tag);
    setSearch(tag);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return {
    // Data
    poems: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    search,
    searchInput,
    snackbar,
    page,

    // Handlers
    handleSearch,
    handlePageChange,
    handleLike,
    handleTagClick,
    handleClearSearch,
    setSearchInput,
    handleCloseSnackbar,
  };
};
