import create from 'zustand';

// Types
import { Playlists } from './playlist.types';

export interface PlaylistState {
  playlists: Playlists;
  resetState: () => void;
  setPlaylists: (playlists: Playlists) => void;
}

const initialPlaylistState = {
  playlists: {
    items: [],
    limit: 0,
    offset: 0,
    total: 0,
  },
};
const usePlaylistStore = create<PlaylistState>((set) => ({
  ...initialPlaylistState,
  resetState: () => set(initialPlaylistState),
  setPlaylists: (playlists: Playlists) => set({ playlists }),
}));

export default usePlaylistStore;
