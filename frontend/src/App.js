import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';

// i18n
import './i18n/i18n';

// Theme and Providers
import theme from './utils/theme';
import { AuthProvider } from './contexts/AuthContext';
import { AlertMessageProvider } from './components/shared/AlertMessage';
import { LanguageProvider } from './contexts/LanguageContext';

// Layout and Global Components
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/shared/ErrorBoundary';
import ScrollToTop from './components/shared/ScrollToTop';
import PrivateRoute from './components/auth/PrivateRoute';
import LoadingSpinner from './components/shared/LoadingSpinner';
import TitleUpdater from './components/shared/TitleUpdater';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Book from './pages/Book';
import Poems from './pages/Poems';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary>
            <AuthProvider>
              <LanguageProvider>
                <AlertMessageProvider>
                  <Router>
                    <TitleUpdater />
                    <ScrollToTop />
                    <Routes>
                      {/* Public Routes */}
                      <Route
                        path="/"
                        element={
                          <Layout>
                            <Home />
                          </Layout>
                        }
                      />
                      <Route
                        path="/about"
                        element={
                          <Layout>
                            <About />
                          </Layout>
                        }
                      />
                      <Route
                        path="/book"
                        element={
                          <Layout>
                            <Book />
                          </Layout>
                        }
                      />
                      <Route
                        path="/poems"
                        element={
                          <Layout>
                            <Poems />
                          </Layout>
                        }
                      />
                      <Route
                        path="/login"
                        element={
                          <Layout>
                            <Login />
                          </Layout>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <Layout>
                            <Register />
                          </Layout>
                        }
                      />

                      {/* Protected Routes */}
                      <Route
                        path="/dashboard"
                        element={
                          <PrivateRoute>
                            <Layout>
                              <Dashboard />
                            </Layout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <PrivateRoute>
                            <Layout>
                              <Profile />
                            </Layout>
                          </PrivateRoute>
                        }
                      />

                      {/* 404 Route */}
                      <Route
                        path="*"
                        element={
                          <Layout>
                            <NotFound />
                          </Layout>
                        }
                      />
                    </Routes>
                  </Router>
                </AlertMessageProvider>
              </LanguageProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
