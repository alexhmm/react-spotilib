import { memo } from 'react';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './ArtistTopTrack.module.scss';

// Types
import { SpotifyTrack } from '../../../../shared/types/spotify.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';
import Link from '../../../../shared/ui/Link/Link';

// Utils
import { minutesSecondsByMillisecondsGet } from '../../../../shared/utils/shared.utils';

type ArtistTopTrackProps = {
  index: number;
  track: SpotifyTrack;
  onPlay: () => void;
};

const artistTopTrackPropsAreEqual = (
  prevProps: Readonly<ArtistTopTrackProps>,
  nextProps: Readonly<ArtistTopTrackProps>
): boolean => {
  if (prevProps.track.id === nextProps.track.id) {
    return true;
  }
  return false;
};

const ArtistTopTrack = (props: ArtistTopTrackProps) => {
  const { smDown } = useBreakpoints();

  return (
    <Box
      className={styles['artist-top-track']}
      sx={{
        '@media (hover: hover)': {
          ':hover': {
            backgroundColor: 'action.hover',
            '.index': {
              display: 'none',
            },
            '.play': {
              display: 'flex !important',
            },
          },
          '.app-link:hover': {
            color: 'primary.main',
          },
          '.play': {
            display: 'none !important',
          },
        },
      }}
      onClick={() => isMobile && props.onPlay()}
    >
      <div className={styles['artist-top-track-title']}>
        <Box
          className={clsx(styles['artist-top-track-title-index'], 'index')}
          sx={{ color: 'text.secondary' }}
        >
          {props.index + 1}
        </Box>
        {!isMobile && !smDown && (
          <IconButton
            classes={clsx(styles['artist-top-track-title-play'], 'play')}
            icon={['fas', 'play']}
            onClick={props.onPlay}
          />
        )}
        <img
          alt={props.track.album.name}
          className={clsx(styles['artist-top-track-title-image'], 'image')}
          height={40}
          src={props.track.album.images[2].url}
          width={40}
          loading="lazy"
        />
        <div className={styles['artist-top-track-title-name']}>
          {props.track.name}
        </div>
      </div>
      <Box
        className={styles['artist-top-track-album']}
        sx={{ color: 'text.secondary' }}
      >
        <Link to={`/album/${props.track.album.id}`}>
          {props.track.album.name}
        </Link>
      </Box>
      <Box
        className={styles['artist-top-track-duration']}
        sx={{ color: 'text.secondary' }}
      >
        {minutesSecondsByMillisecondsGet(props.track.duration_ms)}
      </Box>
    </Box>
  );
};

export default memo(ArtistTopTrack, artistTopTrackPropsAreEqual);
