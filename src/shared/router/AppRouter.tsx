import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// Router
import { PlaylistRouter } from './PlaylistRouter';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy-load pages
const Auth = lazy(() => import('../../modules/auth/pages/Auth/Auth'));
const Home = lazy(() => import('../../modules/home/pages/Home'));
const Login = lazy(() => import('../../modules/auth/pages/Login/Login'));
const Notes = lazy(() => import('../../modules/notes/pages/Notes'));
const Search = lazy(() => import('../../modules/search/pages/Search/Search'));

export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Suspense fallback={<CircularProgress />}>
              <Home />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <Suspense fallback={<CircularProgress />}>
            <Auth />
          </Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <Suspense fallback={<CircularProgress />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Suspense fallback={<CircularProgress />}>
              <Notes />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/playlist/*"
        element={
          <ProtectedRoute>
            <PlaylistRouter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Suspense fallback={<CircularProgress />}>
              <Search />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
