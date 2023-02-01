// Hooks
import { useFetch } from '../../shared/hooks/use-fetch.hook';

// Types
import { PlaylistsGetParams } from './playlist.types';
import {
  SpotifyDataGetResponse,
  SpotifyPlaylist,
} from '../../shared/types/spotify.types';
import { TracksGetResponse } from '../track/track.types';

export const usePlaylistHttp = () => {
  const { fetchData } = useFetch();

  /**
   * GET User playlists.
   * @param params PlaylistGetParams
   * @returns User playlists
   */
  const playlistsGet = async (
    params?: PlaylistsGetParams
  ): Promise<SpotifyDataGetResponse<SpotifyPlaylist[]> | undefined> => {
    return await fetchData(
      'me/playlist',
      params && {
        params: new URLSearchParams({
          limit: params.limit.toString(),
          offset: params.offset.toString(),
        }),
      }
    );
  };

  /**
   * GET Playlist by id.
   * @returns Playlist
   */
  const playlistGet = async (
    id?: string
  ): Promise<SpotifyPlaylist | undefined> => {
    if (id) {
      return await fetchData(`playlists/${id}`);
    } else {
      return undefined;
    }
  };

  /**
   * GET Playlist tracks by offset.
   * @param id Playlist id
   * @param params PlaylistsGetParams
   * @returns User playlists
   */
  const playlistTracksGet = async (data: {
    id: string;
    params?: PlaylistsGetParams;
  }): Promise<TracksGetResponse | undefined> => {
    return await fetchData(
      `playlists/${data.id}/tracks`,
      data.params && {
        params: new URLSearchParams({
          limit: data.params.limit.toString(),
          offset: data.params.offset.toString(),
        }),
      }
    );
  };

  return {
    playlistsGet,
    playlistGet,
    playlistTracksGet,
  };
};
