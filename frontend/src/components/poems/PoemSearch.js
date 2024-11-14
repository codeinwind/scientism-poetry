import React from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const PoemSearch = ({ value, onChange, onSubmit }) => {
  const { t } = useTranslation(['poems']);

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ mb: 4, display: 'flex', gap: 2 }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder={t('poems:search.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default PoemSearch;
