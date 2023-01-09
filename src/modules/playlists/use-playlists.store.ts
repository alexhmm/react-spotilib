import create from 'zustand';

// Types
import { Playlists } from './playlists.types';

export interface PlaylistsState {
  playlists: Playlists;
  setPlaylists: (playlists: Playlists) => void;
}

export const usePlaylistsStore = create<PlaylistsState>((set) => ({
  playlists: {
    items: [],
    limit: 0,
    offset: 0,
    total: 0,
  },
  setPlaylists: (playlists: Playlists) => set({ playlists }),
}));
