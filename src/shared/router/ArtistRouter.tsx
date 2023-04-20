import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// Lazy-load pages
const Artist = lazy(() => import('../../modules/artist/pages/Artist/Artist'));
const ArtistReleases = lazy(
  () => import('../../modules/artist/pages/ArtistAlbums/ArtistAlbums')
);

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
      <Route
        path=":id/discography/:type"
        element={
          <Suspense fallback={<CircularProgress />}>
            <ArtistReleases />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ArtistRouter;
