import create from 'zustand';

// Models
export interface SharedState {
  headerTitle: string | undefined;
  resetState: () => void;
  setHeaderTitle: (headerTitle: string | undefined) => void;
}

const initialSharedState = {
  headerTitle: undefined,
};

export const useSharedStore = create<SharedState>((set) => ({
  ...initialSharedState,
  resetState: () => {
    set(initialSharedState);
  },
  setHeaderTitle: (headerTitle: string | undefined) => {
    set({ headerTitle });
  },
}));
