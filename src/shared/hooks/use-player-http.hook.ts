// Hooks
import { useFetch } from './use-fetch.hook';

// Types
import { PlayPutParams, PlayPutRequest } from '../types/player.types';

export const usePlayerHttp = () => {
  const { fetchData } = useFetch();

  /**
   * PUT Start a new context or resume current playback on the user's active device.
   * @param params PlayParams
   *
   */
  const play = async (data: {
    body?: PlayPutRequest;
    params?: PlayPutParams;
  }) => {
    return await fetchData('me/player/play', {
      body: data.body ?? undefined,
      method: 'PUT',
      params: data.params
        ? new URLSearchParams({
            device_id: data.params.device_id.toString(),
          })
        : undefined,
    });
  };

  return {
    play,
  };
};
