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
import AdminRoute from './components/auth/AdminRoute';
import LoadingSpinner from './components/shared/LoadingSpinner';
import TitleUpdater from './components/shared/TitleUpdater';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Poems from './pages/Poems';
import PoemDetail from './pages/PoemDetail'; // Importing the new component
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PoemModerationDashboard from './pages/PoemModerationDashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Association from './pages/Association';
import Journal from './pages/Journal';
import Press from './pages/Press';
import News from './pages/News';
import AuthorsPage from './pages/AuthorsPage';
import AuthorPoemsPage from './pages/AuthorPoemsPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AuthorReviewPage from './pages/AuthorReviewPage';
import UserSecurityManagement from './pages/UserSecurityManagement';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPoemsDeletePage from './pages/AdminPoemsDeletePage';
import UserManagement from './pages/UserManagement';

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
                        path="/poems"
                        element={
                          <Layout>
                            <Poems />
                          </Layout>
                        }
                      />
                      <Route
                        path="/poems/:id" // New route for poem details
                        element={
                          <Layout>
                            <PoemDetail />
                          </Layout>
                        }
                      />
                      <Route
                        path="/association"
                        element={
                          <Layout>
                            <Association />
                          </Layout>
                        }
                      />
                      <Route
                        path="/journal"
                        element={
                          <Layout>
                            <Journal />
                          </Layout>
                        }
                      />
                      <Route
                        path="/press"
                        element={
                          <Layout>
                            <Press />
                          </Layout>
                        }
                      />
                      <Route
                        path="/news"
                        element={
                          <Layout>
                            <News />
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
                      <Route
                        path="/forgot-password"
                        element={
                          <Layout>
                            <ForgotPasswordPage />
                          </Layout>
                        }
                      />
                      <Route
                        path="/reset-password/:token"
                        element={
                          <Layout>
                            <ResetPasswordPage />
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

                      {/* Admin Routes */}
                      <Route
                        path="/admin/dashboard"
                        element={
                          <AdminRoute>
                            <Layout>
                              <AdminDashboard />
                            </Layout>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/author/review"
                        element={
                          <AdminRoute>
                            <Layout>
                              <AuthorReviewPage />
                            </Layout>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/user/management/permission"
                        element={
                          <AdminRoute>
                            <Layout>
                              <UserManagement />
                            </Layout>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/author/managment/reset"
                        element={
                          <AdminRoute>
                            <Layout>
                              <UserSecurityManagement />
                            </Layout>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/poem/managment/delete"
                        element={
                          <AdminRoute>
                            <Layout>
                              <AdminPoemsDeletePage />
                            </Layout>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/moderation"
                        element={
                          <AdminRoute>
                            <Layout>
                              <PoemModerationDashboard />
                            </Layout>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/authors/total"
                        element={
                          <Layout>
                            <AuthorsPage />
                          </Layout>
                        }
                      />
                      <Route
                        path="/author/:authorId"
                        element={
                          <Layout>
                            <AuthorPoemsPage />
                          </Layout>
                        }
                      />
                      <Route
                        path="/profile/password/modify"
                        element={
                          <Layout>
                            <ChangePasswordPage />
                          </Layout>
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
