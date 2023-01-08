import { useNavigate } from 'react-router-dom';

// Stores
import { useAuthStore } from '../../modules/auth/use-auth.store';

export const useLogout = () => {
  const navigate = useNavigate();

  // Auth store state
  const [resetState] = useAuthStore((state) => [state.resetState]);

  /**
   * Handler to logout.
   */
  const logout = () => {
    console.log('logout');
    // Remove access token from local storage
    localStorage.removeItem('app:token');

    // Reset store states
    resetState();

    // Navigate to home
    navigate('/login');
  };

  return {
    logout,
  };
};
