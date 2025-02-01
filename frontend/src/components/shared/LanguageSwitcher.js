import React from 'react';
import {
  IconButton,
  Typography,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    changeLanguage(newLanguage);
  };

  const getOppositeLanguageName = () => {
    const oppositeLangCode = currentLanguage === 'en' ? 'zh' : 'en';
    const language = languages.find(lang => lang.code === oppositeLangCode);
    return language?.nativeName || (oppositeLangCode === 'en' ? 'English' : '中文');
  };

  return (
    <IconButton
      color="inherit"
      aria-label="change language"
      onClick={toggleLanguage}
      sx={{
        borderRadius: 1,
        padding: '4px 8px',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <LanguageIcon sx={{ mr: 0.5 }} />
      <Typography
        variant="body2"
        component="span"
        sx={{
          display: { xs: 'none', sm: 'inline' },
          textTransform: 'none',
          color: 'inherit',
        }}
      >
        {getOppositeLanguageName()}
      </Typography>
    </IconButton>
  );
};

export default LanguageSwitcher;