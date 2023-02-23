import create from 'zustand';

// Types
import { Notification } from '../types/shared.types';

// Models
export interface SharedState {
  following: boolean | undefined;
  headerTitle: string | undefined;
  notification: Notification | undefined;
  pathname: string | undefined;
  resetState: () => void;
  setFollowing: (followingState: boolean | undefined) => void;
  setHeaderTitle: (headerTitle: string | undefined) => void;
  setNotification: (notification: Notification | undefined) => void;
  setPathname: (pathname: string | undefined) => void;
}

const initialSharedState = {
  following: undefined,
  headerTitle: undefined,
  notification: undefined,
  pathname: undefined,
};

const useSharedStore = create<SharedState>((set) => ({
  ...initialSharedState,
  resetState: () => {
    set(initialSharedState);
  },
  setFollowing: (following: boolean | undefined) => {
    set({
      following,
    });
  },
  setHeaderTitle: (headerTitle: string | undefined) => {
    set({ headerTitle });
  },
  setNotification: (notification: Notification | undefined) => {
    set({ notification });
  },
  setPathname: (pathname: string | undefined) => {
    set({ pathname });
  },
}));

export default useSharedStore;
