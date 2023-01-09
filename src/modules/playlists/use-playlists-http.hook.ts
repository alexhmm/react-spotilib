// Hooks
import { useFetch } from '../../shared/hooks/use-fetch.hook';

// Types
import { PlaylistsGetParams, PlaylistsGetResponse } from './playlists.types';

export const usePlaylistsHttp = () => {
  const { fetchData } = useFetch();

  /**
   * GET Contacts.
   * @returns Contacts
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

  return {
    playlistsGet,
  };
};
