import { memo } from 'react';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './PlaylistTrack.module.scss';

// Types
import { PlaylistTrack as IPlaylistTrack } from '../../playlist.types';
import {
  ImageFallbackType,
  TrackAction,
} from '../../../../shared/types/shared.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';
import Link from '../../../../shared/ui/Link/Link';

// Utils
import TrackMore from '../../../track/components/TrackMore/TrackMore';

type PlaylistTrackProps = {
  locale: string;
  index: number;
  owner?: boolean;
  track: IPlaylistTrack;
  onAction: (action: TrackAction) => void;
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
            '.favorite, .more': {
              visibility: 'visible',
            },
            '.play': {
              display: 'flex !important',
            },
          },
          '.app-link:hover': {
            color: 'primary.main',
          },
          '.favorite, .more': {
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
          height={isMobile ? 48 : 40}
          src={props.track.album.images[2].url}
          width={isMobile ? 48 : 40}
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
      <TrackMore
        duration={props.track.duration_ms}
        image={props.track.album.images[1]?.url}
        owner={props.owner}
        subtitle={`${props.track.artists[0].name} • ${props.track.album.name}`}
        title={props.track.name}
        type={ImageFallbackType.Playlist}
        onAction={props.onAction}
      />
    </Box>
  );
};

export default memo(PlaylistTrack, playlistPropsAreEqual);
