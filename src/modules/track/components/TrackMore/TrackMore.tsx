import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Components
import DetailDrawer from '../../../../shared/components/DetailDrawer/DetailDrawer';
import PlaylistAddTrack from '../../../playlist/components/PlaylistAddTrack/PlaylistAddTrack';

// Hooks
import useFetch from '../../../../shared/hooks/use-fetch.hook';
import usePlaylist from '../../../playlist/use-playlist.hook';
import usePlaylistHttp from '../../../playlist/use-playlist-http.hook';
import useTrack from '../../hooks/use-track.hook';
import useTrackHttp from '../../hooks/use-track-http.hook';

// Stores
import usePlaylistStore from '../../../playlist/use-playlist.store';
import useSharedStore from '../../../../shared/stores/use-shared.store';

// Styles
import styles from './TrackMore.module.scss';

// Types
import { PlaylistItemsRemoveDeleteRequest } from '../../../playlist/playlist.types';
import {
  ImageFallbackType,
  TrackAction,
} from '../../../../shared/types/shared.types';
import { Track } from '../../track.types';

// UI
import Dialog from '../../../../shared/ui/Dialog/Dialog';
import IconButton from '../../../../shared/ui/IconButton/IconButton';
import Menu from '../../../../shared/ui/Menu/Menu';

// Utils
import { removePlaylistItemsEffect } from '../../../playlist/playlist.utils';
import { minutesSecondsByMillisecondsGet } from '../../../../shared/utils/shared.utils';

type TrackMoreProps = {
  duration: number;
  image?: string;
  owner?: boolean;
  playlistId?: string;
  subtitle?: string;
  title: string;
  track: Track;
  type: ImageFallbackType;
};

const TrackMore = (props: TrackMoreProps) => {
  const { handleError, handleRetry } = useFetch();
  const navigate = useNavigate();
  const { playlistTrackActionsGet } = usePlaylist();
  const { playlistTracksDelete } = usePlaylistHttp();
  const { trackActionsGet } = useTrack();
  const { t } = useTranslation();
  const { saveTracksPutMutation } = useTrackHttp();

  // Get track actions by type
  let trackActions = trackActionsGet();
  if (props.type === ImageFallbackType.Playlist) {
    trackActions = playlistTrackActionsGet(props.owner);
  }

  // Playlists store state
  const [addTrackToPlaylist, playlist, setAddTrackToPlaylist, setPlaylist] =
    usePlaylistStore((state) => [
      state.addTrackToPlaylist,
      state.playlist,
      state.setAddTrackToPlaylist,
      state.setPlaylist,
    ]);

  // Shared store state
  const [setNotification] = useSharedStore((state) => [state.setNotification]);

  // ######### //
  // MUTATIONS //
  // ######### //

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

  // Component state
  const [detailDrawer, setDetailDrawer] = useState<boolean>(false);

  // ######### //
  // CALLBACKS //
  // ######### //

  /**
   * Handler on playlist track action.
   * @param track PlaylistTrack
   * @param albumId Album id
   * @param action PlaylistTrackAction
   */
  const onTrackAction = useCallback(
    (action: TrackAction) => {
      switch (action) {
        case TrackAction.AddToPlaylist:
          setAddTrackToPlaylist(props.track.uri);
          break;
        case TrackAction.Favorite:
          saveTracksPutMutation.mutate(
            { ids: [props.track.id] },
            {
              onSuccess: () => setDetailDrawer(false),
            }
          );
          break;
        case TrackAction.ShowAlbum:
          navigate(`/album/${props.track.album.id}`);
          break;
        case TrackAction.ShowArtist:
          navigate(`/artist/${props.track.artists[0].id}`);
          break;
        case TrackAction.RemoveFromPlaylist:
          props.playlistId &&
            removeItemsDeleteMutation.mutate({
              id: props.playlistId,
              body: {
                tracks: [
                  {
                    uri: props.track.uri,
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
    [props.playlistId, props.track]
  );

  return (
    <Box className={styles['track-more']} sx={{ color: 'text.secondary' }}>
      {!isMobile && (
        <IconButton
          classes="favorite"
          icon={['far', 'heart']}
          onClick={() => onTrackAction(TrackAction.Favorite)}
        />
      )}
      <span className={styles['track-more-duration']}>
        {minutesSecondsByMillisecondsGet(props.duration)}
      </span>
      {isMobile ? (
        <IconButton
          classes={styles['track-more-button']}
          icon={['fas', 'ellipsis-v']}
          onClick={() => setDetailDrawer(true)}
        />
      ) : (
        <Menu
          classes={clsx(styles['track-more-button'], 'more')}
          hideItemIcon
          icon={['fas', 'ellipsis']}
          items={trackActions}
          onAction={onTrackAction}
        />
      )}
      <DetailDrawer
        actionItems={trackActions}
        image={props.image}
        open={detailDrawer}
        subtitle={props.subtitle}
        title={props.title}
        type={props.type}
        onAction={onTrackAction}
        onClose={() => setDetailDrawer(false)}
      >
        <DetailDrawer
          open={!!addTrackToPlaylist}
          title={t('track.action.add_to_playlist.title')}
          onClose={() => setAddTrackToPlaylist(undefined)}
        >
          <PlaylistAddTrack
            scrollableTarget="drawer-content"
            uri={addTrackToPlaylist ?? ''}
            onClose={() => setDetailDrawer(false)}
          />
        </DetailDrawer>
      </DetailDrawer>
      {!isMobile && (
        <Dialog
          open={!!addTrackToPlaylist && !!playlist}
          title={t('track.action.add_to_playlist.title')}
          widthClassName={styles['dialog-add-track-to-playlist-width']}
          onClose={() => setAddTrackToPlaylist(undefined)}
        >
          <PlaylistAddTrack
            scrollableTarget="dialog-content"
            uri={addTrackToPlaylist ?? ''}
            onClose={() => setDetailDrawer(false)}
          />
        </Dialog>
      )}
    </Box>
  );
};

export default memo(TrackMore);
