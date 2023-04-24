import { memo } from 'react';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Components
import TrackMore from '../../../track/components/TrackMore/TrackMore';
// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './ArtistTopTrack.module.scss';

// Types
import { ImageFallbackType } from '../../../../shared/types/shared.types';
import { SpotifyTrack } from '../../../../shared/types/spotify.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';
import Link from '../../../../shared/ui/Link/Link';

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
        className={styles['artist-top-track-title']}
        onClick={() => isMobile && props.onPlay()}
      >
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
        onClick={() => isMobile && props.onPlay()}
      >
        <Link to={`/album/${props.track.album.id}`}>
          {props.track.album.name}
        </Link>
      </Box>
      <TrackMore
        duration={props.track.duration_ms}
        image={props.track.album.images[2]?.url ?? undefined}
        subtitle={`${props.track.artists[0].name} • ${props.track.name}`}
        title={props.track.name}
        track={props.track}
        type={ImageFallbackType.Playlist}
      />
    </Box>
  );
};

export default memo(ArtistTopTrack, artistTopTrackPropsAreEqual);
