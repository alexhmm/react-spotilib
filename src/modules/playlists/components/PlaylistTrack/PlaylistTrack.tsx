import { memo } from 'react';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Hooks
import { useBreakpoints } from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './PlaylistTrack.module.scss';

// Types
import { TrackMetaData } from '../../../tracks/tracks.types';

// UI
import { IconButton } from '../../../../shared/ui/IconButton/IconButton';

// Utils
import { minutesSecondsByMillisecondsGet } from '../../../../shared/utils/shared.utils';

type PlaylistTrackProps = {
  locale: string;
  track: TrackMetaData;
  trackIndex: number;
  onPlay: () => void;
};

const playlistPropsAreEqual = (
  prevProps: Readonly<PlaylistTrackProps>,
  nextProps: Readonly<PlaylistTrackProps>
): boolean => {
  if (
    prevProps.locale === nextProps.locale &&
    prevProps.track.track.id === nextProps.track.track.id &&
    prevProps.trackIndex === nextProps.trackIndex
  ) {
    return true;
  }
  return false;
};

const PlaylistTrack = (props: PlaylistTrackProps) => {
  const { lgDown } = useBreakpoints();

  return (
    <Box
      className={styles['playlist-track']}
      sx={{
        ':hover': {
          backgroundColor: 'action.hover',
          '.index': {
            display: 'none',
          },
          '.play': {
            display: 'flex !important',
          },
        },
        '.play': {
          display: 'none !important',
        },
      }}
    >
      <div className={styles['playlist-track-title']}>
        <div className={styles['playlist-track-title-info']}>
          <Box
            className={clsx(styles['playlist-track-title-info-index'], 'index')}
            sx={{ color: 'text.secondary' }}
          >
            {props.trackIndex}
          </Box>
          <IconButton
            classes={clsx(styles['playlist-track-title-info-play'], 'play')}
            icon={['fas', 'play']}
            onClick={props.onPlay}
          />
        </div>
        <div className={styles['playlist-track-title-image']}>
          <img
            alt={props.track.track.album.name}
            height={lgDown ? 32 : 40}
            src={props.track.track.album.images[2].url}
            width={lgDown ? 32 : 40}
            loading="lazy"
          />
        </div>
        <div className={styles['playlist-track-title-data']}>
          <div className={styles['playlist-track-title-data-name']}>
            {props.track.track.name}
          </div>
          <div className={styles['playlist-track-title-data-artists']}>
            {props.track.track.artists.map((artist, index) => (
              <Box
                key={artist.id}
                className={styles['playlist-track-title-data-artists-item']}
                sx={{ color: 'text.secondary' }}
              >{`${artist.name}${
                index < props.track.track.artists.length - 1 ? ',\xa0' : ''
              }`}</Box>
            ))}
          </div>
        </div>
      </div>
      <Box
        className={styles['playlist-track-album']}
        sx={{ color: 'text.secondary' }}
      >
        {props.track.track.album.name}
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
        className={styles['playlist-track-duration']}
        sx={{ color: 'text.secondary' }}
      >
        {minutesSecondsByMillisecondsGet(props.track.track.duration_ms)}
      </Box>
    </Box>
  );
};

export default memo(PlaylistTrack, playlistPropsAreEqual);
