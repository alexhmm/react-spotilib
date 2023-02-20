import create from 'zustand';

// Types
import { Notification } from '../types/shared.types';

// Models
export interface SharedState {
  headerTitle: string | undefined;
  notification: Notification | undefined;
  resetState: () => void;
  setHeaderTitle: (headerTitle: string | undefined) => void;
  setNotification: (notification: Notification | undefined) => void;
}

const initialSharedState = {
  headerTitle: undefined,
  notification: undefined,
};

const useSharedStore = create<SharedState>((set) => ({
  ...initialSharedState,
  resetState: () => {
    set(initialSharedState);
  },
  setHeaderTitle: (headerTitle: string | undefined) => {
    set({ headerTitle });
  },
  setNotification: (notification: Notification | undefined) => {
    set({ notification });
  },
}));

export default useSharedStore;
