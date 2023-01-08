import { useNavigate } from 'react-router-dom';

// Stores
import { useAuthStore } from '../../modules/auth/use-auth.store';
import { useUserStore } from '../../modules/user/use-user.store';

export const useLogout = () => {
  const navigate = useNavigate();

  // Auth store state
  const [resetAuthState] = useAuthStore((state) => [state.resetState]);

  // User store state
  const [resetUserState] = useUserStore((state) => [state.resetState]);

  /**
   * Handler to logout.
   */
  const logout = () => {
    console.log('logout');
    // Remove access token from local storage
    localStorage.removeItem('app:token');

    // Reset store states
    resetAuthState();
    resetUserState();

    // Navigate to home
    navigate('/login');
  };

  return {
    logout,
  };
};
