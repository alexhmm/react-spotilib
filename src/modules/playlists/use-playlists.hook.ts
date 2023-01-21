// Stores
import { usePlaylistsStore } from './use-playlists.store';

// Types
import { Playlists, Playlist } from './playlists.types';
import { TrackMetaData } from '../../shared/types/spotify.types';

// Utils
import { playlistTracksMap } from './playlists.utils';

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

  /**
   * GET Playlist tracks effect.
   * @param fetchedTracks Tracks array
   * @param playlist Playlist
   * @returns Updated playlist
   */
  const playlistTracksGetEffect = (
    fetchedTracks: TrackMetaData[],
    playlist: Playlist
  ): Playlist => {
    const updatedPlaylist = { ...playlist };

    // Map spotify track data
    const tracks = playlistTracksMap(fetchedTracks);
    updatedPlaylist.tracks = updatedPlaylist.tracks.concat(tracks);
    return updatedPlaylist;
  };

  return {
    playlistsAddEffect,
    playlistsGetEffect,
    playlistTracksGetEffect,
  };
};
