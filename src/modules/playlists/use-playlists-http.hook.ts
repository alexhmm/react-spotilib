// Hooks
import { useFetch } from '../../shared/hooks/use-fetch.hook';

// Types
import {
  Playlist,
  PlaylistsGetParams,
  PlaylistsGetResponse,
} from './playlists.types';

export const usePlaylistsHttp = () => {
  const { fetchData } = useFetch();

  /**
   * GET User playlists.
   * @returns User playlists
   */
  const playlistsGet = async (
    params?: PlaylistsGetParams
  ): Promise<PlaylistsGetResponse | undefined> => {
    return await fetchData(
      'me/playlists',
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
  const playlistGet = async (id?: string): Promise<Playlist | undefined> => {
    if (id) {
      return await fetchData(`playlists/${id}`);
    } else {
      return undefined;
    }
  };

  return {
    playlistsGet,
    playlistGet,
  };
};
