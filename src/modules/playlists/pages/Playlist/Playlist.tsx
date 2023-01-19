import { memo, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material';

// Components
import PlaylistTrack from '../../components/PlaylistTrack/PlaylistTrack';

// Hooks
import { useFetch } from '../../../../shared/hooks/use-fetch.hook';
import { usePlayerHttp } from '../../../../shared/hooks/use-player-http.hook';
import { usePlaylists } from '../../use-playlists.hook';
import { usePlaylistsHttp } from '../../use-playlists-http.hook';

// Styles
import styles from './Playlist.module.scss';

// Stores
import { useSharedStore } from '../../../../shared/stores/use-shared.store';

// Types
import {
  DevicesGetResponse,
  PlayPutParams,
  PlayPutRequest,
} from '../../../../shared/types/player.types';
import {
  Playlist as IPlaylist,
  PlaylistsGetParams,
} from '../../playlists.types';

// UI
import H2 from '../../../../shared/ui/H2/H2';

const Playlist = () => {
  const { fetchData, handleError, handleRetry } = useFetch();
  const { id } = useParams();
  const { play } = usePlayerHttp();
  const { playlistTracksGetEffect } = usePlaylists();
  const { playlistGet, playlistTracksGet } = usePlaylistsHttp();
  const { i18n, t } = useTranslation();

  // Component state
  const [playlist, setPlaylist] = useState<IPlaylist | undefined>(undefined);

  // Shared store state
  const [setHeaderTitle] = useSharedStore((state) => [state.setHeaderTitle]);

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

  // Get playlist on component mount.
  // eslint-disable-next-line
  const playlistQuery = useQuery(['playlist', id], () => playlistGet(id), {
    refetchOnWindowFocus: false,
    onError: (error: unknown) => {
      console.error('Error on getting profile:', error);
    },
    onSuccess: (data) => {
      setPlaylist(data);
      // Wait for transition animation
      setTimeout(() => {
        setHeaderTitle(data?.name);
      }, 500);
    },
  });

  // ######### //
  // MUTATIONS //
  // ######### //

  // GET Playlist tracks mutation
  const playlistTracksGetMutation = useMutation(
    (data: { id: string; params?: PlaylistsGetParams }) =>
      playlistTracksGet(data),
    {
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Add playlist tracks
  useEffect(() => {
    if (playlistTracksGetMutation.data) {
      playlist &&
        setPlaylist(
          playlistTracksGetEffect(
            playlistTracksGetMutation.data.items,
            playlist
          )
        );
    }
    if (playlistTracksGetMutation.error) {
      const errRes = playlistTracksGetMutation.error?.response;
      if (errRes) {
        handleError(errRes.status);
      }
    }
    // eslint-disable-next-line
  }, [playlistTracksGetMutation.data, playlistTracksGetMutation.error]);

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

  // Reset playlist on id change
  useEffect(() => {
    playlist && setPlaylist(undefined);
    // Reset header title
    return () => {
      setHeaderTitle(undefined);
    };
    // eslint-disable-next-line
  }, [id]);

  // ######### //
  // CALLBACKS //
  // ######### //

  /**
   * Handler to add tracks to playlist.
   */
  const onAddTracks = useCallback(() => {
    if (
      playlist?.id &&
      playlist?.tracks.items.length < playlist?.tracks.total
    ) {
      playlistTracksGetMutation.mutate({
        id: playlist.id,
        params: { limit: 100, offset: playlist.tracks.items.length },
      });
    }
    // eslint-disable-next-line
  }, [playlist]);

  /**
   * Handler to play track from playlist.
   */
  const onTrackPlay = useCallback((playlistUri: string, trackUri: string) => {
    playPutMutation.mutate({
      body: {
        context_uri: playlistUri,
        offset: { uri: trackUri },
      },
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {!playlist && playlistQuery.isLoading && <CircularProgress />}
      {playlist && (
        <InfiniteScroll
          className={styles['playlist']}
          dataLength={playlist?.tracks.items.length}
          hasMore={true}
          loader={null}
          next={onAddTracks}
          scrollThreshold={1}
        >
          <div className={styles['playlist-header']}>
            <div className={styles['playlist-header-img']}>
              <img
                alt={`${t('playlists.detail.title')} ${playlist.name}`}
                src={playlist.images[0].url}
              />
            </div>
            <div className={styles['playlist-header-info']}>
              <div className={styles['playlist-header-info-meta']}>
                <div className={styles['playlist-header-info-meta-type']}>
                  {t('playlists.detail.title')}
                </div>
                <div className={styles['playlist-header-info-meta-public']}>
                  {playlist.public
                    ? t('playlists.detail.public.true')
                    : t('playlists.detail.public.false')}
                </div>
              </div>
              <H2>{playlist.name}</H2>
              <div className={styles['playlist-header-info-description']}>
                {playlist.description}
              </div>
              <div className={styles['playlist-header-info-tracks']}>
                {playlist.owner.display_name} • {playlist.tracks.total}{' '}
                {t('playlists.detail.tracks')}
              </div>
            </div>
          </div>
          <div className={styles['playlist-content']}>
            {playlist.tracks.items.map((track, index) => (
              <PlaylistTrack
                key={track.track.id}
                locale={i18n.language}
                track={track}
                trackIndex={index + 1}
                onPlay={() => onTrackPlay(playlist.uri, track.track.uri)}
              />
            ))}
            {playlistTracksGetMutation.isLoading && <CircularProgress />}
          </div>
        </InfiniteScroll>
      )}
    </>
  );
};

export default memo(Playlist);
