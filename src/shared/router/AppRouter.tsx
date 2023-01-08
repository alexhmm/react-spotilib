import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// Router
import { ProtectedRoute } from './ProtectedRoute';

// Lazy-load pages
const Auth = lazy(() => import('../../modules/auth/pages/Auth/Auth'));
const Home = lazy(() => import('../../modules/home/pages/Home'));
const Login = lazy(() => import('../../modules/auth/pages/Login/Login'));
const Notes = lazy(() => import('../../modules/notes/pages/Notes'));

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
        path="notes"
        element={
          <ProtectedRoute>
            <Suspense fallback={<CircularProgress />}>
              <Notes />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
