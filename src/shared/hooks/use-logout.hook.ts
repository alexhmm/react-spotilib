import { useNavigate } from 'react-router-dom';

// Stores
import { useAuthStore } from '../../modules/auth/use-auth.store';
import { useSharedStore } from '../stores/use-shared.store';
import { useUserStore } from '../../modules/user/use-user.store';

export const useLogout = () => {
  const navigate = useNavigate();

  // Auth store state
  const [setToken] = useAuthStore((state) => [state.setToken]);

  // Shared store state
  const [resetSharedState] = useSharedStore((state) => [state.resetState]);

  // User store state
  const [resetUserState] = useUserStore((state) => [state.resetState]);

  /**
   * Handler to logout.
   */
  const logout = () => {
    // Remove access token from local storage
    localStorage.removeItem('app:token');

    // Reset store states
    setToken(undefined);
    resetSharedState();
    resetUserState();

    // Navigate to home
    navigate('/login');
  };

  return {
    logout,
  };
};
