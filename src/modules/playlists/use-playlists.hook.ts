// Stores
import { usePlaylistsStore } from './use-playlists.store';

// Types
import { Playlists } from './playlists.types';

export const usePlaylists = () => {
  // Playlists store state
  const [playlists, setPlaylists] = usePlaylistsStore((state) => [
    state.playlists,
    state.setPlaylists,
  ]);

  /**
   * Add playlists to store. Update offset.
   * @param fetchedPlaylists PlaylistsStore
   */
  const playlistsAddEffect = (fetchedPlaylists: Playlists) => {
    const updatedPlaylists = { ...playlists };
    // Set next offset
    if (
      fetchedPlaylists.limit + fetchedPlaylists.offset <
      fetchedPlaylists.total
    ) {
      updatedPlaylists.offset =
        updatedPlaylists.offset + fetchedPlaylists.limit;
    } else {
      updatedPlaylists.offset = fetchedPlaylists.total;
    }
    if (fetchedPlaylists.total !== updatedPlaylists.offset) {
      updatedPlaylists.total = fetchedPlaylists.total;
    }
    // Push playlists into array
    updatedPlaylists.items = updatedPlaylists.items.concat(
      fetchedPlaylists.items
    );
    setPlaylists(updatedPlaylists);
  };

  /**
   * Add initial playlists to store. Update offset.
   * @param fetchedPlaylists PlaylistsStore
   */
  const playlistsGetEffect = (fetchedPlaylists: Playlists) => {
    const updatedPlaylists = { ...playlists };
    // Set next offset
    if (
      fetchedPlaylists.limit + fetchedPlaylists.offset <
      fetchedPlaylists.total
    ) {
      updatedPlaylists.offset =
        updatedPlaylists.offset + fetchedPlaylists.limit;
    }
    if (fetchedPlaylists.total !== updatedPlaylists.offset) {
      updatedPlaylists.total = fetchedPlaylists.total;
    }
    // Set playlist items
    updatedPlaylists.items = fetchedPlaylists.items;
    setPlaylists(updatedPlaylists);
  };

  return {
    playlistsAddEffect,
    playlistsGetEffect,
  };
};
