import { useTranslation } from 'react-i18next';
import React, { useEffect, useState, Fragment } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Avatar,
  Stack,
  Popover,
  IconButton
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate } from 'react-router-dom';
import poemService from '../../services/poemService';

const formatNumber = (num) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const AuthorsList = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['poems', 'authorsList']);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClickHelp = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseHelp = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await poemService.getTopAuthors();
        setAuthors(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchAuthors();
  }, []);

  if (error) {
    return (
      <Box>
        <Typography color="error" variant="body2">
          Failed to load authors: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            marginBottom: 0,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {t('poems:poem.top')}
        </Typography>

        <IconButton
          onClick={handleClickHelp}
          aria-label="help"
          sx={{
            padding: '8px',
            transform: 'translateY(1px)'
          }}
        >
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* List of authors if available */}
      {authors.length > 0 && (
        <List sx={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', padding: 0 }}>
          {authors.map((author) => (
            <ListItem
              key={author._id}
              sx={{
                width: 'auto',
                padding: '0 16px',
                cursor: 'pointer',
                borderRadius: 4,
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
              onClick={() => author._id && navigate(`/author/${author._id}`)}
            >
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {author.authorDetails?.name?.charAt(0) || 'N/A'}
                    </Avatar>
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        fontWeight: 'bold',
                        maxWidth: '100px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {truncateText(author.authorDetails?.name || 'Unknown', 17)}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => navigate('/authors/total')}
      >
        {t('poems:poem.viewAll')}
      </Button>

      {/* Popover content */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseHelp}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box sx={{ p: 2, maxWidth: '250px' }}>
          <Typography variant="subtitle1" gutterBottom>
            {t('poems:helpSection.becomeFeaturedAuthor.title')}
          </Typography>
          <Typography variant="body2" paragraph>
            {t('poems:helpSection.becomeFeaturedAuthor.steps')
              .split('\n')
              .map((line, index, arr) => (
                <Fragment key={index}>
                  {line}
                  {index < arr.length - 1 && <br />} 
                </Fragment>
              ))}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              navigate('/profile');
              handleCloseHelp();
            }}
          >
            {t('poems:helpSection.becomeFeaturedAuthor.button')}
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};

export default AuthorsList;
