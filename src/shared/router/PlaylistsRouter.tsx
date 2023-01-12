import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// Lazy-load pages
const Playlist = lazy(
  () => import('../../modules/playlists/pages/Playlist/Playlist')
);

export const PlaylistsRouter = () => {
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
