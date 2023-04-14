import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';

// Hooks
import useFetch from '../../../shared/hooks/use-fetch.hook';

// Stores
import useSharedStore from '../../../shared/stores/use-shared.store';

// Types
import { RequestMethod } from '../../../shared/types/shared.types';
import { SaveTracksPutRequest } from '../../../shared/types/track.types';

const useTrackHttp = () => {
  const { fetchData, handleError, handleRetry } = useFetch();
  const { t } = useTranslation();

  // Shared store state
  const [setNotification] = useSharedStore((state) => [state.setNotification]);

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

  // PUT Save tracks mutation
  const saveTracksPutMutation = useMutation(
    (data: SaveTracksPutRequest) => saveTracks(data),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: () => {
        setNotification({
          title: t('track.action.favorite.success'),
        });
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  return {
    saveTracks,
    saveTracksPutMutation,
  };
};

export default useTrackHttp;
