import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// Lazy-load pages
const Artist = lazy(() => import('../../modules/artist/pages/Artist/Artist'));

const ArtistRouter = () => {
  return (
    <Routes>
      <Route
        path=":id"
        element={
          <Suspense fallback={<CircularProgress />}>
            <Artist />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ArtistRouter;
