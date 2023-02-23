import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress, Tooltip } from '@mui/material';
import clsx from 'clsx';

// Components
import PlaylistTrack from '../../components/PlaylistTrack/PlaylistTrack';

// Hooks
import useFetch from '../../../../shared/hooks/use-fetch.hook';
import useObjectURL from '../../../../shared/hooks/use-object-url.hook';
import usePlayerHttp from '../../../../shared/hooks/use-player-http.hook';
import usePlaylist from '../../use-playlist.hook';
import usePlaylistHttp from '../../use-playlist-http.hook';

// Styles
import styles from './Playlist.module.scss';

// Stores
import useSharedStore from '../../../../shared/stores/use-shared.store';
import useUserStore from '../../../user/use-user.store';

// Types
import {
  PlaylistsGetParams,
  Playlist as IPlaylist,
  PlaylistFollowPutRequest,
  PlaylistMoreMenuItemAction,
} from '../../playlist.types';
import { ButtonType } from '../../../../shared/types/ui.types';

// UI
import H2 from '../../../../shared/ui/H2/H2';
import IconButton from '../../../../shared/ui/IconButton/IconButton';
import Menu from '../../../../shared/ui/Menu/Menu';

// Utils
import { playlistCreate } from '../../playlist.utils';

const Playlist = () => {
  const { handleError, handleRetry } = useFetch();
  const { objectURL, setObject } = useObjectURL(null);
  const { id } = useParams();
  const { playPutMutation } = usePlayerHttp();
  const { playlistTracksGetEffect } = usePlaylist();
  const {
    playlistGet,
    playlistFollowDelete,
    playlistfollowGet,
    playlistFollowPut,
    playlistTracksGet,
  } = usePlaylistHttp();
  const { i18n, t } = useTranslation();

  // Refs
  const downloadMetadataRef = useRef<HTMLAnchorElement>(null);

  // Shared store state
  const [following, setHeaderTitle, setFollowing, setNotifcation] =
    useSharedStore((state) => [
      state.following,
      state.setHeaderTitle,
      state.setFollowing,
      state.setNotification,
    ]);

  // User store state
  const [profile] = useUserStore((state) => [state.profile]);

  // Component state
  const [playlist, setPlaylist] = useState<IPlaylist | undefined>(undefined);

  // Constants
  const moreMenuItems = [
    {
      action: PlaylistMoreMenuItemAction.Delete,
      title:
        playlist?.owner.id === profile?.id
          ? t('app.follow.delete.title')
          : t('app.actions.delete'),
    },
    {
      action: PlaylistMoreMenuItemAction.DownloadMetadata,
      title: t('app.actions.download_metadata'),
    },
  ];

  // ####### //
  // QUERIES //
  // ####### //

  // Get playlist following state by id.
  // eslint-disable-next-line
  const followingQuery = useQuery(
    ['following', id, profile?.id],
    () =>
      playlistfollowGet(id ?? '', {
        ids: profile?.id ? [profile?.id] : [],
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error(
            'Error on getting following state for playlist:',
            error
          );
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        data && setFollowing(data[0]);
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get playlist on component mount.
  // eslint-disable-next-line
  const playlistQuery = useQuery(['playlist', id], () => playlistGet(id), {
    refetchOnWindowFocus: false,
    onError: (error: any) => {
      const errRes = error?.response;
      if (errRes) {
        console.error('Error on getting playlist:', error);
        handleError(errRes.status);
      }
    },
    onSuccess: (data) => {
      if (data) {
        const mappedPlaylist = playlistCreate(data);
        setPlaylist(mappedPlaylist);
        const output = JSON.stringify({ playlist: mappedPlaylist }, null, 4);
        const blob = new Blob([output]);
        setObject(blob);
        // Wait for transition animation
        setTimeout(() => {
          setHeaderTitle(data?.name);
        }, 500);
      }
    },
  });

  // ######### //
  // MUTATIONS //
  // ######### //

  // GET Playlist follow delete mutation
  const playlistFollowDeleteMutation = useMutation(
    (id: string) => playlistFollowDelete(id),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        setFollowing(false);
        setNotifcation({
          title: `${playlist?.name} ${t('app.follow.delete.success')}`,
        });
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // GET Playlist follow put mutation
  const playlistFollowPutMutation = useMutation(
    (data: { id: string; body?: PlaylistFollowPutRequest }) =>
      playlistFollowPut(data),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        setFollowing(true);
        setNotifcation({
          title: `${playlist?.name} ${t('app.follow.put.success')}`,
        });
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // GET Playlist tracks mutation
  const playlistTracksGetMutation = useMutation(
    (data: { id: string; params?: PlaylistsGetParams }) =>
      playlistTracksGet(data),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        data &&
          playlist &&
          setPlaylist(playlistTracksGetEffect(data.items, playlist));
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
    if (playlist?.id && playlist?.tracks.length < playlist?.tracks_total) {
      playlistTracksGetMutation.mutate({
        id: playlist.id,
        params: { limit: 100, offset: playlist.tracks.length },
      });
    }
    // eslint-disable-next-line
  }, [playlist]);

  /**
   * Handler to change following state.
   */
  const onFollowingStateChange = useCallback(() => {
    if (id) {
      if (following) {
        playlistFollowDeleteMutation.mutate(id);
      } else {
        playlistFollowPutMutation.mutate({ id });
      }
    }
    // eslint-disable-next-line
  }, [following, id]);

  /**
   * Handler on more menu action.
   */
  const onMoreMenuAction = useCallback(
    (action: PlaylistMoreMenuItemAction) => {
      action === PlaylistMoreMenuItemAction.Delete &&
        id &&
        playlistFollowDeleteMutation.mutate(id);
      action === PlaylistMoreMenuItemAction.DownloadMetadata &&
        downloadMetadataRef.current &&
        downloadMetadataRef.current.click();
    },
    // eslint-disable-next-line
    [downloadMetadataRef, id]
  );

  /**
   * @param contextUri Spotify URI of the context to play
   * @param trackUri Track URI
   */
  const onTrackPlay = useCallback((contextUri: string, trackUri?: string) => {
    playPutMutation.mutate({
      body: {
        context_uri: contextUri,
        offset: { uri: trackUri },
      },
    });
    // eslint-disable-next-line
  }, []);

  /**
   * Handler to download playlist meta data.
   */
  const onPlaylistMetaDataDownload = useCallback(() => {
    const output = JSON.stringify({ playlist: playlist }, null, 4);
    // Create file data
    const blob = new Blob([output]);
    setObject(blob);
    // eslint-disable-next-line
  }, [playlist]);

  return (
    <>
      {!playlist && playlistQuery.isLoading && <CircularProgress />}
      {playlist && (
        <InfiniteScroll
          className={styles['playlist']}
          dataLength={playlist?.tracks.length}
          hasMore={true}
          loader={null}
          next={onAddTracks}
          scrollThreshold={1}
        >
          <section className={styles['playlist-header']}>
            {playlist.images[0]?.url && (
              <div className={styles['playlist-header-image']}>
                <img
                  alt={`${t('playlist.detail.title')} ${playlist.name}`}
                  src={playlist.images[0].url}
                  onClick={onPlaylistMetaDataDownload}
                />
              </div>
            )}
            <div
              className={clsx(
                styles['playlist-header-info'],
                playlist.images[0]?.url &&
                  styles['playlist-header-info-padding']
              )}
            >
              <div className={styles['playlist-header-info-meta']}>
                <div className={styles['playlist-header-info-meta-type']}>
                  {t('playlist.detail.title')}
                </div>
                <div className={styles['playlist-header-info-meta-public']}>
                  {playlist.public
                    ? t('playlist.detail.public.true')
                    : t('playlist.detail.public.false')}
                </div>
              </div>
              <H2>{playlist.name}</H2>
              <div className={styles['playlist-header-info-description']}>
                {playlist.description}
              </div>
              <div className={styles['playlist-header-info-tracks']}>
                {playlist.owner.display_name} • {playlist.tracks_total}{' '}
                {t('playlist.detail.tracks')}
              </div>
            </div>
          </section>
          <section className={styles['playlist-actions']}>
            <IconButton
              borderRadius="rounded-full"
              icon={['fas', 'play']}
              iconSize="medium"
              padding="1rem"
              preset={ButtonType.Primary}
              sx={{
                svg: {
                  transform: 'translateX(2px)',
                },
              }}
              onClick={() =>
                playPutMutation.mutate({
                  body: {
                    context_uri: playlist.uri,
                  },
                })
              }
            />
            {following !== undefined && playlist.owner.id !== profile?.id && (
              <Tooltip
                placement="top"
                title={
                  following
                    ? t('app.follow.delete.title')
                    : t('app.follow.put.title')
                }
              >
                <IconButton
                  classes={styles['playlist-actions-follow']}
                  color={following ? 'primary' : 'secondary'}
                  icon={[following ? 'fas' : 'far', 'heart']}
                  iconSize="medium"
                  onClick={onFollowingStateChange}
                />
              </Tooltip>
            )}
            <Menu
              anchorOrigin={{
                horizontal: 'right',
                vertical: 'top',
              }}
              classes={styles['playlist-actions-more']}
              icon={['fas', 'ellipsis']}
              iconSize="medium"
              items={moreMenuItems}
              sx={{ color: 'text.secondary' }}
              tooltip={`${t('app.actions.title').toString()} ${playlist.name}`}
              transformOrigin={{
                horizontal: 'left',
                vertical: 'top',
              }}
              onAction={onMoreMenuAction}
            />
          </section>
          <section className={styles['playlist-content']}>
            {playlist.tracks.map((track) => (
              <PlaylistTrack
                key={track.id}
                locale={i18n.language}
                track={track}
                onPlay={() => onTrackPlay(playlist.uri, track.uri)}
              />
            ))}
            {playlistTracksGetMutation.isLoading && <CircularProgress />}
          </section>
          {objectURL && (
            // eslint-disable-next-line
            <a
              className="invisible"
              download={`${playlist.name}.json`}
              href={objectURL}
              ref={downloadMetadataRef}
              rel="noreferrer"
              target="_blank"
            />
          )}
        </InfiniteScroll>
      )}
    </>
  );
};

export default memo(Playlist);
