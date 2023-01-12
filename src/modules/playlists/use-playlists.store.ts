import create from 'zustand';

// Types
import { Playlists } from './playlists.types';

export interface PlaylistsState {
  playlists: Playlists;
  resetState: () => void;
  setPlaylists: (playlists: Playlists) => void;
}

const initialPlaylistsState = {
  playlists: {
    items: [],
    limit: 0,
    offset: 0,
    total: 0,
  },
};

export const usePlaylistsStore = create<PlaylistsState>((set) => ({
  ...initialPlaylistsState,
  resetState: () => set(initialPlaylistsState),
  setPlaylists: (playlists: Playlists) => set({ playlists }),
}));
