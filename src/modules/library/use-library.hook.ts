// Stores
import useLibraryStore from './use-library.store';

// Types
import { SpotifyPlaylist } from '../../shared/types/spotify.types';

// Utils
import { playlistDataMap } from '../playlist/playlist.utils';

const useLibrary = () => {
  // Library store state
  const [playlists, setPlaylists] = useLibraryStore((state) => [
    state.playlists,
    state.setPlaylists,
  ]);

  /**
   * Add playlists to store.
   * @param fetchedPlaylists PlaylistsStore
   */
  const playlistsAddEffect = (fetchedPlaylists: SpotifyPlaylist[]) => {
    let updatedPlaylists = [...playlists];
    // Concat current and fetched playlists
    updatedPlaylists = updatedPlaylists.concat(
      playlistDataMap(fetchedPlaylists)
    );
    setPlaylists(updatedPlaylists);
  };

  return {
    playlistsAddEffect,
  };
};

export default useLibrary;
