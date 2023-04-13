import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, Button, CircularProgress } from '@mui/material';
import clsx from 'clsx';

// Components
import ImageFallback from '../../../../shared/components/ImageFallback/ImageFallback';

// Hooks
import usePlaylistHttp from '../../use-playlist-http.hook';

// Stores
import useAuthStore from '../../../auth/use-auth.store';
import usePlaylistStore from '../../use-playlist.store';
import useUserStore from '../../../user/use-user.store';

// Styles
import styles from './PlaylistAddTrack.module.scss';

// Types
import { ImageFallbackType } from '../../../../shared/types/shared.types';
import { SpotifyPlaylist } from '../../../../shared/types/spotify.types';

type PlaylistItemProps = {
  playlist: SpotifyPlaylist;
  onClick: () => void;
};

const PlaylistItem = (props: PlaylistItemProps) => {
  const { t } = useTranslation();

  return (
    <Button
      className={styles['playlist-item']}
      sx={{
        '@media (hover: hover)': {
          ':hover': {
            backgroundColor: 'action.hover',
          },
        },
      }}
      onClick={props.onClick}
    >
      <div className={clsx(styles['playlist-item-image'], 'image')}>
        {(props.playlist.images[0] && props.playlist.images[0].url) ||
        (props.playlist.images[1] && props.playlist.images[1].url) ? (
          <img
            alt={props.playlist.name}
            src={
              props.playlist.images[1] && props.playlist.images[1].url
                ? props.playlist.images[1].url
                : props.playlist.images[0].url
            }
          />
        ) : (
          <ImageFallback
            classes="sm:rounded-md"
            type={ImageFallbackType.Playlist}
          />
        )}
      </div>
      <div className={styles['playlist-item-info']}>
        <Box
          className={styles['playlist-item-info-name']}
          sx={{ color: 'text.primary' }}
        >
          {props.playlist.name}
        </Box>
        <Box
          className={styles['playlist-item-info-owner']}
          sx={{ color: 'text.secondary' }}
        >
          {props.playlist.owner.id !== 'spotify'
            ? `${t('app.from')} ${props.playlist.owner.display_name}`
            : props.playlist.description}
        </Box>
      </div>
    </Button>
  );
};

type PlaylistAddTrackProps = {
  scrollableTarget: 'dialog-content' | 'drawer-content';
  uri: string;
};

const PlaylistAddTrack = (props: PlaylistAddTrackProps) => {
  const { playlistsAddMutation, playlistTracksPostMutation } =
    usePlaylistHttp();

  // Auth store state
  const [token] = useAuthStore((state) => [state.token]);

  // Playlists store state
  const [playlists] = usePlaylistStore((state) => [state.playlists]);

  // User store state
  const [profile] = useUserStore((state) => [state.profile]);

  // ######### //
  // CALLBACKS //
  // ######### //

  /**
   * Handler to add playlists.
   */
  const onAddPlaylists = useCallback(() => {
    if (playlists.items.length < playlists.total) {
      playlistsAddMutation.mutate({
        id: profile?.id ?? '',
        params: {
          limit: 25,
          offset: playlists.offset,
        },
      });
    }
    // eslint-disable-next-line
  }, [playlists, profile?.id]);

  return (
    <InfiniteScroll
      className={styles['playlist-add-track']}
      dataLength={playlists.items.length}
      hasMore={!!token}
      loader={null}
      next={onAddPlaylists}
      scrollableTarget={props.scrollableTarget}
      scrollThreshold={1}
    >
      {playlists.items
        .filter((playlist) => playlist.owner.id === profile?.id)
        .map((playlist) => (
          <PlaylistItem
            key={playlist.id}
            playlist={playlist}
            onClick={() =>
              playlistTracksPostMutation.mutate({
                id: playlist.id,
                uris: [props.uri],
              })
            }
          />
        ))}
      {playlistsAddMutation.isLoading && <CircularProgress />}
    </InfiniteScroll>
  );
};

export default memo(PlaylistAddTrack);
