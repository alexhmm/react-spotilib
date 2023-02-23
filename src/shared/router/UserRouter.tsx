import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// Lazy-load pages
const Profile = lazy(() => import('../../modules/user/pages/Profile/Profile'));

const UserRouter = () => {
  return (
    <Routes>
      <Route
        path=":id"
        element={
          <Suspense fallback={<CircularProgress />}>
            <Profile />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default UserRouter;
