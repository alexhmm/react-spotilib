import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

// Components
import PlaylistCard from '../../../playlist/components/PlaylistCard/PlaylistCard';

// Hooks
import useFetch from '../../../../shared/hooks/use-fetch.hook';
import usePlaylistHttp from '../../../playlist/use-playlist-http.hook';

// Stores
import useSharedStore from '../../../../shared/stores/use-shared.store';

// Styles
import styles from './Playlists.module.scss';

// Types
import {
  PlaylistCard as IPlaylistCard,
  PlaylistsGetParams,
} from '../../../playlist/playlist.types';

// UI
import H3 from '../../../../shared/ui/H3/H3';

// Utils
import { playlistDataMap } from '../../../playlist/playlist.utils';
import { concatArray } from '../../../../shared/utils/shared.utils';

const Playlists = () => {
  const { handleError, handleRetry } = useFetch();
  const { playlistsGet } = usePlaylistHttp();
  const { t } = useTranslation();

  // Shared store state
  const [setPathName] = useSharedStore((state) => [state.setPathname]);

  // Component state
  const [playlists, setPlaylists] = useState<IPlaylistCard[]>([]);
  const [playlistsTotal, setPlaylistsTotal] = useState<number | undefined>(
    undefined
  );
  const [playlistsGetParams, setPlaylistsGetParams] =
    useState<PlaylistsGetParams>({
      limit: 50,
      offset: 0,
    });

  // ####### //
  // QUERIES //
  // ####### //

  // Get playlists on component mount.
  // eslint-disable-next-line
  const playlistsQuery = useQuery(
    ['playlists', playlistsGetParams],
    () => playlistsGet(playlistsGetParams),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting playlists:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          !playlistsTotal && setPlaylistsTotal(data.total);
          setPlaylists(concatArray(playlists, playlistDataMap(data.items)));
        }
      },
      retry: handleRetry,
    }
  );

  // ####### //
  // EFFECTS //
  // ####### //

  /**
   * Set pathname on mount.
   */
  useEffect(() => {
    setPathName('/library/playlists');
    return () => {
      setPathName(undefined);
      setPlaylists([]);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles['playlists']}>
      <H3>{t('playlist.title')}</H3>
      <InfiniteScroll
        className="context-grid"
        dataLength={playlists.length}
        hasMore={
          playlistsTotal && playlists.length < playlistsTotal ? true : false
        }
        loader={<CircularProgress />}
        next={() =>
          setPlaylistsGetParams({
            limit: 50,
            offset: playlists.length,
          })
        }
        scrollThreshold={1}
      >
        {playlists &&
          playlists.length > 0 &&
          playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
      </InfiniteScroll>
    </div>
  );
};

export default memo(Playlists);
