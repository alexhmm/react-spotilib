import create from 'zustand';

// Types
import { Playlist, Playlists } from './playlist.types';

export interface PlaylistState {
  addTrackToPlaylist: string | undefined;
  playlist: Playlist | undefined;
  playlists: Playlists;
  resetState: () => void;
  setAddTrackToPlaylist: (addTrackToPlaylist: string | undefined) => void;
  setPlaylist: (playlist: Playlist | undefined) => void;
  setPlaylists: (playlists: Playlists) => void;
}

const initialPlaylistState: Pick<
  PlaylistState,
  'addTrackToPlaylist' | 'playlist' | 'playlists'
> = {
  addTrackToPlaylist: undefined,
  playlist: undefined,
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
  setPlaylist: (playlist: Playlist | undefined) => set({ playlist }),
  setPlaylists: (playlists: Playlists) => set({ playlists }),
}));

export default usePlaylistStore;
