import create from 'zustand';

// Types
import { Playlists } from './playlist.types';

export interface PlaylistState {
  addTrackToPlaylist: string | undefined;
  playlists: Playlists;
  resetState: () => void;
  setAddTrackToPlaylist: (addTrackToPlaylist: string | undefined) => void;
  setPlaylists: (playlists: Playlists) => void;
}

const initialPlaylistState = {
  addTrackToPlaylist: undefined,
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
  setAddTrackToPlaylist: (addTrackToPlaylist: string | undefined) =>
    set({ addTrackToPlaylist }),
  setPlaylists: (playlists: Playlists) => set({ playlists }),
}));

export default usePlaylistStore;
