// Hooks
import { useFetch } from './use-fetch.hook';

// Types
import { PlayPutRequest } from '../types/player.types';

export const usePlayerHttp = () => {
  const { fetchData } = useFetch();

  /**
   * PUT Start a new context or resume current playback on the user's active device.
   * @param params PlayParams
   *
   */
  const play = async (body?: PlayPutRequest) => {
    return await fetchData('me/player/play', {
      body: body ?? undefined,
      method: 'PUT',
    });
  };

  return {
    play,
  };
};
