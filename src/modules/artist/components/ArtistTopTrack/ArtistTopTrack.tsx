import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './ArtistTopTrack.module.scss';

// Types
import { SpotifyTrack } from '../../../../shared/types/spotify.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';

// Utils
import { minutesSecondsByMillisecondsGet } from '../../../../shared/utils/shared.utils';

type ArtistTopTrackProps = {
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
  return (
    <Box
      className={styles['artist-top-track']}
      sx={{
        ':hover': {
          backgroundColor: 'action.hover',
          '.image': {
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
      }}
    >
      <div className={styles['artist-top-track-title']}>
        <img
          alt={props.track.album.name}
          className={clsx(styles['artist-top-track-title-image'], 'image')}
          height={36}
          src={props.track.album.images[2].url}
          width={36}
          loading="lazy"
        />
        <IconButton
          classes={clsx(styles['artist-top-track-title-play'], 'play')}
          icon={['fas', 'play']}
          onClick={props.onPlay}
        />
        <div className={styles['artist-top-track-title-name']}>
          {props.track.name}
        </div>
      </div>
      <Box
        className={styles['artist-top-track-album']}
        sx={{ color: 'text.secondary' }}
      >
        <Link className="app-link" to={`/album/${props.track.album.id}`}>
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
