import create from 'zustand';

// Types
import { Token, TokenWithExpireDate } from './auth.types';

export interface AuthState {
  token: TokenWithExpireDate | undefined;
  resetState: () => void;
  setToken: (token: Token | undefined) => void;
}

const initialAuthState: Pick<AuthState, 'token'> = {
  token: localStorage.getItem('app:token')
    ? JSON.parse(localStorage.getItem('app:token') ?? '')
    : undefined,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialAuthState,
  resetState: () => {
    set(initialAuthState);
  },
  setToken: (token: Token | undefined) => {
    if (token) {
      // Calculate expire time by expires in and date
      const date = new Date();
      const currTime = date.getTime();
      const expireTime = currTime + token.expires_in * 1000;

      // Get refresh token from state
      const stateRefreshToken = get().token?.refresh_token;

      // Create updated token object
      const updatedToken: TokenWithExpireDate = {
        access_token: token.access_token,
        expire_time: expireTime,
        expires_in: token.expires_in,
        refresh_token: token.refresh_token
          ? token.refresh_token
          : stateRefreshToken
          ? stateRefreshToken
          : '',
        scope: token.scope,
        token_type: token.token_type,
      };

      // Save token to local storage
      localStorage.setItem('app:token', JSON.stringify(updatedToken));

      set((state) => ({
        ...state,
        token: updatedToken,
      }));
    } else {
      localStorage.removeItem('app:token');
      set({ token: undefined });
    }
  },
}));
