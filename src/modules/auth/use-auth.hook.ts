// Hooks
import useLogout from '../../shared/hooks/use-logout.hook';

// Stores
import useAuthStore from './use-auth.store';

// Types
import { Token } from './auth.types';

// Utils
import { generateRandomString } from './auth.utils';

// Password reg expressions
// const regExpLower = new RegExp('.*[a-z].*');
export const regExpNumber = new RegExp('.*\\d.*');
export const regExpSpecial = new RegExp(
  '.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'
);
export const regExpUpper = new RegExp('.*[A-Z].*');

const useAuth = () => {
  const { logout } = useLogout();

  // Auth store state
  const [token] = useAuthStore((state) => [state.token]);

  /**
   * Authorize through spotify
   */
  const authorize = () => {
    // Generate random string
    const state = generateRandomString(16);

    // Set spotify auth state
    // This provides protection against attacks such as cross-site request forgery
    localStorage.setItem('spotify:state', state);

    // Navigate to spotify authorization page
    window.location.replace(
      `https://accounts.spotify.com/authorize?${new URLSearchParams({
        response_type: 'code',
        client_id: process.env.REACT_APP_CLIENT_ID ?? '',
        scope:
          'playlist-read-private user-modify-playback-state user-follow-modify user-follow-read user-read-email user-read-playback-state user-read-private user-top-read',
        redirect_uri: process.env.REACT_APP_REDIRECT_URI ?? '',
        state,
      })}`
    );
  };

  /**
   * Compare current date and access token expire date.
   * @returns Auth access validity
   */
  const isAuthorized = () => {
    if (token) {
      if (new Date(token.expire_time) > new Date()) {
        return true;
      } else {
        logout();
        return false;
      }
    } else {
      logout();
      return false;
    }
  };

  /**
   * Get token by refresh token
   * @param refreshToken Refresh token
   * @returns Token
   */
  const tokenByRefreshGet = async (
    refreshToken: string
  ): Promise<Token | undefined> => {
    return await fetch('https://accounts.spotify.com/api/token', {
      body: `grant_type=refresh_token&redirect_uri=${
        process.env.NEXT_PUBLIC_REDIRECT_URI ?? ''
      }&refresh_token=${refreshToken}`,
      headers: {
        Authorization: `Basic ${window.btoa(
          `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`
        )}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    }).then((res) => res.json());
  };

  /**
   * Get token by code.
   * @param code Generated code.
   * @returns Token
   */
  const tokenGet = async (code: string): Promise<Token | undefined> => {
    return await fetch('https://accounts.spotify.com/api/token', {
      body: `code=${code}&grant_type=authorization_code&redirect_uri=${
        process.env.REACT_APP_REDIRECT_URI ?? ''
      }`,
      headers: {
        Authorization: `Basic ${window.btoa(
          `${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`
        )}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    }).then((res) => res.json());
  };

  return {
    authorize,
    isAuthorized,
    tokenByRefreshGet,
    tokenGet,
  };
};

export default useAuth;
