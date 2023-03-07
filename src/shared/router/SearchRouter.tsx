import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// Lazy-load pages
const Search = lazy(() => import('../../modules/search/pages/Search/Search'));
const SearchResult = lazy(
  () => import('../../modules/search/pages/SearchResult/SearchResult')
);

const SearchRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<CircularProgress />}>
            <Search />
          </Suspense>
        }
      />
      <Route
        path="/:query"
        element={
          <Suspense fallback={<CircularProgress />}>
            <SearchResult />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default SearchRouter;
