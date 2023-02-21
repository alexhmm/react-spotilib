import create from 'zustand';

// Types
import { PlaylistCard } from '../playlist/playlist.types';

export interface LibraryState {
  playlists: PlaylistCard[];
  setPlaylists: (playlists: PlaylistCard[]) => void;
}

const initialLibraryState = {
  playlists: [],
};

const useLibraryStore = create<LibraryState>((set) => ({
  ...initialLibraryState,
  resetState: () => set(initialLibraryState),
  setPlaylists: (playlists: PlaylistCard[]) => set({ playlists }),
}));

export default useLibraryStore;
