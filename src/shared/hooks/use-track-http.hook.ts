// Hooks
import useFetch from './use-fetch.hook';

// Types
import { RequestMethod } from '../types/shared.types';
import { SaveTracksPutRequest } from '../types/track.types';

const useTrackHttp = () => {
  const { fetchData } = useFetch();

  /**
   * PUT Save one or more tracks to the current user's 'Your Music' library.
   * @param body Track ids
   * @returns Message
   */
  const saveTracks = async (body: SaveTracksPutRequest): Promise<any> => {
    return await fetchData(`me/tracks`, {
      body,
      method: RequestMethod.Put,
      params: new URLSearchParams({
        ids: body.ids.toString(),
      }),
    });
  };

  return {
    saveTracks,
  };
};

export default useTrackHttp;
