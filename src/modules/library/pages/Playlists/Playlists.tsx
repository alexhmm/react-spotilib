import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

// Components
import PlaylistCard from '../../../playlist/components/PlaylistCard/PlaylistCard';

// Hooks
import useFetch from '../../../../shared/hooks/use-fetch.hook';
import useLibrary from '../../use-library.hook';
import usePlaylistHttp from '../../../playlist/use-playlist-http.hook';

// Stores
import useLibraryStore from '../../use-library.store';
import useSharedStore from '../../../../shared/stores/use-shared.store';

// Styles
import styles from './Playlists.module.scss';

// Types
import { PlaylistsGetParams } from '../../../playlist/playlist.types';

// UI
import H3 from '../../../../shared/ui/H3/H3';

const Playlists = () => {
  const { handleError, handleRetry } = useFetch();
  const { playlistsAddEffect } = useLibrary();
  const { playlistsGet } = usePlaylistHttp();
  const { t } = useTranslation();

  // Library store state
  const [playlists, setPlaylists] = useLibraryStore((state) => [
    state.playlists,
    state.setPlaylists,
  ]);

  // Shared sotre state
  const [setPathName] = useSharedStore((state) => [state.setPathname]);

  // Component state
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
          console.error('Error on getting playlist:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        data && playlistsAddEffect(data.items);
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
        hasMore
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
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onPlay={() => console.log('onPlayPlaylist')}
            />
          ))}
      </InfiniteScroll>
    </div>
  );
};

export default memo(Playlists);
