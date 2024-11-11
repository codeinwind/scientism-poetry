import React from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    handleClose();
  };

  const getCurrentLanguageName = () => {
    const language = languages.find(lang => lang.code === currentLanguage);
    return language ? language.nativeName : 'English';
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="change language"
        onClick={handleClick}
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
          }}
        >
          {getCurrentLanguageName()}
        </Typography>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 180,
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={currentLanguage === language.code}
            sx={{
              py: 1,
              px: 2,
            }}
          >
            <ListItemText
              primary={language.nativeName}
              secondary={language.name}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: currentLanguage === language.code ? 'bold' : 'normal',
              }}
              secondaryTypographyProps={{
                variant: 'caption',
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
