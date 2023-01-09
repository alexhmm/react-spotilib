import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { CircularProgress } from '@mui/material';

// Hooks
import { useAuth } from '../../use-auth.hook';

// Stores
import { useAuthStore } from '../../use-auth.store';

const Auth = () => {
  const { tokenGet } = useAuth();
  const navigate = useNavigate();

  // Auth store state
  const [setToken] = useAuthStore((state) => [state.setToken]);

  // ####### //
  // QUERIES //
  // ####### //

  // Get token by code.
  const tokenQuery = useQuery(
    'token',
    () =>
      tokenGet(new URLSearchParams(window.location.search).get('code') ?? ''),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onError: (error: unknown) => {
        console.error('Error on logging in:', error);
        navigate('/login');
      },
      onSuccess: (data) => {
        setToken(data);
        navigate('/', {
          replace: true,
        });
      },
    }
  );

  // ####### //
  // EFFECTS //
  // ####### //

  useEffect(() => {
    tokenQuery.refetch();
    // eslint-disable-next-line
  }, []);

  return <CircularProgress />;
};

export default Auth;
