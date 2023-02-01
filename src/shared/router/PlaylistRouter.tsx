import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// Lazy-load pages
const Playlist = lazy(
  () => import('../../modules/playlist/pages/Playlist/Playlist')
);

export const PlaylistRouter = () => {
  return (
    <Routes>
      <Route
        path=":id"
        element={
          <Suspense fallback={<CircularProgress />}>
            <Playlist />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
