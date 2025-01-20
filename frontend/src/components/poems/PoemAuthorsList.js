import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Button, Avatar, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import poemService from '../../services/poemService';

const formatNumber = (num) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`; // Convert to a compact format, such as 12.3k
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
  const { t } = useTranslation(['authorsList']);

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
      <Typography variant="h6" gutterBottom>
      {t('poems:poem.top')}
      </Typography>
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
                  backgroundColor: '#f5f5f5', 
                },
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
                        textOverflow: 'ellipsis',
                      }}
                    >
                    {truncateText(author.authorDetails?.name || 'Unknown', 17)}
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: 'center', display: 'block' }} 
                  >
                  Poems: {formatNumber(author.poemCount || 0)}
                  </Typography>
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
    </Box>
  );
};

export default AuthorsList;
