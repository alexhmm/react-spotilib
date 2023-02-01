import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Hooks
import useAuth from '../../modules/auth/use-auth.hook';

// A wrapper for <Route> that navigates to the login screen if you're not yet authorized.
type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = (props: ProtectedRouteProps) => {
  let { isAuthorized } = useAuth();
  const location = useLocation();

  let show = false;
  if (isAuthorized()) {
    show = true;
  }

  return (
    <>
      {show ? (
        props.children
      ) : (
        <Navigate
          to={
            location && location.pathname && location.pathname.length > 1
              ? `/login?redirect=${location.pathname}`
              : '/login'
          }
        />
      )}
    </>
  );
};

export default ProtectedRoute;
