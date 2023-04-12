import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isMobile } from 'react-device-detect';
import { CircularProgress, Tooltip } from '@mui/material';
import clsx from 'clsx';

// Components
import ImageFallback from '../../../../shared/components/ImageFallback/ImageFallback';
import PlaylistTrack from '../../components/PlaylistTrack/PlaylistTrack';

// Hooks
import useFetch from '../../../../shared/hooks/use-fetch.hook';
import useObjectURL from '../../../../shared/hooks/use-object-url.hook';
import usePlayerHttp from '../../../../shared/hooks/use-player-http.hook';
import usePlaylist from '../../use-playlist.hook';
import usePlaylistHttp from '../../use-playlist-http.hook';
import useTrackHttp from '../../../../shared/hooks/use-track-http.hook';

// Styles
import styles from './Playlist.module.scss';

// Stores
import usePlaylistStore from '../../use-playlist.store';
import useSharedStore from '../../../../shared/stores/use-shared.store';
import useUserStore from '../../../user/use-user.store';

// Types
import {
  PlaylistsGetParams,
  Playlist as IPlaylist,
  PlaylistFollowPutRequest,
  PlaylistAction,
  PlaylistTrackAction,
  PlaylistItemsRemoveDeleteRequest,
  PlaylistTrack as IPlaylistTrack,
  PlaylistUpdateRequest,
} from '../../playlist.types';
import {
  ImageFallbackType,
  MenuItem,
} from '../../../../shared/types/shared.types';
import { SaveTracksPutRequest } from '../../../../shared/types/track.types';
import { ButtonType } from '../../../../shared/types/ui.types';

// UI
import Dialog from '../../../../shared/ui/Dialog/Dialog';
import H2 from '../../../../shared/ui/H2/H2';
import IconButton from '../../../../shared/ui/IconButton/IconButton';
import Link from '../../../../shared/ui/Link/Link';
import Menu from '../../../../shared/ui/Menu/Menu';

// Utils
import {
  playlistCreate,
  removePlaylistItemsEffect,
} from '../../playlist.utils';
import { setTitle } from '../../../../shared/utils/shared.utils';
import DetailDrawer from '../../../../shared/components/DetailDrawer/DetailDrawer';
import PlaylistEditDetails from '../../components/PlaylistEditDetails/PlaylistEditDetails';

const Playlist = () => {
  const { handleError, handleRetry } = useFetch();
  const navigate = useNavigate();
  const { objectURL, setObject } = useObjectURL(null);
  const { id } = useParams();
  const { playPutMutation } = usePlayerHttp();
  const { playlistTracksGetEffect, playlistDeleteEffect } = usePlaylist();
  const {
    playlistGet,
    playlistUpdate,
    playlistFollowDelete,
    playlistFollowGet,
    playlistFollowPut,
    playlistTracksGet,
    playlistTracksDelete,
  } = usePlaylistHttp();
  const { saveTracks } = useTrackHttp();
  const { i18n, t } = useTranslation();

  // Refs
  const downloadMetadataRef = useRef<HTMLAnchorElement>(null);

  // Component state
  const [dialogDetailsEdit, setDialogDetailsEdit] = useState<boolean>(false);
  const [drawerDetailsEdit, setDrawerDetailsEdit] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<IPlaylist | undefined>(undefined);

  // Playlists store state
  const [playlists, setPlaylists] = usePlaylistStore((state) => [
    state.playlists,
    state.setPlaylists,
  ]);

  // Shared store state
  const [following, setHeaderTitle, setFollowing, setNotification] =
    useSharedStore((state) => [
      state.following,
      state.setHeaderTitle,
      state.setFollowing,
      state.setNotification,
    ]);

  // User store state
  const [profile] = useUserStore((state) => [state.profile]);

  // Constants
  const moreMenuItems: MenuItem[] = [
    {
      action: PlaylistAction.EditDetails,
      title: t('playlist.detail.action.edit_details.title'),
      undefined: playlist?.owner.id !== profile?.id,
    },
    {
      action: PlaylistAction.Delete,
      title:
        playlist?.owner.id === profile?.id
          ? t('app.actions.delete')
          : t('app.save.delete.title'),
    },
    {
      action: playlist?.public
        ? PlaylistAction.MakePrivate
        : PlaylistAction.MakePublic,
      title: playlist?.public
        ? t('playlist.detail.action.make_private.title')
        : t('playlist.detail.action.make_public.title'),
      undefined: playlist?.owner.id !== profile?.id,
    },
    {
      action: PlaylistAction.DownloadMetadata,
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
      playlistFollowGet(id ?? '', {
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
        // Set mapped playlist data
        const mappedPlaylist = playlistCreate(data);
        setPlaylist(mappedPlaylist);

        // Create meta download blob
        const output = JSON.stringify({ playlist: mappedPlaylist }, null, 4);
        const blob = new Blob([output]);
        setObject(blob);

        setTitle(data.name);

        // Wait for transition animation
        setTimeout(() => {
          setHeaderTitle(data.name);
        }, 500);
      }
    },
  });

  // ######### //
  // MUTATIONS //
  // ######### //

  // PUT Update playlist mutation
  const playlistUpdateMutation = useMutation(
    (data: {
      id: string;
      action: PlaylistAction;
      body: PlaylistUpdateRequest;
    }) => playlistUpdate(data),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on updating playlist:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data, variables) => {
        if (playlist && variables.action === PlaylistAction.EditDetails) {
          // Update playlist details
          const updatedPlaylist = { ...playlist };
          setPlaylist({
            ...updatedPlaylist,
            description: variables.body.description ?? '',
            name: variables.body.name ?? '',
          });

          // Update sidebar playlists
          const updatedPlaylists = { ...playlists };
          const matchedPlaylist = updatedPlaylists.items.find(
            (playlist) => playlist.id === variables.id
          );
          if (matchedPlaylist) {
            matchedPlaylist.description = variables.body.description ?? '';
            matchedPlaylist.name = variables.body.name ?? '';
          }
          setPlaylists(updatedPlaylists);

          // Close dialog and set notification
          setDialogDetailsEdit(false);
          setNotification({
            title: t('playlist.detail.action.edit_details.success'),
          });
        }
        if (playlist && variables.action === PlaylistAction.MakePrivate) {
          setPlaylist({ ...playlist, public: false });
          setNotification({
            title: t('playlist.detail.action.make_private.success'),
          });
        }
        if (playlist && variables.action === PlaylistAction.MakePublic) {
          setPlaylist({ ...playlist, public: true });
          setNotification({
            title: t('playlist.detail.action.make_public.success'),
          });
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

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
      onSuccess: (data, variables) => {
        setFollowing(false);
        playlistDeleteEffect(variables);
        navigate('/library');
        setNotification({
          title: `${playlist?.name} ${t('app.save.delete.success')}`,
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
        setNotification({
          title: `${playlist?.name} ${t('app.save.put.success')}`,
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
          title: t('track.action.add.success'),
        });
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // DELETE Remove playlist items mutation
  const removeItemsDeleteMutation = useMutation(
    (data: { id: string; body: PlaylistItemsRemoveDeleteRequest }) =>
      playlistTracksDelete(data),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data, variables) => {
        playlist &&
          setPlaylist(
            removePlaylistItemsEffect(playlist, variables.body.tracks)
          );
        setNotification({
          timeout: 3000,
          title: t('playlist.detail.track.action.remove_from_playlist.success'),
        });
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // ####### //
  // EFFECTS //
  // ####### //

  // Reset data on id change.
  useEffect(() => {
    return () => {
      setHeaderTitle(undefined);
      setPlaylist(undefined);
      setTitle();
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
   * Handler to edit playlist details.
   * @param body PlaylistUpdateRequest
   */
  const onEditDetails = useCallback(
    (body: PlaylistUpdateRequest) => {
      id &&
        playlistUpdateMutation.mutate({
          id,
          action: PlaylistAction.EditDetails,
          body: {
            description:
              body.description && body.description.length > 1
                ? body.description
                : undefined,
            name: body.name,
          },
        });
    },
    // eslint-disable-next-line
    [id]
  );

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
    (action: PlaylistAction) => {
      action === PlaylistAction.Delete &&
        id &&
        playlistFollowDeleteMutation.mutate(id);
      action === PlaylistAction.DownloadMetadata &&
        downloadMetadataRef.current &&
        downloadMetadataRef.current.click();
      action === PlaylistAction.EditDetails &&
        id &&
        isMobile &&
        setDrawerDetailsEdit(true);
      action === PlaylistAction.EditDetails &&
        id &&
        !isMobile &&
        setDialogDetailsEdit(true);
      action === PlaylistAction.MakePrivate &&
        id &&
        playlistUpdateMutation.mutate({
          id,
          action: PlaylistAction.MakePrivate,
          body: {
            public: false,
          },
        });
      action === PlaylistAction.MakePublic &&
        id &&
        playlistUpdateMutation.mutate({
          id,
          action: PlaylistAction.MakePublic,
          body: {
            public: true,
          },
        });
    },
    // eslint-disable-next-line
    [downloadMetadataRef, id]
  );

  /**
   * Handler on playlist track action.
   * @param track PlaylistTrack
   * @param action PlaylistTrackAction
   */
  const onTrackAction = useCallback(
    (track: IPlaylistTrack, action: PlaylistTrackAction) => {
      switch (action) {
        case PlaylistTrackAction.Add:
          saveTracksPutMutation.mutate({ ids: [track.id] });
          break;
        case PlaylistTrackAction.ShowAlbum:
          navigate(`/album/${track.album.id}`);
          break;
        case PlaylistTrackAction.ShowArtist:
          navigate(`/artist/${track.artists[0].id}`);
          break;
        case PlaylistTrackAction.RemoveFromPlaylist:
          id &&
            removeItemsDeleteMutation.mutate({
              id,
              body: {
                tracks: [
                  {
                    uri: track.uri,
                  },
                ],
              },
            });
          break;
        default:
          break;
      }
    },
    // eslint-disable-next-line
    [id]
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
            <div className={styles['playlist-header-image']}>
              {playlist.images[0]?.url ? (
                <img
                  alt={`${t('playlist.detail.title')} ${playlist.name}`}
                  src={playlist.images[0].url}
                  onClick={onPlaylistMetaDataDownload}
                />
              ) : (
                <ImageFallback type={ImageFallbackType.Playlist} />
              )}
            </div>
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
                <Link to={`/user/${playlist.owner.id}`}>
                  {playlist.owner.display_name}
                </Link>
                <span className="whitespace-pre-wrap"> </span>
                {' • '}
                {playlist.tracks_total} {t('playlist.detail.tracks')}
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
                    ? t('app.save.delete.title')
                    : t('app.save.put.title')
                }
              >
                <IconButton
                  classes={styles['playlist-actions-follow']}
                  color={following ? 'primary' : 'inherit'}
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
            {playlist.tracks.map((track, index) => (
              <PlaylistTrack
                key={track.id}
                index={index}
                locale={i18n.language}
                owner={playlist.owner.id === profile?.id}
                track={track}
                onAction={(action) => onTrackAction(track, action)}
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
      {isMobile && playlist && (
        <DetailDrawer
          open={drawerDetailsEdit}
          title={t('playlist.detail.action.edit_details.title')}
          onClose={() => setDrawerDetailsEdit(false)}
        >
          <PlaylistEditDetails
            playlist={playlist}
            onClose={() => setDrawerDetailsEdit(false)}
            onSubmit={onEditDetails}
          />
        </DetailDrawer>
      )}
      {!isMobile && playlist && (
        <Dialog
          open={dialogDetailsEdit && !!playlist}
          title={t('playlist.detail.action.edit_details.title')}
          onClose={() => setDialogDetailsEdit(false)}
        >
          {/* <form
            className={styles['playlist-details-dialog']}
            onSubmit={handleSubmit(onEditDetails)}
          >
            {errors?.name && (
              <Box
                className={styles['playlist-details-dialog-error']}
                sx={{ backgroundColor: 'error.main', color: 'white' }}
              >
                <Icon
                  classes={styles['playlist-details-dialog-error-icon']}
                  icon={['fas', 'exclamation-triangle']}
                  htmlColor="#ffffff"
                />
                {errors.name.message}
              </Box>
            )}
            <div className={styles['playlist-details-dialog-form']}>
              <div className={styles['playlist-details-dialog-form-cover']}>
                {playlist.images[0]?.url ? (
                  <img
                    alt={`${t('playlist.detail.title')} ${playlist.name}`}
                    src={playlist.images[0].url}
                  />
                ) : (
                  <ImageFallback type={ImageFallbackType.Playlist} />
                )}
              </div>
              <div className={styles['playlist-details-dialog-form-inputs']}>
                <Input
                  classes="mb-4"
                  label={t(
                    'playlist.detail.action.edit_details.name.label'
                  ).toString()}
                  placeholder={t(
                    'playlist.detail.action.edit_details.name.placeholder'
                  ).toString()}
                  register={register('name')}
                  state={errors?.name && ResultState.Error}
                />
                <Input
                  fullHeight
                  label={t(
                    'playlist.detail.action.edit_details.description.label'
                  ).toString()}
                  placeholder={t(
                    'playlist.detail.action.edit_details.description.placeholder'
                  ).toString()}
                  multiline={6}
                  register={register('description')}
                />
              </div>
            </div>
            <TextButtonOutlined
              classes={styles['playlist-details-dialog-form-save']}
              type="submit"
            >
              {t('app.save.title')}
            </TextButtonOutlined>
            <div className={styles['playlist-details-dialog-form-disclaimer']}>
              {t('playlist.detail.action.edit_details.disclaimer')}
            </div>
          </form> */}
          <PlaylistEditDetails
            playlist={playlist}
            onClose={() => setDialogDetailsEdit(false)}
            onSubmit={onEditDetails}
          />
        </Dialog>
      )}
    </>
  );
};

export default memo(Playlist);
