import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          textAlign: 'center',
          py: 8,
          px: 4,
          mt: 8,
          borderRadius: 2,
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 100,
            color: 'primary.main',
            mb: 2,
          }}
        />
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          The page you're looking for seems to have quantum tunneled to another dimension.
          Don't worry, we can help you find your way back!
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            startIcon={<HomeIcon />}
          >
            Return Home
          </Button>
          <Button
            component={RouterLink}
            to="/poems"
            variant="outlined"
            startIcon={<MenuBookIcon />}
          >
            Browse Poems
          </Button>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="body2" color="text.secondary">
            If you believe this is a mistake, please{' '}
            <RouterLink to="/contact" style={{ color: 'inherit' }}>
              contact us
            </RouterLink>
            .
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;
