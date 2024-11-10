import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Chip,
  Pagination,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Poems = () => {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Fetch poems from the API
  const { data, isLoading, error } = useQuery(
    ['poems', page, search],
    async () => {
      const response = await fetch(
        `http://localhost:5000/api/poems?page=${page}&search=${search}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch poems');
      }
      return response.json();
    }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading poems. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Member Poems
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Explore our collection of scientism poetry
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ mb: 4, display: 'flex', gap: 2 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search poems..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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

      {/* Poems Grid */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {data?.data.map((poem) => (
          <Grid item xs={12} md={6} key={poem._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {poem.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  By {poem.author.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-line',
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {poem.content}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {poem.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Box>
                  <IconButton size="small" color="primary">
                    <FavoriteIcon />
                  </IconButton>
                  <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                    {poem.likes?.length || 0}
                  </Typography>
                  <IconButton size="small" sx={{ ml: 2 }}>
                    <CommentIcon />
                  </IconButton>
                  <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                    {poem.comments?.length || 0}
                  </Typography>
                </Box>
                <Button size="small" color="primary">
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {data?.pagination && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Pagination
            count={data.pagination.pages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Call to Action for Non-authenticated Users */}
      {!isAuthenticated && (
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            mt: 4,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Want to Share Your Own Poems?
          </Typography>
          <Typography variant="body1" paragraph>
            Join our community to publish your scientism poetry and engage with
            other poets.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            href="/register"
          >
            Join Now
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Poems;
