import { memo } from 'react';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './AlbumTrack.module.scss';

// Types
import { AlbumTrack as IAlbumTrack } from '../../album.types';
import {
  ImageFallbackType,
  TrackAction,
} from '../../../../shared/types/shared.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';
import Link from '../../../../shared/ui/Link/Link';

// Utils
import TrackMore from '../../../track/components/TrackMore/TrackMore';

type AlbumTrackProps = {
  image?: string;
  index: number;
  name: string;
  track: IAlbumTrack;
  onAction: (action: TrackAction) => void;
  onPlay: () => void;
};

const albumPropsAreEqual = (
  prevProps: Readonly<AlbumTrackProps>,
  nextProps: Readonly<AlbumTrackProps>
): boolean => {
  if (prevProps.track.id === nextProps.track.id) {
    return true;
  }
  return false;
};

const AlbumTrack = (props: AlbumTrackProps) => {
  const { smDown } = useBreakpoints();

  return (
    <Box
      className={styles['album-track']}
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
        className={styles['album-track-title']}
        onClick={() => isMobile && props.onPlay()}
      >
        <Box
          className={clsx(styles['album-track-title-index'], 'index')}
          sx={{ color: 'text.secondary' }}
        >
          {props.index + 1}
        </Box>
        {!isMobile && !smDown && (
          <IconButton
            classes={clsx(styles['album-track-title-play'], 'play')}
            icon={['fas', 'play']}
            onClick={props.onPlay}
          />
        )}
        <Box className={styles['album-track-title-data']}>
          <div className={styles['album-track-title-data-name']}>
            {props.track.name}
          </div>
          <div className={styles['album-track-title-data-artists']}>
            {props.track.artists.map((artist, index) => (
              <Box
                key={artist.id}
                className={styles['album-track-title-data-artists-item']}
                sx={{ color: 'text.secondary' }}
              >
                {isMobile ? (
                  <>{artist.name}</>
                ) : (
                  <Link
                    key={artist.id}
                    classes={styles['album-track-title-data-artists-item-link']}
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
      <TrackMore
        duration={props.track.duration_ms}
        image={props.image}
        subtitle={`${props.track.artists[0].name} • ${props.name}`}
        title={props.track.name}
        type={ImageFallbackType.Album}
        onAction={props.onAction}
      />
    </Box>
  );
};

export default memo(AlbumTrack, albumPropsAreEqual);
