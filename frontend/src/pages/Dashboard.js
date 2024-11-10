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
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPoem, setSelectedPoem] = useState(null);

  // Fetch user's poems
  const { data: poems, isLoading, error } = useQuery(['userPoems', user.id], async () => {
    const response = await fetch(`http://localhost:5000/api/poems/user/${user.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch poems');
    }
    return response.json();
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleCreateNew = () => {
    setSelectedPoem(null);
    setOpenDialog(true);
  };

  const handleEdit = (poem) => {
    setSelectedPoem(poem);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPoem(null);
  };

  const getFilteredPoems = () => {
    if (!poems?.data) return [];
    switch (tab) {
      case 0: // All
        return poems.data;
      case 1: // Published
        return poems.data.filter(poem => poem.status === 'published');
      case 2: // Under Review
        return poems.data.filter(poem => poem.status === 'under_review');
      case 3: // Drafts
        return poems.data.filter(poem => poem.status === 'draft');
      default:
        return poems.data;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Error loading your poems. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user.name}
        </Typography>
      </Box>

      {/* Action Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
        >
          Create New Poem
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="All Poems" />
          <Tab label="Published" />
          <Tab label="Under Review" />
          <Tab label="Drafts" />
        </Tabs>
      </Box>

      {/* Poems Grid */}
      <Grid container spacing={4}>
        {getFilteredPoems().map((poem) => (
          <Grid item xs={12} md={6} key={poem._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5">{poem.title}</Typography>
                  <Chip
                    label={poem.status}
                    color={
                      poem.status === 'published'
                        ? 'success'
                        : poem.status === 'under_review'
                        ? 'warning'
                        : 'default'
                    }
                    size="small"
                  />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-line',
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {poem.content}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  {poem.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {new Date(poem.updatedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(poem)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPoem ? 'Edit Poem' : 'Create New Poem'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              defaultValue={selectedPoem?.title}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={6}
              defaultValue={selectedPoem?.content}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Tags (comma separated)"
              defaultValue={selectedPoem?.tags.join(', ')}
              margin="normal"
              helperText="Enter tags separated by commas (e.g., quantum, physics, space)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseDialog}
          >
            {selectedPoem ? 'Save Changes' : 'Create Poem'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
