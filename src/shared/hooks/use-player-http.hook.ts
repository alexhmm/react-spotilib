import { useMutation, useQuery } from 'react-query';

// Hooks
import { useFetch } from './use-fetch.hook';

// Types
import {
  DevicesGetResponse,
  PlayPutParams,
  PlayPutRequest,
} from '../types/player.types';

export const usePlayerHttp = () => {
  const { fetchData, handleError, handleRetry } = useFetch();

  // ####### //
  // QUERIES //
  // ####### //

  /**
   * GET (non active) devices
   */
  const devicesQuery = useQuery(
    'devices',
    () => fetchData('me/player/devices'),
    {
      enabled: false,
      onError: (error: unknown) => {
        console.error('Error on getting devices:', error);
      },
    }
  );

  // ######### //
  // MUTATIONS //
  // ######### //

  /**
   * Play put mutation
   */
  const playPutMutation = useMutation(
    (data: { body?: PlayPutRequest; params?: PlayPutParams }) => play(data),
    {
      onError: async (
        error: any,
        data: {
          body?: PlayPutRequest | undefined;
          params?: PlayPutParams | undefined;
        }
      ) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
        const json = await error?.response.json();
        if (json.error.reason === 'NO_ACTIVE_DEVICE') {
          // Check for non active devices
          const devices: DevicesGetResponse = (await devicesQuery.refetch())
            .data;
          const device = devices.devices[0];
          // Start playing from main device
          if (device) {
            playPutMutation.mutate({
              body: {
                context_uri: data.body?.context_uri,
                uris: data.body?.uris,
                offset: data.body?.offset,
                position_ms: data.body?.position_ms,
              },
              params: {
                device_id: device.id,
              },
            });
          }
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // ####### //
  // METHODS //
  // ####### //

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
    devicesQuery,
    playPutMutation,
  };
};
