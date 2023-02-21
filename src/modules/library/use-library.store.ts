import create from 'zustand';

// Types
import { ArtistCard } from '../artist/artist.types';
import { PlaylistCard } from '../playlist/playlist.types';

export interface LibraryState {
  followedArtists: ArtistCard[];
  playlists: PlaylistCard[];
  resetState: () => void;
  setFollowedArtists: (followedArtists: ArtistCard[]) => void;
  setPlaylists: (playlists: PlaylistCard[]) => void;
}

const initialLibraryState = {
  followedArtists: [],
  playlists: [],
};

const useLibraryStore = create<LibraryState>((set) => ({
  ...initialLibraryState,
  resetState: () => set(initialLibraryState),
  setFollowedArtists: (followedArtists: ArtistCard[]) =>
    set({ followedArtists }),
  setPlaylists: (playlists: PlaylistCard[]) => set({ playlists }),
}));

export default useLibraryStore;
