import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// Router
import AlbumRouter from './AlbumRouter';
import ArtistRouter from './ArtistRouter';
import LibraryRouter from './LibraryRouter';
import PlaylistRouter from './PlaylistRouter';
import ProtectedRoute from './ProtectedRoute';

// Lazy-load pages
const Auth = lazy(() => import('../../modules/auth/pages/Auth/Auth'));
const Home = lazy(() => import('../../modules/home/pages/Home'));
const Login = lazy(() => import('../../modules/auth/pages/Login/Login'));
const Search = lazy(() => import('../../modules/search/pages/Search/Search'));

const AppRouter = () => {
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
        path="/album/*"
        element={
          <ProtectedRoute>
            <AlbumRouter />
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
        path="/artist/*"
        element={
          <ProtectedRoute>
            <ArtistRouter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/library/*"
        element={
          <ProtectedRoute>
            <LibraryRouter />
          </ProtectedRoute>
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

export default AppRouter;
