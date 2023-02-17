// Hooks
import useFetch from '../../shared/hooks/use-fetch.hook';

// Types
import { SpotifyAlbum } from '../../shared/types/spotify.types';

const useAlbumHttp = () => {
  const { fetchData } = useFetch();

  /**
   * GET Album by id.
   * @returns Album
   */
  const albumGet = async (id?: string): Promise<SpotifyAlbum | undefined> => {
    if (id) {
      return await fetchData(`albums/${id}`);
    } else {
      return undefined;
    }
  };

  return {
    albumGet,
  };
};

export default useAlbumHttp;
