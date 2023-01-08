import create from 'zustand';

// Types
import { UserProfile } from './user.types';

export interface UserState {
  profile: UserProfile | undefined;
  resetState: () => void;
  setProfile: (profile: UserProfile | undefined) => void;
}

const intialUserState = {
  profile: undefined,
};

export const useUserStore = create<UserState>((set) => ({
  ...intialUserState,
  resetState: () => {
    set(intialUserState);
  },
  setProfile: (profile: UserProfile | undefined) => set({ profile }),
}));
