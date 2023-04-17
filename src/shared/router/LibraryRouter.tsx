import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// Lazy-load pages
const Albums = lazy(() => import('../../modules/library/pages/Albums/Albums'));
const Artists = lazy(
  () => import('../../modules/library/pages/Artists/Artists')
);
const Playlists = lazy(
  () => import('../../modules/library/pages/Playlists/Playlists')
);

const LibraryRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/library/artists" />} />
      <Route
        path="/albums"
        element={
          <Suspense fallback={<CircularProgress />}>
            <Albums />
          </Suspense>
        }
      />
      <Route
        path="/artists"
        element={
          <Suspense fallback={<CircularProgress />}>
            <Artists />
          </Suspense>
        }
      />
      <Route
        path="/playlists"
        element={
          <Suspense fallback={<CircularProgress />}>
            <Playlists />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default LibraryRouter;
