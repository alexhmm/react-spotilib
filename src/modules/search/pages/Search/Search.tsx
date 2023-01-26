import { CircularProgress } from '@mui/material';
import { memo, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';

// Components
import AlbumCard from '../../../albums/components/AlbumCard/AlbumCard';

// Hooks
import { useFetch } from '../../../../shared/hooks/use-fetch.hook';
import { usePlayerHttp } from '../../../../shared/hooks/use-player-http.hook';

// Stores
import useSearchStore from '../../use-search.store';

// Styles
import styles from './Search.module.scss';

// Types
import {
  DevicesGetResponse,
  PlayPutParams,
  PlayPutRequest,
} from '../../../../shared/types/player.types';

// UI
import H3 from '../../../../shared/ui/H3/H3';

const Search = () => {
  const { fetchData, handleRetry } = useFetch();
  const { play } = usePlayerHttp();
  const { t } = useTranslation();

  // Search store state
  const [searchData, searchLoading, setSearchElem] = useSearchStore((state) => [
    state.searchData,
    state.searchLoading,
    state.setSearchElem,
  ]);

  // ####### //
  // QUERIES //
  // ####### //

  // Get (non active) devices
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

  // PUT Play mutation
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
                uris: data.body?.uris,
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
  // EFFECTS //
  // ####### //

  // Set search element on component mount.
  useEffect(() => {
    setSearchElem(true);
    return () => {
      setSearchElem(false);
    };
    // eslint-disable-next-line
  }, []);

  // ######### //
  // CALLBACKS //
  // ######### //

  const onPlayContextUri = useCallback((context_uri: string) => {
    playPutMutation.mutate({
      body: {
        context_uri,
      },
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles['search']}>
      {searchLoading && <CircularProgress />}
      {searchData?.albums && (
        <>
          <H3>{t('albums.title')}</H3>
          <div className={styles['search-albums']}>
            {searchData.albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onPlay={() => onPlayContextUri(album.uri)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(Search);
