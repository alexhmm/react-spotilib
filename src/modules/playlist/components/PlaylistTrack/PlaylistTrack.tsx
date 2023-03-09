import { memo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Components
import DetailDrawer from '../../../../shared/components/DetailDrawer/DetailDrawer';

// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';
import usePlaylist from '../../use-playlist.hook';

// Styles
import styles from './PlaylistTrack.module.scss';

// Types
import {
  PlaylistTrack as IPlaylistTrack,
  PlaylistTrackAction,
} from '../../playlist.types';
import { ImageFallbackType } from '../../../../shared/types/shared.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';
import Link from '../../../../shared/ui/Link/Link';
import Menu from '../../../../shared/ui/Menu/Menu';

// Utils
import { minutesSecondsByMillisecondsGet } from '../../../../shared/utils/shared.utils';

type PlaylistTrackProps = {
  locale: string;
  index: number;
  owner?: boolean;
  track: IPlaylistTrack;
  onAction: (action: PlaylistTrackAction) => void;
  onPlay: () => void;
};

const playlistPropsAreEqual = (
  prevProps: Readonly<PlaylistTrackProps>,
  nextProps: Readonly<PlaylistTrackProps>
): boolean => {
  if (
    prevProps.index === nextProps.index &&
    prevProps.locale === nextProps.locale &&
    prevProps.owner === nextProps.owner &&
    prevProps.track.id === nextProps.track.id
  ) {
    return true;
  }
  return false;
};

const PlaylistTrack = (props: PlaylistTrackProps) => {
  const { smDown } = useBreakpoints();
  const { playlistTrackActionsGet } = usePlaylist();

  // Component state
  const [detailDrawer, setDetailDrawer] = useState<boolean>(false);

  return (
    <Box
      className={styles['playlist-track']}
      sx={{
        '@media (hover: hover)': {
          ':hover': {
            backgroundColor: 'action.hover',
            '.index': {
              display: 'none',
            },
            '.more': {
              visibility: 'visible',
            },
            '.play': {
              display: 'flex !important',
            },
          },
          '.app-link:hover': {
            color: 'primary.main',
          },
          '.more': {
            visibility: 'hidden',
          },
          '.play': {
            display: 'none !important',
          },
        },
      }}
    >
      <div
        className={styles['playlist-track-title']}
        onClick={() => isMobile && props.onPlay()}
      >
        <Box
          className={clsx(styles['playlist-track-title-index'], 'index')}
          sx={{ color: 'text.secondary' }}
        >
          {props.index + 1}
        </Box>
        {!isMobile && !smDown && (
          <IconButton
            classes={clsx(styles['playlist-track-title-play'], 'play')}
            icon={['fas', 'play']}
            onClick={props.onPlay}
          />
        )}
        <img
          alt={props.track.album.name}
          className={styles['playlist-track-title-image']}
          height={isMobile ? 48 : 36}
          src={props.track.album.images[2].url}
          width={isMobile ? 48 : 36}
          loading="lazy"
        />
        <Box className={styles['playlist-track-title-data']}>
          <div className={styles['playlist-track-title-data-name']}>
            {props.track.name}
          </div>
          <div className={styles['playlist-track-title-data-artists']}>
            {props.track.artists.map((artist, index) => (
              <Box
                key={artist.id}
                className={styles['playlist-track-title-data-artists-item']}
                sx={{ color: 'text.secondary' }}
              >
                {isMobile ? (
                  <>{artist.name}</>
                ) : (
                  <Link
                    key={artist.id}
                    classes={
                      styles['playlist-track-title-data-artists-item-link']
                    }
                    to={`/artist/${artist.id}`}
                  >
                    {artist.name}
                  </Link>
                )}
                {`${index < props.track.artists.length - 1 ? ',\xa0' : ''}`}
              </Box>
            ))}
          </div>
        </Box>
      </div>
      <Box
        className={styles['playlist-track-album']}
        sx={{ color: 'text.secondary' }}
      >
        {isMobile ? (
          <div>{props.track.album.name}</div>
        ) : (
          <Link to={`/album/${props.track.album.id}`}>
            {props.track.album.name}
          </Link>
        )}
      </Box>
      <Box
        className={styles['playlist-track-added-at']}
        sx={{ color: 'text.secondary' }}
      >
        {new Intl.DateTimeFormat(props.locale).format(
          new Date(props.track.added_at)
        )}
      </Box>
      <Box
        className={styles['playlist-track-more']}
        sx={{ color: 'text.secondary' }}
      >
        <span className={styles['playlist-track-more-duration']}>
          {minutesSecondsByMillisecondsGet(props.track.duration_ms)}
        </span>
        {isMobile ? (
          <IconButton
            classes={styles['playlist-track-more-button']}
            icon={['fas', 'ellipsis-v']}
            onClick={() => setDetailDrawer(true)}
          />
        ) : (
          <Menu
            classes={clsx(styles['playlist-track-more-button'], 'more')}
            hideItemIcon
            icon={['fas', 'ellipsis']}
            items={playlistTrackActionsGet(props.owner)}
            onAction={props.onAction}
          />
        )}
      </Box>
      <DetailDrawer
        items={playlistTrackActionsGet(props.owner)}
        image={props.track.album.images[1]?.url}
        open={detailDrawer}
        subtitle={`${props.track.artists[0].name} • ${props.track.album.name}`}
        title={props.track.name}
        type={ImageFallbackType.Playlist}
        onAction={props.onAction}
        onClose={() => setDetailDrawer(false)}
      />
    </Box>
  );
};

export default memo(PlaylistTrack, playlistPropsAreEqual);
