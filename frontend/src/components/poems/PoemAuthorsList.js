import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import poemService from '../../services/poemService';
import { useTranslation } from 'react-i18next';
import { Avatar, Stack } from '@mui/material';

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
  const { t } = useTranslation(['authorsList']);
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState(null);

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
              onClick={() => navigate(`/author/${author._id}`)} 
            >
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {author.authorDetails.penName.charAt(0)}
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
                      {truncateText(author.authorDetails.penName, 12)}
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: 'center', display: 'block' }} 
                  >
                    Poems: {formatNumber(author.poemCount)}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
      <Button variant="contained" color="primary" component={Link} to="/authors" sx={{ mt: 2 }}>
        {t('poems:poem.viewAll')}
      </Button>
    </Box>
  );
};

export default AuthorsList;
