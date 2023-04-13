import { useTranslation } from 'react-i18next';

// Stores
import usePlaylistStore from './use-playlist.store';

// Types
import { Playlists, Playlist } from './playlist.types';
import { MenuItem, TrackAction } from '../../shared/types/shared.types';
import { SpotifyTrackMetaData } from '../../shared/types/spotify.types';

// Utils
import { playlistTracksMap } from './playlist.utils';

const usePlaylist = () => {
  const { t } = useTranslation();

  // Playlists store state
  const [playlists, setPlaylists] = usePlaylistStore((state) => [
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
   * DELETE Playlist by id.
   * @param id Playlist id
   */
  const playlistDeleteEffect = (id: string) => {
    const updatedPlaylists = { ...playlists };

    // Remove playlist from store by id
    const playlistToRemoveIndex = updatedPlaylists.items.findIndex(
      (playlist) => playlist.id === id
    );
    updatedPlaylists.items.splice(playlistToRemoveIndex, 1);
    setPlaylists(updatedPlaylists);
  };

  /**
   * GET Playlist tracks effect.
   * @param fetchedTracks Tracks array
   * @param playlist Playlist
   * @returns Updated playlist
   */
  const playlistTracksGetEffect = (
    fetchedTracks: SpotifyTrackMetaData[],
    playlist: Playlist
  ): Playlist => {
    const updatedPlaylist = { ...playlist };

    // Map spotify track data
    const tracks = playlistTracksMap(fetchedTracks);
    updatedPlaylist.tracks = updatedPlaylist.tracks.concat(tracks);
    return updatedPlaylist;
  };

  /**
   * GET Playlist track actions.
   * @param owner Owner of playlist
   * @returns Playlist track actions
   */
  const playlistTrackActionsGet = (owner: boolean | undefined): MenuItem[] => {
    const actions: MenuItem[] = [
      {
        action: TrackAction.Favorite,
        icon: ['far', 'heart'],
        title: t('track.action.favorite.title'),
      },
      {
        action: TrackAction.AddToPlaylist,
        icon: ['far', 'square-plus'],
        title: t('track.action.add_to_playlist.title'),
      },
    ];
    owner &&
      actions.push({
        action: TrackAction.RemoveFromPlaylist,
        icon: ['far', 'square-minus'],
        title: t('playlist.detail.track.action.remove_from_playlist.title'),
      });
    actions.push(
      {
        action: TrackAction.ShowAlbum,
        icon: ['fas', 'record-vinyl'],
        title: t('playlist.detail.track.action.show_album'),
      },
      {
        action: TrackAction.ShowArtist,
        icon: ['fas', 'user'],
        title: t('playlist.detail.track.action.show_artist'),
      }
    );

    return actions;
  };

  return {
    playlistsAddEffect,
    playlistsGetEffect,
    playlistDeleteEffect,
    playlistTracksGetEffect,
    playlistTrackActionsGet,
  };
};

export default usePlaylist;
